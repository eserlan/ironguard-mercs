import { TileAsset, Connector, ConnectorDirection } from "../domain/TileDefs";

export function findMatchingConnector(source: Connector, targetTile: TileAsset): Connector | undefined {
    return targetTile.connectors.find(c => isOpposite(c.direction, source.direction));
}

function isOpposite(d1: ConnectorDirection, d2: ConnectorDirection): boolean {
    if (d1 === ConnectorDirection.North && d2 === ConnectorDirection.South) return true;
    if (d1 === ConnectorDirection.South && d2 === ConnectorDirection.North) return true;
    if (d1 === ConnectorDirection.East && d2 === ConnectorDirection.West) return true;
    if (d1 === ConnectorDirection.West && d2 === ConnectorDirection.East) return true;
    return false;
}
