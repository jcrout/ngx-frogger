import { Inject, Injectable, EventEmitter, Output } from "@angular/core";
import { tick } from "@angular/core/testing";
import { MoveDirection, InputEventType, MouseEventType, KeyModifier } from './custom-types.model';
import { Constants } from '../constants';


@Injectable()
export class GameDataService {
    score = 0;
    lives = 0;
    goalsReached = <number[]>[]; // 0-4 default ones
}

export interface IEntityShape {
    cssClass: string;
    width: number;
    height: number;
}

export interface IEntity {
    id: number;
    moveDistance: number;
    moveSpeed: number;
    moveDirection: MoveDirection;
    shape: IEntityShape;
    playerTouchStart: Function;
    playerTouchEnd: Function;
    playerTouching: Function;
    endZoneReached: Function;
    gameTick: Function;
}

export interface IPlayer {
    entityId: number;
    playerNumber: number;
    leftKey: string;
    rightKey: string;
    upKey: string;
    downKey: string;
    lives: number;
    startRow: number;
    startColumn: number;       
    moveDistance: number;
    moveDelay: number;
    moveSpeed: number;
}

export class Entities { 
    static Frogger = <IEntity>{
        id: Constants.EntityIds.Frogger,
        shape: {
            cssClass: 'entity-frogger',
            width: 30,
            height: 28
        }
    };
    static Car1 = <IEntity>{ 
        id: Constants.EntityIds.Car1,
        shape: {
            cssClass: 'entity-car1',
            width: 42,
            height: 36
        },
        moveSpeed: 6
    };
    static Car2 = <IEntity>{ 
        id: Constants.EntityIds.Car2,
        shape: {
            cssClass: 'entity-car2',
            width: 42,
            height: 36
        }
    };
    static Car3 = <IEntity>{ 
        id: Constants.EntityIds.Car3,
        shape: {
            cssClass: 'entity-car3',
            width: 42,
            height: 36
        }
    };
    static Car4 = <IEntity>{ 
        id: Constants.EntityIds.Car4,
        shape: {
            cssClass: 'entity-car4',
            width: 42,
            height: 36
        }
    };
    static Car5 = <IEntity>{ 
        id: Constants.EntityIds.Car5,
        shape: {
            cssClass: 'entity-car5',
            width: 42,
            height: 30
        }
    };
}