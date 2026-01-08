import { describe, it, expect, vi, beforeEach } from "vitest";
// Mock Roblox and Flamework
vi.mock("@flamework/core", () => ({
    Service: () => () => { },
    OnStart: {}
}));
vi.mock("@rbxts/services", () => ({
    Players: {
        PlayerRemoving: {
            Connect: vi.fn()
        },
        GetPlayerByUserId: vi.fn()
    },
    CollectionService: {
        GetTagged: vi.fn().mockReturnValue([])
    }
}));
vi.mock("server/events", () => ({
    Events: {
        CreateParty: { connect: vi.fn() },
        JoinParty: { connect: vi.fn() },
        LeaveParty: { connect: vi.fn() },
        SelectMercenary: { connect: vi.fn() },
        EquipItem: { connect: vi.fn() },
        SetReady: { connect: vi.fn() },
        SetMissionMode: { connect: vi.fn() },
        SetDifficulty: { connect: vi.fn() },
        LaunchMission: { connect: vi.fn() },
        PartyCreated: { fire: vi.fn() },
        PartyJoined: { fire: vi.fn() },
        PartyUpdated: { fire: vi.fn() },
        PartyLeft: { fire: vi.fn() },
        MissionLaunching: { fire: vi.fn() },
        UnlockedClassesUpdated: { fire: vi.fn() }
    }
}));

// We need to mock generatePartyCode too
vi.mock("shared/algorithms/party/code-generator", () => ({
    generatePartyCode: () => "ABCDEF"
}));

import { LobbyService } from "./LobbyService";
import { MissionMode } from "shared/domain/party/party-types";
import { CollectionService } from "@rbxts/services";
import { Events } from "server/events";

