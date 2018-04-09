import { Injectable, OnInit } from '@angular/core';
import { GameClockService } from './game-clock.service';
import { InputProvider, InputEvent } from './input-provider.service';
import { DynamicStyleService } from './dynamic-styles.service';
import { GameConfiguration, RowEntityConfiguration, RowConfiguration } from '../models/game-configuration.model';
import { RandomService } from './random.service';
import { MoveDirection } from '../models/custom-types.model';
import { IEntity, IPlayer } from '../models/entity.model';
import { EntityFactory } from '../factories/entity.factory';
import { Tile } from '../models/tile.model';

export interface GamePlayer {
  player: IPlayer;
  entity: IEntity;
  x: number;
  y: number;
  bufferX: number;
  bufferY: number;
  moveDireciton: string;
  moveSpeed: number;
  moveDelay: number;
  moveSpeedTotal: number;
  moving: boolean;
  moveStart?: number;
  numberClass: string;
}

export interface GameEntity {
  entity: IEntity;
  config: RowEntityConfiguration;
  x: number;
  y: number;
  bufferX: number;
  bufferY: number;
  moveDireciton: MoveDirection;
  moveSpeed: number;
  moveInterval: number;
  moveDelay: number;
  moveDistance: number;
}

export interface GameRow {
  config: RowConfiguration;
  entities?: GameEntity[];
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
  players: GamePlayer[];
  private config: GameConfiguration;
  private boardWidth: number;
  private boardHeight: number;
  private boardEffectiveWidth: number;
  private boardEffectiveHeight: number;

  constructor(
    private styleSvc: DynamicStyleService,
    private entityFactory: EntityFactory,
    private inputProvider: InputProvider,
    private clockSvc: GameClockService,
    private randomSvc: RandomService) { }

  private getTileHeight(config: GameConfiguration, row: RowConfiguration) {
    if (row.tileId) {
      return config.tiles.find(t => t.id === row.tileId).height
    } else {
      return config.tileSize;
    }
  }

