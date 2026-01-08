--[[
	Lobby Asset Generator for IronGuard Mercs
	Run this script in Roblox Studio Command Bar to generate lobby hub assets.

	Based on spec: 009-lobby-system

	Layout:
	- Spawn Point (bottom)
	- Mercenary Locker (left of spawn)
	- Gear Bench (right of spawn)
	- Party Pad (center, circular with 4 spots)
	- Difficulty Pedestal (left of party pad)
	- Mode Banner (right of party pad)
	- Dungeon Portal (top, large glowing portal)
]]

local Workspace = game:GetService("Workspace")
local ServerStorage = game:GetService("ServerStorage")

-- Configuration
local LOBBY_ORIGIN = Vector3.new(0, 0, 0)
local GROUND_Y = 0.5

-- Helper functions
local function createPart(props)
	local part = Instance.new("Part")
	part.Anchored = true
	part.CanCollide = props.CanCollide ~= false
	part.Name = props.Name or "Part"
	part.Size = props.Size or Vector3.new(4, 1, 4)
	part.Position = props.Position or Vector3.new(0, 0, 0)
	part.Color = props.Color or Color3.fromRGB(128, 128, 128)
	part.Material = props.Material or Enum.Material.SmoothPlastic
	part.Transparency = props.Transparency or 0
	part.Shape = props.Shape or Enum.PartType.Block
	part.Parent = props.Parent or Workspace

	if props.CFrame then
		part.CFrame = props.CFrame
	end

	return part
end

local function createModel(name, parent)
	local model = Instance.new("Model")
	model.Name = name
	model.Parent = parent or Workspace
	return model
end

local function addCollectionTag(instance, tag)
	local CollectionService = game:GetService("CollectionService")
	CollectionService:AddTag(instance, tag)
end

local function createProximityPrompt(parent, props)
	local prompt = Instance.new("ProximityPrompt")
	prompt.ObjectText = props.ObjectText or ""
	prompt.ActionText = props.ActionText or "Interact"
	prompt.HoldDuration = props.HoldDuration or 0
	prompt.MaxActivationDistance = props.MaxActivationDistance or 8
	prompt.Parent = parent
	return prompt
end

local function createPointLight(parent, props)
	local light = Instance.new("PointLight")
	light.Color = props.Color or Color3.fromRGB(255, 255, 255)
	light.Brightness = props.Brightness or 1
	light.Range = props.Range or 16
	light.Parent = parent
	return light
end

local function createSurfaceGui(parent, text, props)
	local gui = Instance.new("SurfaceGui")
	gui.Face = props.Face or Enum.NormalId.Front
	gui.Parent = parent

	local label = Instance.new("TextLabel")
	label.Size = UDim2.new(1, 0, 1, 0)
	label.BackgroundTransparency = 1
	label.Text = text
	label.TextColor3 = props.TextColor or Color3.fromRGB(255, 255, 255)
	label.TextScaled = true
	label.Font = Enum.Font.GothamBold
	label.Parent = gui

	return gui
end

-- Create the lobby folder
local lobbyFolder = Instance.new("Folder")
lobbyFolder.Name = "Lobby"
lobbyFolder.Parent = Workspace

print("Creating Lobby Assets...")

--------------------------------------------------
-- 1. SPAWN POINT
--------------------------------------------------
local spawnPoint = Instance.new("SpawnLocation")
spawnPoint.Name = "LobbySpawn"
spawnPoint.Size = Vector3.new(6, 1, 6)
spawnPoint.Position = LOBBY_ORIGIN + Vector3.new(0, GROUND_Y, 40)
spawnPoint.Anchored = true
spawnPoint.Color = Color3.fromRGB(80, 80, 80)
spawnPoint.Material = Enum.Material.Concrete
spawnPoint.Neutral = true
spawnPoint.Parent = lobbyFolder
addCollectionTag(spawnPoint, "LobbySpawn")
print("  ✓ Spawn Point created")

--------------------------------------------------
-- 2. MERCENARY LOCKER (left of spawn)
--------------------------------------------------
local lockerModel = createModel("MercenaryLocker", lobbyFolder)

