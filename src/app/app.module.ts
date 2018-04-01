import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { FroggerComponent } from './components/frogger/frogger.component';
import { GameConfiguration } from './models/game-configuration.model';
import { GameClockService } from './services/game-clock.service';
import { GameService } from './services/game.service';
import { InputProvider } from './services/input-provider.service';
import { CommonModule } from '@angular/common';
import { DynamicStyleService } from './services/dynamic-styles.service';
import { RandomService } from './services/random.service';
import { EntityFactory } from './factories/entity.factory';


@NgModule({
  declarations: [
    AppComponent,
    FroggerComponent
  ],
  imports: [
    BrowserModule,
    CommonModule
  ],
  providers: [
    GameConfiguration,
    GameClockService,
    InputProvider,
    GameService,
    DynamicStyleService,
    RandomService,
    EntityFactory
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
