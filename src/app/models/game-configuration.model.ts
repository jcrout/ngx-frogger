import { Injectable } from '@angular/core';
import { Constants } from '../constants';
import { IEntity, Entities } from './entity.model';
import { MoveDirection } from './custom-types.model';
import { Tile, Tiles } from './tile.model';

@Injectable()
export class GameConfiguration {
    entities = <IEntity[]>[
        Entities.Frogger,
        Entities.Car1
    ];
    tiles = <Tile[]>[
        Tiles.Path,
        Tiles.Road,
        Tiles.Water,
        Tiles.Goal
    ];
    startLives = 3;
    startRow = 0;
    tileSize = 48;
    rowTiles = 14; // 14 rows of 48x48 tiles
    backgroundColor = 'black';
    gridRows = <RowConfiguration[]>[
        <RowConfiguration>{
            rowClass: Constants.RowClasses.Path,
            tileId: Constants.TileIds.Path
        },
        <RowConfiguration>{
            entities: [
                <RowEntityConfiguration>{
                    entityId: Constants.EntityIds.Car1,
                    chance: 1.00
                }
            ],
            rowClass: Constants.RowClasses.Road,
            tileId: Constants.TileIds.Road,
            entityMinimumSpacing: 5,
            moveDirection: 'left',
            entityMoveSpeed: 6,
            entityMoveDistance: 1
        },
        <RowConfiguration>{
            entities: [
                <RowEntityConfiguration>{
                    entityId: Constants.EntityIds.Car2,
                    chance: 1.00
                }
            ],
            rowClass: Constants.RowClasses.Road,
            tileId: Constants.TileIds.Road,
            entityMinimumSpacing: 5,
            moveDirection: 'left',
            entityMoveSpeed: 6,
            entityMoveDistance: 1
        },
        <RowConfiguration>{
            entities: [
                <RowEntityConfiguration>{
                    entityId: Constants.EntityIds.Car3,
                    chance: 1.00
                }
            ],
            rowClass: Constants.RowClasses.Road,
            tileId: Constants.TileIds.Road,
            entityMinimumSpacing: 5,
            moveDirection: 'left',
            entityMoveSpeed: 6,
            entityMoveDistance: 1
        },
        <RowConfiguration>{
            entities: [
                <RowEntityConfiguration>{
                    entityId: Constants.EntityIds.Car4,
                    chance: 1.00
                }
            ],
            rowClass: Constants.RowClasses.Road,
            tileId: Constants.TileIds.Road,          
            entityMinimumSpacing: 5,
            moveDirection: 'left',
            entityMoveSpeed: 6,
            entityMoveDistance: 1
        },
        <RowConfiguration>{
            entities: [
                <RowEntityConfiguration>{
                    entityId: Constants.EntityIds.Car5,
                    chance: 1.00
                }
            ],
            rowClass: Constants.RowClasses.Road,
            tileId: Constants.TileIds.Road,
            entityMinimumSpacing: 5,
            moveDirection: 'left',
            entityMoveSpeed: 6,
            entityMoveDistance: 1
        },
        <RowConfiguration>{
            rowClass: Constants.RowClasses.Path,
            tileId: Constants.TileIds.Path
        },
        <RowConfiguration>{
            rowClass: Constants.RowClasses.Water,
            tileId: Constants.TileIds.Water,
            entityMinimumSpacing: 5,
            moveDirection: 'left',
            entityMoveSpeed: 6,
            entityMoveDistance: 1
        },
        <RowConfiguration>{
            rowClass: Constants.RowClasses.Water,
            tileId: Constants.TileIds.Water,
            entityMinimumSpacing: 5,
            moveDirection: 'left',
            entityMoveSpeed: 6,
            entityMoveDistance: 1
        },
        <RowConfiguration>{
            rowClass: Constants.RowClasses.Water,
            tileId: Constants.TileIds.Water,
            entityMinimumSpacing: 5,
            moveDirection: 'left',
            entityMoveSpeed: 6,
            entityMoveDistance: 1
        },
        <RowConfiguration>{
            rowClass: Constants.RowClasses.Water,
            tileId: Constants.TileIds.Water,
            entityMinimumSpacing: 5,
            moveDirection: 'left',
            entityMoveSpeed: 6,
            entityMoveDistance: 1
        },
        <RowConfiguration>{
            rowClass: Constants.RowClasses.Water,
            tileId: Constants.TileIds.Water,
            entityMinimumSpacing: 5,
            moveDirection: 'left',
            entityMoveSpeed: 6,
            entityMoveDistance: 1
        },
        <RowConfiguration>{
            rowClass: Constants.RowClasses.Goal,
            entityMinimumSpacing: 5,
            moveDirection: 'left',
            entityMoveSpeed: 6,
            entityMoveDistance: 1,
            tileId: Constants.TileIds.Goal
        }
    ];
}

@Injectable()
export class RowConfiguration {
    entities?: RowEntityConfiguration[];
    entityMinimumSpacing?: number; // unit: 1 entity width, must be calculated
    entityMoveDirection?: MoveDirection;
    entityMoveSpeed?: number;
    entityMoveDistance?: number;
    rowClass?: string;
    backgroundImageClass?: string;
    tileId?: number;
}

@Injectable()
export class RowEntityConfiguration {
    entityId: number;
    maxOnScreen: number;
    chance: number;
    surfaceEntities: RowEntityConfiguration[]; // snakes on top of logs
}
