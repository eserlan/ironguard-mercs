export enum LobbyState {
	Idle = "Idle",
	AtStation = "AtStation",
	Creating = "Creating",
	Joining = "Joining",
	InParty = "InParty",
	Ready = "Ready",
	Launching = "Launching",
}

export enum MissionMode {
	Standard = "Standard",
	Ironman = "Ironman",
}

export interface PartyMember {
	playerId: string;
	displayName: string;
	selectedMercenaryId?: string;
	loadout?: Record<string, string>; // EquipmentSlot -> gearId
	isReady: boolean;
	isOnPad: boolean;
}

export interface PartyRoom {
	code: string;
	hostId: string;
	mode: MissionMode;
	difficulty: number;
	members: PartyMember[];
	createdAt: number;
}