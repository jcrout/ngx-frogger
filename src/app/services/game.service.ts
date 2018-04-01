import { Injectable, OnInit } from '@angular/core';
import { GameClockService } from './game-clock.service';
import { InputProvider } from './input-provider.service';
import { DynamicStyleService } from './dynamic-styles.service';
import { GameConfiguration, RowEntityConfiguration, RowConfiguration } from '../models/game-configuration.model';
import { RandomService } from './random.service';
import { MoveDirection } from '../models/custom-types.model';
import { IEntity } from '../models/entity.model';
import { EntityFactory } from '../factories/entity.factory';
import { Tile } from '../models/tile.model';

export interface GameRow {
  entities?: IEntity[];
  entityMinimumSpacing?: number; // unit: 1 entity width, must be calculated
  entityMoveDirection?: MoveDirection;
  entityMoveSpeed?: number;
  entityMoveDistance?: number;
  rowClass?: string;
  backgroundTileClass?: string;
  backgroundImageClass?: string;
  tiles: any[];
  tileWidth: number;
  tileHeight: number;
}

@Injectable()
export class GameService {
  initialized = false;
  rows: GameRow[];

  constructor(
    private styleSvc: DynamicStyleService,
    private entityFactory: EntityFactory) { }

  private getTileHeight(config: GameConfiguration, row: RowConfiguration) {
    if (row.tileId) {
      return config.tiles.find(t => t.id === row.tileId).height
    } else {
      return config.tileSize;
    }
  }

  initialize(id: string, config: GameConfiguration) {
    console.log(config);

    let tileLookup = {};
    for (let i = 0; i < config.tiles.length; i++) {
      tileLookup[config.tiles[i].id] = config.tiles[i];
    }

    let boardWidth = config.tileSize * config.rowTiles;
    let boardHeight = config.gridRows.map(gr => this.getTileHeight(config, gr)).reduce((n1, n2) => n1 + n2);
    let cssPrefix = '#' + id + ' ';

    this.styleSvc.init();
    this.styleSvc.prefix = cssPrefix;
    this.styleSvc.upsertStyles('.game-board', [
      { property: 'width', value: boardWidth + 'px' },
      { property: 'height', value: boardHeight + 'px' },
      { property: 'background', value: config.backgroundColor || 'black' }
    ]);
    this.styleSvc.upsertStyles('.game-board .board-row', [
      { property: 'width', value: boardWidth + 'px' }
    ]);
    this.styleSvc.upsertStyles('.game-board .board-row .board-tile', [
      { property: 'width', value: config.tileSize + 'px' },
      { property: 'height', value: config.tileSize + 'px' }
    ]);
    for (let i = 0; i < config.tiles.length; i++) {
      let tile = config.tiles[i];
      if (tile.cssClass) {
        let tileCount = Math.floor(boardWidth / tile.width);
        let newTileWidth = tileCount * tile.width === boardWidth ? tile.width : boardWidth / tileCount;
        this.styleSvc.upsertStyles('.game-board .board-row .board-tile.' + tile.cssClass, [
          { property: 'width', value: newTileWidth + 'px' },
          { property: 'height', value: tile.height + 'px' }
        ]);
      }

    }

    // setTimeout(() => {
    //   this.styleSvc.upsertStyles('.game-board', [
    //     { property: 'border', value: '5px solid green' }
    //   ]);
    // }, 2000);

    this.entityFactory.initialize(config.entities);

    this.rows = config.gridRows.map(gr => {
      let tile = gr.tileId ? config.tiles.find(t => t.id === gr.tileId) : <Tile>{ id: -1, width: config.tileSize, height: config.tileSize };
      let tileCount = Math.floor(boardWidth / tile.width);
      let tiles = []; // needed for ngFor
      for (let i = 0; i < tileCount; i++) {
        tiles.push(i);
      }

      let newRow = <GameRow>{
        rowClass: gr.rowClass,
        tiles: tiles,
        tileHeight: tile.height + 10,
        tileWidth: tile.width,
        backgroundTileClass: tile.cssClass
      };

      return newRow;
    });

    this.rows.reverse();
    this.initialized = true;
  }
}