-- Locker cabinet
local lockerBody = createPart({
	Name = "LockerBody",
	Size = Vector3.new(6, 8, 2),
	Position = LOBBY_ORIGIN + Vector3.new(-12, GROUND_Y + 4, 35),
	Color = Color3.fromRGB(60, 60, 70),
	Material = Enum.Material.Metal,
	Parent = lockerModel
})

-- Locker doors (visual)
local lockerDoor1 = createPart({
	Name = "LockerDoor1",
	Size = Vector3.new(2.8, 7, 0.2),
	Position = LOBBY_ORIGIN + Vector3.new(-13.4, GROUND_Y + 4, 34),
	Color = Color3.fromRGB(100, 100, 110),
	Material = Enum.Material.Metal,
	Parent = lockerModel
})

local lockerDoor2 = createPart({
	Name = "LockerDoor2",
	Size = Vector3.new(2.8, 7, 0.2),
	Position = LOBBY_ORIGIN + Vector3.new(-10.6, GROUND_Y + 4, 34),
	Color = Color3.fromRGB(100, 100, 110),
	Material = Enum.Material.Metal,
	Parent = lockerModel
})

-- Interaction point
local lockerInteract = createPart({
	Name = "InteractionPoint",
	Size = Vector3.new(4, 0.2, 4),
	Position = LOBBY_ORIGIN + Vector3.new(-12, GROUND_Y, 32),
	Color = Color3.fromRGB(200, 150, 50),
	Material = Enum.Material.Neon,
	Transparency = 0.5,
	CanCollide = false,
	Parent = lockerModel
})

createProximityPrompt(lockerBody, {
	ObjectText = "Mercenary Locker",
	ActionText = "Select Mercenary"
})

lockerModel.PrimaryPart = lockerBody
addCollectionTag(lockerModel, "MercenaryLocker")
print("  ✓ Mercenary Locker created")

--------------------------------------------------
-- 3. GEAR BENCH (right of spawn)
--------------------------------------------------
local benchModel = createModel("GearBench", lobbyFolder)

-- Workbench top
local benchTop = createPart({
	Name = "BenchTop",
	Size = Vector3.new(8, 0.5, 4),
	Position = LOBBY_ORIGIN + Vector3.new(12, GROUND_Y + 3, 35),
	Color = Color3.fromRGB(139, 90, 43),
	Material = Enum.Material.Wood,
	Parent = benchModel
})

-- Bench legs
for i, offset in ipairs({{-3, -1.5}, {3, -1.5}, {-3, 1.5}, {3, 1.5}}) do
	createPart({
		Name = "Leg" .. i,
		Size = Vector3.new(0.5, 2.5, 0.5),
		Position = LOBBY_ORIGIN + Vector3.new(12 + offset[1], GROUND_Y + 1.25, 35 + offset[2]),
		Color = Color3.fromRGB(101, 67, 33),
		Material = Enum.Material.Wood,
		Parent = benchModel
	})
end

-- Tool rack behind bench
local toolRack = createPart({
	Name = "ToolRack",
	Size = Vector3.new(8, 4, 0.3),
	Position = LOBBY_ORIGIN + Vector3.new(12, GROUND_Y + 5.5, 37),
	Color = Color3.fromRGB(80, 50, 30),
	Material = Enum.Material.Wood,
	Parent = benchModel
})

createProximityPrompt(benchTop, {
	ObjectText = "Gear Bench",
	ActionText = "Modify Loadout"
})

benchModel.PrimaryPart = benchTop
addCollectionTag(benchModel, "GearBench")
print("  ✓ Gear Bench created")

--------------------------------------------------
-- 4. PARTY PAD (center, circular with 4 spots)
--------------------------------------------------
local partyPadModel = createModel("PartyPad", lobbyFolder)

-- Main circular pad
local mainPad = createPart({
	Name = "MainPad",
	Size = Vector3.new(16, 0.5, 16),
	Position = LOBBY_ORIGIN + Vector3.new(0, GROUND_Y, 15),
	Color = Color3.fromRGB(50, 50, 60),
	Material = Enum.Material.Concrete,
	Shape = Enum.PartType.Cylinder,
	Parent = partyPadModel
})
mainPad.CFrame = CFrame.new(LOBBY_ORIGIN + Vector3.new(0, GROUND_Y, 15)) * CFrame.Angles(0, 0, math.rad(90))

