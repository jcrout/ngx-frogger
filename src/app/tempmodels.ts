import { Inject, Injectable, EventEmitter, Output } from "@angular/core";

@Injectable()
export class GameConfiguration { 
    startLives = 3;
    gridArea1Rows: 5
}

@Injectable()
export class RowConfiguration { 
    entities: RowEntityConfiguration[];
    entityMinimumSpacing: number; // unit: 1 entity width, must be calculated
    backgroundTileClass: string;
    backgroundImageClass: string;
}

@Injectable()
export class RowEntityConfiguration { 
    entityId: number;
    maxOnScreen: number;
    chance: number;
    surfaceEntities: RowEntityConfiguration[]; // snakes on top of logs
}

@Injectable()
export class GameDataService { 
    score = 0;
    lives = 0;
}


export interface IEntity { 
    id: number;
    moveDistance: number;
    moveSpeed: number;
    cssClass: string;

}

declare type InputEventType =  'mouse' | 'key' | 'touch';
declare type MouseEventType =  'left' | 'right' | 'middle' | 'x1' | 'x2' | 'scroll';
declare type KeyModifier =  'control' | 'alt' | 'shift';
declare type InputSource =  'string';

export class InputEvent { 
    type: InputEventType;
    source: string;
    mouseButton?: MouseEventType;
    scrollDelta?: number;
    key?: string;
    keyModifiers?: KeyModifier[];
    cancel = false;
}

@Injectable()
export class InputProvider { 
    @Output() input = new EventEmitter<InputEvent>();
}


