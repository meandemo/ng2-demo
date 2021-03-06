import {Component, Directive, ViewChild,
        AfterViewInit, Query, QueryList, ElementRef,
        OnChanges, Input, SimpleChange, Output, EventEmitter, OnInit,
        View} from 'angular2/core';
import {NgFor, DecimalPipe, NgIf, NgModel, FormBuilder, NgClass,
        NgControl, NgForm, Control, ControlGroup, FORM_DIRECTIVES } from  'angular2/common';
import {RouteConfig, RouteDefinition, Router, Route, RouteParams,
        ROUTER_PROVIDERS,
        RouterOutlet, RouterLink, APP_BASE_HREF, ROUTER_BINDINGS} from 'angular2/router';

///////////////////////////////////////////////////////////////////////////////
//
// A Service Class associated with the slider to add/modify value 
// 
///////////////////////////////////////////////////////////////////////////////

import {Runner}                    from './runner';

export interface SliderEvtData {
  add?:     boolean;      // if true: a new slider must be added, all other data is ignored
  del?:     boolean;      // if true: slider[idx] must be removed
  hideRail?: boolean;     // if true: slider must be hidden 
  hideRunners?: boolean;  // if true: runners must be hidden 
  runner?: Runner;        // Runner to operate on
  val?:    number;        // otherwise slider[idx] value must be updated with val 
}


export class SliderService extends EventEmitter<SliderEvtData> {
  private idx_: number;
  private instance_count_: number;

  constructor() {
    // The 'false' argument passed to the super function 
    // allows a synchronous event emitter.
    super(false);
    this.idx_ = 1;
    this.instance_count_ = 0;
  }
}
