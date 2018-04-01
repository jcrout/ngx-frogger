import { Injectable } from '@angular/core';

@Injectable()
export class RandomService {

  constructor() { }  

  getInteger(max?: number, min?: number) { 
    max = max || 9007199254740991;
    if (min) { 
      return Math.floor(Math.random() * (max - min) + min);
    } else { 
      return Math.floor(Math.random() * max);
    }    
  }
}