-- 4 player spots (arranged in a circle)
local spotPositions = {
	{x = -4, z = 11}, -- Front left
	{x = 4, z = 11},  -- Front right
	{x = -4, z = 19}, -- Back left
	{x = 4, z = 19}   -- Back right
}

for i, pos in ipairs(spotPositions) do
	local spot = createPart({
		Name = "PlayerSpot" .. i,
		Size = Vector3.new(4, 0.6, 4),
		Position = LOBBY_ORIGIN + Vector3.new(pos.x, GROUND_Y + 0.05, pos.z),
		Color = Color3.fromRGB(100, 180, 255),
		Material = Enum.Material.Neon,
		Shape = Enum.PartType.Cylinder,
		Transparency = 0.3,
		Parent = partyPadModel
	})
	spot.CFrame = CFrame.new(LOBBY_ORIGIN + Vector3.new(pos.x, GROUND_Y + 0.05, pos.z)) * CFrame.Angles(0, 0, math.rad(90))
	addCollectionTag(spot, "PartySpot")
end

-- Room code display (billboard above pad)
local codeDisplay = createPart({
	Name = "RoomCodeDisplay",
	Size = Vector3.new(6, 2, 0.2),
	Position = LOBBY_ORIGIN + Vector3.new(0, GROUND_Y + 10, 15),
	Color = Color3.fromRGB(30, 30, 40),
	Material = Enum.Material.SmoothPlastic,
	Transparency = 0.3,
	CanCollide = false,
	Parent = partyPadModel
})

local billboardGui = Instance.new("BillboardGui")
billboardGui.Size = UDim2.new(8, 0, 3, 0)
billboardGui.StudsOffset = Vector3.new(0, 0, 0)
billboardGui.AlwaysOnTop = true
billboardGui.Parent = codeDisplay

local codeLabel = Instance.new("TextLabel")
codeLabel.Name = "RoomCode"
codeLabel.Size = UDim2.new(1, 0, 1, 0)
codeLabel.BackgroundTransparency = 1
codeLabel.Text = "ROOM: ----"
codeLabel.TextColor3 = Color3.fromRGB(100, 200, 255)
codeLabel.TextScaled = true
codeLabel.Font = Enum.Font.Code
codeLabel.Parent = billboardGui

partyPadModel.PrimaryPart = mainPad
addCollectionTag(partyPadModel, "PartyPad")
print("  ✓ Party Pad created")

--------------------------------------------------
-- 5. DIFFICULTY PEDESTAL (left of party pad)
--------------------------------------------------
local difficultyModel = createModel("DifficultyPedestal", lobbyFolder)

-- Pedestal base
local pedestalBase = createPart({
	Name = "PedestalBase",
	Size = Vector3.new(3, 0.5, 3),
	Position = LOBBY_ORIGIN + Vector3.new(-12, GROUND_Y, 5),
	Color = Color3.fromRGB(80, 80, 90),
	Material = Enum.Material.Marble,
	Parent = difficultyModel
})

-- Pedestal column
local pedestalColumn = createPart({
	Name = "PedestalColumn",
	Size = Vector3.new(2, 3, 2),
	Position = LOBBY_ORIGIN + Vector3.new(-12, GROUND_Y + 2, 5),
	Color = Color3.fromRGB(90, 90, 100),
	Material = Enum.Material.Marble,
	Parent = difficultyModel
})

-- Crystal orb (difficulty indicator)
local difficultyOrb = createPart({
	Name = "DifficultyOrb",
	Size = Vector3.new(2, 2, 2),
	Position = LOBBY_ORIGIN + Vector3.new(-12, GROUND_Y + 4.5, 5),
	Color = Color3.fromRGB(50, 255, 100), -- Green = easy, will change based on difficulty
	Material = Enum.Material.Glass,
	Transparency = 0.3,
	Shape = Enum.PartType.Ball,
	Parent = difficultyModel
})

createPointLight(difficultyOrb, {
	Color = Color3.fromRGB(50, 255, 100),
	Brightness = 2,
	Range = 12
})

-- Difficulty value storage
local difficultyValue = Instance.new("IntValue")
difficultyValue.Name = "DifficultyLevel"
difficultyValue.Value = 1
difficultyValue.Parent = difficultyModel

createProximityPrompt(pedestalColumn, {
	ObjectText = "Difficulty",
	ActionText = "Change Difficulty"
})

