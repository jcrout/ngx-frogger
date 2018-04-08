import { EventEmitter, Injectable, Output, OnDestroy } from '@angular/core';
import { InputEventType, KeyModifier, MouseEventType } from '../models/custom-types.model';

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
export class InputProvider implements OnDestroy {
    @Output() input = new EventEmitter<InputEvent>();

    constructor() {
        const that = this;
        window.addEventListener('keydown', this.keydownEvent.bind(this));
    }

    keydownEvent(ev: KeyboardEvent) {  
        // if (ev.code !== 'ArrowRight' && ev.code !== 'ArrowLeft') { 
        //     return;
        // }
        if (!ev.code) { return };

        let inputEvent = new InputEvent();
        inputEvent.type = 'key';
        inputEvent.key = ev.code;
        inputEvent.keyModifiers = [];

        if (ev.altKey) { 
            inputEvent.keyModifiers.push('alt');
        }
        if (ev.shiftKey) { 
            inputEvent.keyModifiers.push('shift');
        }
        if (ev.ctrlKey) { 
            inputEvent.keyModifiers.push('control');
        }

        //console.log(inputEvent);
        this.input.emit(inputEvent);
    }

    ngOnDestroy() { 

    }
}
