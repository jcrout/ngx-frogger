import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { GameConfiguration } from '../../models/game-configuration.model';
import { GameService } from '../../services/game.service';
import { RandomService } from '../../services/random.service';

@Component({
  selector: 'app-frogger',
  templateUrl: './frogger.component.html',
  styleUrls: ['./frogger.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FroggerComponent implements OnInit {
  @Input() config: GameConfiguration;
  id: string;

  constructor(defaultConfig: GameConfiguration, public gameSvc: GameService, private randomSvc: RandomService) { 
    this.config = defaultConfig;
  }

  ngOnInit() {
    this.id =  'frogger-' + this.randomSvc.getInteger().toString();
    this.gameSvc.initialize(this.id, this.config);
  }
}