describe("LobbyService", () => {
    let lobbyService: LobbyService;
    let mockRunService: any;
    let mockClassService: any;

    beforeEach(() => {
        mockRunService = {
            startMatch: vi.fn().mockReturnValue(true)
        };
        mockClassService = {
            isClassUnlocked: vi.fn().mockReturnValue(true)
        };
        lobbyService = new LobbyService(mockRunService, mockClassService);
    });

    it("should allow solo launch if mercenary is selected and player is ready", () => {
        // Mock portal for proximity check
        const mockPortal = {
            IsA: () => true,
            Position: { sub: () => ({ Magnitude: 5 }) }
        };
        vi.mocked(CollectionService.GetTagged).mockReturnValue([mockPortal as any]);

        const mockPlayer = {
            UserId: 1,
            DisplayName: "Player1",
            Character: {
                GetPivot: () => ({ Position: { sub: () => ({ Magnitude: 5 }) } })
            }
        } as unknown as Player;

        // 1. Create party
        (lobbyService as any).createParty(mockPlayer);

        // 2. Select mercenary
        (lobbyService as any).selectMercenary(mockPlayer, "merc1");

        // 3. Set ready
        (lobbyService as any).setReady(mockPlayer, true);

        // 4. Launch
        (lobbyService as any).launchMission(mockPlayer);

        expect(mockRunService.startMatch).toHaveBeenCalled();
    });

    it("should NOT allow launch if mercenary is NOT selected", () => {
        const mockPlayer = { UserId: 1, DisplayName: "Player1" } as Player;

        (lobbyService as any).createParty(mockPlayer);
        (lobbyService as any).setReady(mockPlayer, true);
        (lobbyService as any).launchMission(mockPlayer);

        expect(mockRunService.startMatch).not.toHaveBeenCalled();
    });

    it("should cleanup room if host leaves", () => {
        const mockPlayer = { UserId: 1, DisplayName: "Player1" } as Player;
        (lobbyService as any).createParty(mockPlayer);

        // Host leaves
        (lobbyService as any).leaveParty(mockPlayer);

        // Try to join with another player using the code
        const mockPlayer2 = { UserId: 2, DisplayName: "Player2" } as Player;
        (lobbyService as any).joinParty(mockPlayer2, "ABCDEF");

        // If room was cleaned up, player2 won't be in a room
        expect((lobbyService as any).getRoom(mockPlayer2)).toBeUndefined();
    });

    it("should allow host to change mission mode", () => {
        const mockPlayer = { UserId: 1, DisplayName: "Player1" } as Player;
        (lobbyService as any).createParty(mockPlayer);

        (lobbyService as any).setMissionMode(mockPlayer, MissionMode.Ironman);

        const room = (lobbyService as any).getRoom(mockPlayer);
        expect(room.mode).toBe(MissionMode.Ironman);
    });

    it("should NOT allow non-host to change mission mode", () => {
        const mockHost = { UserId: 1, DisplayName: "Host" } as Player;
        const mockGuest = { UserId: 2, DisplayName: "Guest" } as Player;

        (lobbyService as any).createParty(mockHost);
        (lobbyService as any).joinParty(mockGuest, "ABCDEF");

        (lobbyService as any).setMissionMode(mockGuest, MissionMode.Ironman);

        const room = (lobbyService as any).getRoom(mockHost);
        expect(room.mode).toBe(MissionMode.Standard);
    });

    it("should allow host to cycle difficulty", () => {
        const mockPlayer = { UserId: 1, DisplayName: "Player1" } as Player;
        (lobbyService as any).createParty(mockPlayer);

        (lobbyService as any).setDifficulty(mockPlayer, 3);

        const room = (lobbyService as any).getRoom(mockPlayer);
        expect(room.difficulty).toBe(3);
    });

    it("should allow multi-player launch only when ALL are ready", () => {
        // Mock portal for proximity check
        const mockPortal = {
            IsA: () => true,
            Position: { sub: () => ({ Magnitude: 5 }) }
        };
        vi.mocked(CollectionService.GetTagged).mockReturnValue([mockPortal as any]);

        const mockCharacter = {
            GetPivot: () => ({ Position: { sub: () => ({ Magnitude: 5 }) } })
        };
        const mockHost = { UserId: 1, DisplayName: "Host", Character: mockCharacter } as unknown as Player;
        const mockGuest = { UserId: 2, DisplayName: "Guest", Character: mockCharacter } as unknown as Player;

        (lobbyService as any).createParty(mockHost);
        (lobbyService as any).joinParty(mockGuest, "ABCDEF");

        // Host ready
        (lobbyService as any).selectMercenary(mockHost, "merc1");
        (lobbyService as any).setReady(mockHost, true);

        // Try launch - should fail (guest not ready)
        (lobbyService as any).launchMission(mockHost);
        expect(mockRunService.startMatch).not.toHaveBeenCalled();

        // Guest ready
        (lobbyService as any).selectMercenary(mockGuest, "merc2");
        (lobbyService as any).setReady(mockGuest, true);

        // Try launch - should succeed
        (lobbyService as any).launchMission(mockHost);
        expect(mockRunService.startMatch).toHaveBeenCalled();
    });

    it("should allow selecting gear", () => {
        const mockPlayer = { UserId: 1, DisplayName: "Player1" } as Player;
        (lobbyService as any).createParty(mockPlayer);

        (lobbyService as any).equipItem(mockPlayer, "Weapon", "iron-sword");

        const room = (lobbyService as any).getRoom(mockPlayer);
        expect(room.members[0].loadout.Weapon).toBe("iron-sword");
    });

    it("should filter locked classes during sync", () => {
        const mockPlayer = { UserId: 1, DisplayName: "Player1" } as Player;

        // Mock ClassService to only unlock 'shield-saint'
        mockClassService.isClassUnlocked.mockImplementation((_uid: number, classId: string) => {
            return classId === "shield-saint";
        });

        // Trigger sync
        (lobbyService as any).syncUnlocks(mockPlayer);

        // Verify event fired with filtered list
        expect(Events.UnlockedClassesUpdated.fire).toHaveBeenCalledWith(mockPlayer, ["shield-saint"]);
    });
});