difficultyModel.PrimaryPart = pedestalColumn
addCollectionTag(difficultyModel, "DifficultyPedestal")
print("  ✓ Difficulty Pedestal created")

--------------------------------------------------
-- 6. MODE BANNER (right of party pad)
--------------------------------------------------
local bannerModel = createModel("ModeBanner", lobbyFolder)

-- Banner pole
local bannerPole = createPart({
	Name = "BannerPole",
	Size = Vector3.new(0.5, 8, 0.5),
	Position = LOBBY_ORIGIN + Vector3.new(12, GROUND_Y + 4, 5),
	Color = Color3.fromRGB(101, 67, 33),
	Material = Enum.Material.Wood,
	Parent = bannerModel
})

-- Banner fabric
local bannerFabric = createPart({
	Name = "BannerFabric",
	Size = Vector3.new(4, 5, 0.2),
	Position = LOBBY_ORIGIN + Vector3.new(12, GROUND_Y + 5.5, 5.5),
	Color = Color3.fromRGB(50, 100, 200), -- Blue = Standard mode
	Material = Enum.Material.Fabric,
	Parent = bannerModel
})

createSurfaceGui(bannerFabric, "STANDARD", {
	Face = Enum.NormalId.Front,
	TextColor = Color3.fromRGB(255, 255, 255)
})

createSurfaceGui(bannerFabric, "STANDARD", {
	Face = Enum.NormalId.Back,
	TextColor = Color3.fromRGB(255, 255, 255)
})

-- Mode value storage
local modeValue = Instance.new("StringValue")
modeValue.Name = "GameMode"
modeValue.Value = "Standard"
modeValue.Parent = bannerModel

createProximityPrompt(bannerPole, {
	ObjectText = "Game Mode",
	ActionText = "Toggle Mode"
})

bannerModel.PrimaryPart = bannerPole
addCollectionTag(bannerModel, "ModeBanner")
print("  ✓ Mode Banner created")

--------------------------------------------------
-- 7. DUNGEON PORTAL (top, large glowing portal)
--------------------------------------------------
local portalModel = createModel("DungeonPortal", lobbyFolder)

-- Portal frame (archway)
local frameLeft = createPart({
	Name = "FrameLeft",
	Size = Vector3.new(2, 12, 2),
	Position = LOBBY_ORIGIN + Vector3.new(-6, GROUND_Y + 6, -10),
	Color = Color3.fromRGB(40, 40, 50),
	Material = Enum.Material.Slate,
	Parent = portalModel
})

local frameRight = createPart({
	Name = "FrameRight",
	Size = Vector3.new(2, 12, 2),
	Position = LOBBY_ORIGIN + Vector3.new(6, GROUND_Y + 6, -10),
	Color = Color3.fromRGB(40, 40, 50),
	Material = Enum.Material.Slate,
	Parent = portalModel
})

local frameTop = createPart({
	Name = "FrameTop",
	Size = Vector3.new(14, 2, 2),
	Position = LOBBY_ORIGIN + Vector3.new(0, GROUND_Y + 13, -10),
	Color = Color3.fromRGB(40, 40, 50),
	Material = Enum.Material.Slate,
	Parent = portalModel
})

-- Portal surface (the actual portal)
local portalSurface = createPart({
	Name = "PortalSurface",
	Size = Vector3.new(10, 10, 0.5),
	Position = LOBBY_ORIGIN + Vector3.new(0, GROUND_Y + 6, -10),
	Color = Color3.fromRGB(100, 50, 200),
	Material = Enum.Material.Neon,
	Transparency = 0.5,
	CanCollide = false,
	Parent = portalModel
})

-- Portal glow
createPointLight(portalSurface, {
	Color = Color3.fromRGB(150, 100, 255),
	Brightness = 3,
	Range = 24
})

-- Secondary glow effect
local portalGlow = createPart({
	Name = "PortalGlow",
	Size = Vector3.new(12, 12, 1),
	Position = LOBBY_ORIGIN + Vector3.new(0, GROUND_Y + 6, -10.5),
	Color = Color3.fromRGB(80, 40, 160),
	Material = Enum.Material.Neon,
	Transparency = 0.7,
	CanCollide = false,
	Parent = portalModel
})

