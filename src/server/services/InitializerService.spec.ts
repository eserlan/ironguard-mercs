import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Roblox Services
vi.mock("@rbxts/services", () => ({
    Players: {
        PlayerAdded: { Connect: vi.fn() },
        GetPlayers: vi.fn().mockReturnValue([]),
    },
}));

import { InitializerService } from "./InitializerService";

describe("InitializerService", () => {
    let initializerService: InitializerService;
    let mockRunService: any;
    let mockClassService: any;
    let mockGearService: any;
    let mockPlayerVisualService: any;

    beforeEach(() => {
        mockRunService = {
            getSessionMember: vi.fn(),
            isSafeRoom: vi.fn().mockReturnValue(true)
        };
        mockClassService = {
            applyClassToPlayer: vi.fn()
        };
        mockGearService = {
            applyLoadoutToPlayer: vi.fn()
        };
        mockPlayerVisualService = {
            applyWeaponModel: vi.fn()
        };
        initializerService = new InitializerService(
            mockRunService,
            mockClassService,
            mockGearService,
            mockPlayerVisualService
        );
    });

    it("should initialize character if session data exists", () => {
        const mockPlayer = { UserId: 1, Name: "Player1" } as Player;
        const mockCharacter = { Name: "Char1" } as Model;
        const mockSession = {
            selectedMercenaryId: "merc1",
            loadout: { Weapon: "sword" }
        };

        mockRunService.getSessionMember.mockReturnValue(mockSession);

        (initializerService as any).onCharacterAdded(mockPlayer, mockCharacter);

        expect(mockClassService.applyClassToPlayer).toHaveBeenCalledWith(mockPlayer, "merc1");
        expect(mockGearService.applyLoadoutToPlayer).toHaveBeenCalledWith(mockPlayer, mockSession.loadout);
    });

    it("should NOT initialize if session data is missing", () => {
        const mockPlayer = { UserId: 1, Name: "Player1" } as Player;
        const mockCharacter = { Name: "Char1" } as Model;

        mockRunService.getSessionMember.mockReturnValue(undefined);

        (initializerService as any).onCharacterAdded(mockPlayer, mockCharacter);

        expect(mockClassService.applyClassToPlayer).not.toHaveBeenCalled();
        expect(mockGearService.applyLoadoutToPlayer).not.toHaveBeenCalled();
    });
});
