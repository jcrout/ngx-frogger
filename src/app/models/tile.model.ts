import { Constants } from '../constants';

export class Tile {
    id: number;
    cssClass?: string;
    width?: number;
    height?: number;
}

export class Tiles {
    static Path = <Tile>{
        id: Constants.TileIds.Path, 
        cssClass: Constants.RowTileClasses.Path,
        width: 48,
        height: 48
    }
    static Road = <Tile>{
        id: Constants.TileIds.Road, 
        cssClass: Constants.RowTileClasses.Road,
        width: 48,
        height: 48
    }
    static Water = <Tile>{
        id: Constants.TileIds.Water, 
        cssClass: Constants.RowTileClasses.Water,
        width: 48,
        height: 48
    }
    static Goal = <Tile>{
        id: Constants.TileIds.Goal, 
        cssClass: Constants.RowTileClasses.Goal,
        width: 132,
        height: 72
    }    
}