-- Portal trigger zone
local portalTrigger = createPart({
	Name = "PortalTrigger",
	Size = Vector3.new(10, 10, 4),
	Position = LOBBY_ORIGIN + Vector3.new(0, GROUND_Y + 6, -10),
	Color = Color3.fromRGB(255, 255, 255),
	Transparency = 1,
	CanCollide = false,
	Parent = portalModel
})

-- Ready state indicator
local readyValue = Instance.new("BoolValue")
readyValue.Name = "IsReady"
readyValue.Value = false
readyValue.Parent = portalModel

-- Status text above portal
local statusPart = createPart({
	Name = "StatusDisplay",
	Size = Vector3.new(0.1, 0.1, 0.1),
	Position = LOBBY_ORIGIN + Vector3.new(0, GROUND_Y + 16, -10),
	Transparency = 1,
	CanCollide = false,
	Parent = portalModel
})

local statusGui = Instance.new("BillboardGui")
statusGui.Size = UDim2.new(12, 0, 2, 0)
statusGui.AlwaysOnTop = true
statusGui.Parent = statusPart

local statusLabel = Instance.new("TextLabel")
statusLabel.Name = "StatusText"
statusLabel.Size = UDim2.new(1, 0, 1, 0)
statusLabel.BackgroundTransparency = 1
statusLabel.Text = "SELECT MERCENARY TO ENTER"
statusLabel.TextColor3 = Color3.fromRGB(255, 200, 100)
statusLabel.TextScaled = true
statusLabel.Font = Enum.Font.GothamBold
statusLabel.Parent = statusGui

portalModel.PrimaryPart = portalSurface
addCollectionTag(portalModel, "DungeonPortal")
print("  ✓ Dungeon Portal created")

--------------------------------------------------
-- 8. FLOOR
--------------------------------------------------
local floor = createPart({
	Name = "LobbyFloor",
	Size = Vector3.new(80, 1, 100),
	Position = LOBBY_ORIGIN + Vector3.new(0, 0, 15),
	Color = Color3.fromRGB(45, 45, 50),
	Material = Enum.Material.Concrete,
	Parent = lobbyFolder
})
print("  ✓ Floor created")

--------------------------------------------------
-- 9. AMBIENT LIGHTING
--------------------------------------------------
local ambientLights = createModel("AmbientLighting", lobbyFolder)

-- Ceiling lights
for x = -20, 20, 20 do
	for z = -5, 35, 20 do
		local lightPart = createPart({
			Name = "CeilingLight",
			Size = Vector3.new(4, 0.5, 4),
			Position = LOBBY_ORIGIN + Vector3.new(x, GROUND_Y + 15, z),
			Color = Color3.fromRGB(255, 250, 240),
			Material = Enum.Material.Neon,
			Transparency = 0.5,
			CanCollide = false,
			Parent = ambientLights
		})

		createPointLight(lightPart, {
			Color = Color3.fromRGB(255, 250, 240),
			Brightness = 1,
			Range = 30
		})
	end
end
print("  ✓ Ambient Lighting created")

--------------------------------------------------
-- DONE
--------------------------------------------------
print("")
print("═══════════════════════════════════════════")
print("  LOBBY ASSETS CREATED SUCCESSFULLY!")
print("═══════════════════════════════════════════")
print("")
print("Assets created in Workspace.Lobby:")
print("  • LobbySpawn - Player spawn point")
print("  • MercenaryLocker - Select mercenary")
print("  • GearBench - Modify loadout")
print("  • PartyPad - 4-player party formation")
print("  • DifficultyPedestal - Set difficulty 1-5")
print("  • ModeBanner - Toggle Standard/Ironman")
print("  • DungeonPortal - Mission launch portal")
print("  • LobbyFloor - Ground plane")
print("  • AmbientLighting - Ceiling lights")
print("")
print("CollectionService Tags added:")
print("  • LobbySpawn, MercenaryLocker, GearBench")
print("  • PartyPad, PartySpot, DifficultyPedestal")
print("  • ModeBanner, DungeonPortal")
print("")
print("Next steps:")
print("  1. Create Flamework components for each tagged element")
print("  2. Wire up ProximityPrompt events to LobbyController")
print("  3. Implement LobbyService for party state management")
print("")

