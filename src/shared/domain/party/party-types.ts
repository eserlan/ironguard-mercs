export enum LobbyState {
	Idle = "Idle",
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
	isReady: boolean;
}

export interface PartyRoom {
	code: string;
	hostId: string;
	mode: MissionMode;
	members: PartyMember[];
	createdAt: number;
}
