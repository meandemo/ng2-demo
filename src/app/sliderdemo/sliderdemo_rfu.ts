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
// Slider Demo Simple
//
///////////////////////////////////////////////////////////////////////////////

import {LipsumCmp}                 from '../lipsum/lipsum';


// Slider: 001

@Component ({
  selector: 'gg-slider-001',
  template: `
    <p>This is slider {{id_}}
    </p>
    <form>
      <input type="range" name="points0" min="0" max="100" style="width: 50px;">
    </form>
    <form>
      <input type="range" name="points1" min="0" max="100" style="width: 50px;">
    </form>
  `,
  directives: [LipsumCmp]
})
export class Slider001Cmp {
  public id_ = '002';
}


// Slider: 002

@Component ({
  selector: 'gg-slider-002',
  template: `
    <p>This is slider {{id_}}
    </p>
    <form>
      <input type="range" name="points0" min="0" max="100" style="width: 50px;">
    </form>
    <form>
      <input type="range" name="points1" min="0" max="100" style="width: 50px;">
    </form>
    <form>
      <input type="range" name="points2" min="0" max="100" style="width: 50px;">
    </form>
    <gg-lipsum></gg-lipsum>
  `,
  directives: [LipsumCmp]
})
export class Slider002Cmp {
  public id_ = '002';

}


// Slider: 003


@Component ({
  selector: 'gg-slider-003',
  template: `
    <p>This is slider {{id_}}
    </p>
    <form>
      <input type="range" name="points0" min="0" max="100" style="width: 75px;">
    </form>
    <form>
      <input type="range" name="points1" min="0" max="100" style="width: 75px;">
    </form>
    <form>
      <input type="range" name="points2" min="0" max="100" style="width: 75px;">
    </form>
    <form>
      <input type="range" name="points3" min="0" max="100" style="width: 75px;">
    </form>
    <gg-lipsum></gg-lipsum>
  `,
  directives: [LipsumCmp]
})
export class Slider003Cmp {
  public id_ = '003';
}