  initialize(id: string, config: GameConfiguration) {
    const that = this;
    this.config = config;

    let tileLookup = {};
    for (let i = 0; i < config.tiles.length; i++) {
      tileLookup[config.tiles[i].id] = config.tiles[i];
    }

    this.boardWidth = config.tileSize * config.rowTiles;
    this.boardHeight = config.gridRows.map(gr => this.getTileHeight(config, gr)).reduce((n1, n2) => n1 + n2);
    this.boardEffectiveWidth = this.boardWidth - config.tileSize;
    this.boardEffectiveHeight = this.boardHeight - config.tileSize;
    let boardWidth = this.boardWidth;
    let boardHeight = this.boardHeight;
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
    this.styleSvc.upsertStyles('.game-board .board-row .frogger-entity', [
      { property: 'transition', value: 'left ' + config.gameSpeed + 'ms linear' }
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
    this.players = config.players.map(p => {
      let entity = config.entities.find(e => e.id === p.entityId);
      let player = <GamePlayer>{
        player: p,
        entity: entity,
        bufferX: (config.tileSize - (entity.shape.width % config.tileSize)) / 2,
        bufferY: (config.tileSize - (entity.shape.height % config.tileSize)) / 2,
        numberClass: 'frogger-player-' + p.playerNumber,
        moveDireciton: 'up'
      };
      player.x = p.startColumn * config.tileSize + player.bufferX,
        player.y = (config.gridRows.length - p.startRow) * config.tileSize - player.bufferY;
      player.moveDelay = p.moveDelay * config.gameSpeed;
      player.moveSpeed = p.moveSpeed * config.gameSpeed;
      player.moveSpeedTotal = player.moveSpeed + player.moveDelay;
      this.styleSvc.upsertStyles('.game-board .' + player.numberClass, [
        { property: 'transition', value: 'left ' + player.moveSpeed.toFixed() + 'ms linear, top ' + player.moveSpeed.toFixed() + 'ms linear' }
      ]);
      return player;
    });

    this.rows = config.gridRows.map((gr, i) => {
      let tile = gr.tileId ? config.tiles.find(t => t.id === gr.tileId) : <Tile>{ id: -1, width: config.tileSize, height: config.tileSize };
      let tileCount = Math.floor(boardWidth / tile.width);
      let tiles = [];
      for (let i = 0; i < tileCount; i++) {
        tiles.push(i);
      }

      let boardRowNumberClass = 'board-row-' + i.toString();
      let newRow = <GameRow>{
        config: gr,
        rowClass: boardRowNumberClass + ' ' + gr.rowClass,
        tiles: tiles,
        tileHeight: tile.height + 10,
        tileWidth: tile.width,
        backgroundTileClass: tile.cssClass,
        entities: []
      };

      // if (gr.entities && gr.entities.length > 0) {
      //   let entityMoveSpeed = gr.entityMoveSpeed * config.gameSpeed
      //   that.styleSvc.upsertStyles('.game-board .' + boardRowNumberClass + ' .frogger-entity', [
      //     { property: 'transition', value: 'left ' + entityMoveSpeed + 'ms linear, right ' + entityMoveSpeed + 'ms linear' }
      //   ]);
      // }

      return newRow;
    });

    this.rows.reverse();
    this.inputProvider.input.subscribe(this.inputReceived.bind(this));
    this.clockSvc.interval = config.gameSpeed;
    this.clockSvc.tick.subscribe(this.gameLoop.bind(this));
    this.clockSvc.start();
    this.initialized = true;
  }

  gameLoop() {
    const that = this;
    this.rows.forEach((r, i) => {
      that.spawnEntities(i, r);
      r.entities.forEach(e => {
        e.moveInterval++;
        if (e.moveInterval >= e.moveSpeed) { // movement finished
          e.moveInterval = 0;
        }


        if (e.moveInterval == 0) {
          
        }
        e.x += e.moveDireciton === 'left' ? e.moveDistance * -1 : e.moveDistance;
      });
    });


  }

  spawnEntities(index: number, row: GameRow) {
    const config = row.config;
    if (!config.entities || config.entities.length === 0) { return; }

    let entityCount = row.entities.length;
    let hasMultipleTypes = config.entities.length > 1;
    if (entityCount === 0) { // initial spawn
      let entityToSpawn = this.chooseEntity(config);
      let entity = this.config.entities.find(e => e.id === entityToSpawn.entityId);
      let minX = config.entityMoveDirection === 'left' ? 0 : entity.shape.width;
      let maxX = config.entityMoveDirection === 'left' ? this.boardWidth + entity.shape.width : this.boardWidth;
      let randX = this.randomSvc.getInteger(maxX, minX);
      let newEntity = <GameEntity>{
        entity: entity,
        bufferX: (this.config.tileSize - (entity.shape.width % this.config.tileSize)) / 2,
        bufferY: (this.config.tileSize - (entity.shape.height % this.config.tileSize)) / 2,
        moveSpeed: config.entityMoveSpeed,
        moveDireciton: config.entityMoveDirection || 'left',
        moveDelay: entityToSpawn.moveDelay || 0,
        moveInterval: -1,
        moveDistance: this.config.tileSize / config.entityMoveSpeed
      };
      newEntity.x = randX - (randX % this.config.tileSize);
      newEntity.y = newEntity.bufferY;
      row.entities.push(newEntity);
    } else {

    }
  }

  chooseEntity(config: RowConfiguration): RowEntityConfiguration {
    const rand = this.randomSvc.getFraction();
    let target = 0;
    for (let i = 0; i < config.entities.length; i++) {
      let configEntity = config.entities[i];
      target += configEntity.chance;
      if (rand >= target && rand <= target + configEntity.chance) {
        return configEntity;
      }
    }

    return config.entities[0];
  }

  inputReceived(ev: InputEvent) {
    if (!ev.key) { return };
    let player = this.players.find(p =>
      p.player.upKey === ev.key ||
      p.player.rightKey === ev.key ||
      p.player.downKey === ev.key ||
      p.player.leftKey === ev.key);
    if (!player) { return; }

    this.movePlayer(player, ev.key);
  }

  movePlayer(gamePlayer: GamePlayer, key: string) {
    let currentDate = Date.now();
    if (gamePlayer.moveStart && (currentDate - gamePlayer.moveStart < gamePlayer.moveSpeedTotal)) {
      return;
    }

    let xChange =
      key === gamePlayer.player.leftKey ? gamePlayer.player.moveDistance * this.config.tileSize * -1 :
        key === gamePlayer.player.rightKey ? gamePlayer.player.moveDistance * this.config.tileSize : 0;
    let yChange =
      key === gamePlayer.player.upKey ? gamePlayer.player.moveDistance * this.config.tileSize * -1 :
        key === gamePlayer.player.downKey ? gamePlayer.player.moveDistance * this.config.tileSize : 0;
    let newX = Math.max(gamePlayer.bufferX, Math.min(this.boardEffectiveWidth + gamePlayer.bufferX, gamePlayer.x + xChange));
    let newY = Math.max(gamePlayer.bufferY, Math.min(this.boardEffectiveHeight + gamePlayer.bufferY, gamePlayer.y + yChange));

    if (gamePlayer.x !== newX || gamePlayer.y !== newY) {
      gamePlayer.x = newX;
      gamePlayer.y = newY;
      gamePlayer.moving = true;
      gamePlayer.moveStart = currentDate;
      gamePlayer.moveDireciton = xChange > 0 ? 'right' : xChange < 0 ? 'left' : yChange > 0 ? 'down' : 'up';
      setTimeout(() => {
        gamePlayer.moving = false;
      }, gamePlayer.moveSpeed);
    }
  }
}
