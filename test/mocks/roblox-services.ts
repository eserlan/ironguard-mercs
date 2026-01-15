export const Players = {
    PlayerRemoving: {
        Connect: () => {}
    },
    GetPlayerByUserId: () => {}
};

export const HttpService = {
    GenerateGUID: (wrapped?: boolean) => "MOCK_GUID_" + Math.random().toString(36).substring(7),
    JSONEncode: (val: any) => JSON.stringify(val),
    JSONDecode: (val: string) => JSON.parse(val),
};

export const RunService = {
    Heartbeat: {
        Connect: () => {}
    }
};

export const ReplicatedStorage = {
    FindFirstChild: () => undefined
};