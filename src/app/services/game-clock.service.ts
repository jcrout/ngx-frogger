// https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript

import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class GameClockService {
    @Output() tick = new EventEmitter<any>();
    interval = 50;
    private startTime: number;

    constructor() {}

    start() {
        const that = this;
        this.startTime = Date.now();
        let expected = this.startTime + this.interval;
        setTimeout(step, this.interval);
        function step() {
            that.tick.emit();

            const currentTime = Date.now();
            const dt = currentTime - expected; // the drift (positive for overshooting)
            if (dt > this.interval) {
                // something really bad happened. Maybe the browser (tab) was inactive?
                // possibly special handling to avoid futile "catch up" run
            }

            expected += this.interval;
            setTimeout(step, Math.max(0, this.interval - dt)); // take into account drift
        }
    }
}