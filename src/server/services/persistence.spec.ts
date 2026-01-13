import { describe, it, expect, vi, beforeEach } from "vitest";

// Mocks
const mockBindableEvent = {
    Event: { Connect: vi.fn() },
    Fire: vi.fn(),
};

const mockSignal = {
    connect: vi.fn(),
    fire: vi.fn(),
};

// Mock Dependencies
vi.mock("@flamework/core", () => ({
    Service: () => () => { },
    Controller: () => () => { },
}));

vi.mock("@rbxts/services", () => ({
    DataStoreService: {
        GetDataStore: () => ({
            GetAsync: vi.fn().mockReturnValue([undefined, undefined]), // Default: no data
            UpdateAsync: vi.fn(),
        }),
    },
    Players: {
        PlayerAdded: { Connect: vi.fn() },
        PlayerRemoving: { Connect: vi.fn() },
        GetPlayers: () => [],
    },
    HttpService: {
        GenerateGUID: () => "test-guid",
    },
}));

// Mock Events
vi.mock("server/events", () => ({
    Events: {
        SetLoadout: { connect: vi.fn() },
        SelectClass: { connect: vi.fn() },
        LoadoutConfirmed: { fire: vi.fn() },
        LoadoutRejected: { fire: vi.fn() },
        ProfileUpdated: { fire: vi.fn() },
    },
}));

// Mock Class Registry
vi.mock("../../shared/domain/classes/config", () => ({
    ClassRegistry: {
        get: vi.fn((id) => id === "warrior" || id === "mage" ? {} : undefined),
    },
}));

// Import Services (after mocks)
import { PlayerDataService } from "./PlayerDataService";
import { LoadoutService } from "./LoadoutService";
import { DEFAULT_PROFILE } from "../../shared/data/profiles";
import { Events } from "../events"; // Mocked

describe("Persistence Integration", () => {
    let playerDataService: any; // Type 'any' to access private members for testing
    let loadoutService: any;
    let mockProfileLoadedConnection: any;

    beforeEach(() => {
        vi.clearAllMocks();

        // Reset BindableEvent mock manually
        mockBindableEvent.Event.Connect.mockImplementation((cb) => {
            mockProfileLoadedConnection = cb;
            return { Disconnect: () => { } };
        });
        mockBindableEvent.Fire.mockImplementation((p, profile) => {
            if (mockProfileLoadedConnection) {
                mockProfileLoadedConnection(p, profile);
            }
        });

        // Mock Instance as a class/constructor
        class MockInstance {
            constructor(className: string) {
                if (className === "BindableEvent") return mockBindableEvent;
                return {};
            }
        }
        global.Instance = MockInstance as any;

        // Mock global game object
        global.game = {
            BindToClose: vi.fn(),
            GetService: vi.fn(),
        } as any;

        // Mock global task object to prevent infinite loops in autosave
        global.task = {
            spawn: vi.fn(), // Don't run background tasks in unit tests
            wait: vi.fn(),
            delay: vi.fn(),
        } as any;

        // Instantiate services
        playerDataService = new PlayerDataService();
        loadoutService = new LoadoutService(playerDataService); // Inject dependency manually

        // Initialize
        playerDataService.onInit();
        playerDataService.onStart();
        loadoutService.onStart();
    });

    it("should restore last selected class and loadout on profile load", async () => {
        const mockPlayer = { UserId: 123, Name: "TestPlayer", Kick: vi.fn() };

        // Mock stored profile data
        const storedProfile = {
            ...DEFAULT_PROFILE,
            Global: { LastSelectedClassId: "mage" },
            Classes: {
                "mage": { Level: 5, XP: 500, Loadout: ["fireball"] }
            }
        };

        // Mock DataStore return
        const mockDataStore = (playerDataService as any).dataStore;
        mockDataStore.GetAsync.mockReturnValue([storedProfile, {}]);

        // Simulating manual load (since PlayerAdded mock doesn't auto-run in this unit context without more wiring)
        await (playerDataService as any).loadProfile(mockPlayer);

        // Verify onProfileLoaded fired
        expect(mockBindableEvent.Fire).toHaveBeenCalled();

        // Verify LoadoutService restored state
        const loadout = loadoutService.getLoadout(123);
        expect(loadout).toBeDefined();
        expect(loadout.classId).toBe("mage");
        expect(loadout.equippedSlots).toHaveLength(1);
        expect(loadout.equippedSlots[0].abilityId).toBe("fireball");

        // Verify client was notified
        expect(Events.LoadoutConfirmed.fire).toHaveBeenCalledWith(
            mockPlayer,
            "mage",
            expect.arrayContaining([{ slotIndex: 0, abilityId: "fireball" }])
        );
    });

    it("should persist class selection", () => {
        const mockPlayer = { UserId: 456, Name: "Selector" };

        // Setup initial state
        (playerDataService as any).profiles.set(456, { ...DEFAULT_PROFILE });

        // Simulate call
        (loadoutService as any).handleSelectClass(mockPlayer, "warrior");

        // Verify persistence
        const profile = playerDataService.getProfile(mockPlayer);
        expect(profile.Global.LastSelectedClassId).toBe("warrior");
    });
});
