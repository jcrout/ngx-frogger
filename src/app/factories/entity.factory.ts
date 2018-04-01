import { Injectable } from '@angular/core';
import { IEntity } from '../models/entity.model';

declare type EntityLookup = {
  [id: number]: IEntity;
}


@Injectable()
export class EntityFactory {
  entities: EntityLookup;

  constructor() { }

  initialize(entities: any) { 
    
  }
}
