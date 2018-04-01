import { Injectable } from '@angular/core';
import { StyleProperty } from '../models/custom-types.model';

declare type StyleInformation = {
  [selector: string]: {
    [property: string]: string;
  }
}

@Injectable()
export class DynamicStyleService {
  public prefix: string;
  private styleElement: HTMLStyleElement;
  private styleSheet: any;
  private styleInfo = <StyleInformation>{};

  constructor() { }

  init() {
    this.styleElement = document.createElement('style') as HTMLStyleElement;
    document.head.appendChild(this.styleElement);
    this.styleSheet = document.styleSheets[document.styleSheets.length - 1];
  }

  destroy() {

  }

  private getRule(selector, styleInfo: any): string { 
    let newRule = selector + '{';  
    for (let prop in styleInfo) {
      newRule += prop + ':' + (styleInfo[prop] || '') + ';';
    }
    newRule += '}';

    return newRule;
  }

  upsertStyles(selector: string, styles: StyleProperty[]) { 
    const styleSheet = this.styleSheet;
    selector = (this.prefix || '') + selector;
    let styleInfoMatch = this.styleInfo[selector];
    if (styleInfoMatch) {
      for (let i = 0; i < styles.length; i++) { 
        styleInfoMatch[styles[i].property] = styles[i].value;
      }

      let ruleIndex = -1;
      for (let i = 0; i < styleSheet.rules.length; i++) {
        if (styleSheet.rules[i].selectorText === selector) {
          ruleIndex = i;
          break;
        }
      }
      if (ruleIndex !== -1) {
        styleSheet.removeRule(ruleIndex);
      }
      styleSheet.insertRule(this.getRule(selector, styleInfoMatch), styleSheet.rules.length);
    } else {
      styleInfoMatch = {};
      for (let i = 0; i < styles.length; i++) { 
        styleInfoMatch[styles[i].property] = styles[i].value;
      }
     
      styleSheet.insertRule(this.getRule(selector, styleInfoMatch), styleSheet.rules.length);

      this.styleInfo[selector] = styleInfoMatch;
    }
  }

  upsert(selector, property, value) {
    let style = <StyleProperty>{ property: property, value: value };
    this.upsertStyles(selector, [style])
  }

  private remove(selector) {

  }
}
