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
// Slider: Demo Simple
//
///////////////////////////////////////////////////////////////////////////////

import {LipsumCmp}          from '../lipsum/lipsum';
import {SvgSliderCmp}       from '../slider/slider';


interface NumericalSlider {
  min:     number;
  max:     number;
  value:   number;
  rail?:    number;
  control?: ControlGroup;
}


@Component ({
  selector: 'gg-slider-demo-simple',
  templateUrl: 'app/sliderdemo/sliderdemo_simple.html',
  directives: [LipsumCmp, SvgSliderCmp, FORM_DIRECTIVES]
})
export class SliderDemoSimpleCmp {
  public id_ = '000';
  public std_slider_: NumericalSlider = { min: 0, max: 100, value: 50 };
  public svg_slider_: NumericalSlider = { min: 0, max: 100, value: 50, rail: 180 };
  private npos_ = 50;

  //private form_ctrl_: ControlGroup;
  private svg_ctrl_: ControlGroup;
  private std_ctrl_: ControlGroup;


  constructor(private fb_: FormBuilder) {
    this.std_ctrl_ = fb_.group({
      min:   [ '', (c: Control) => {
        // console.log("DEBUG: min control ", c);
      }],
      max:   [ '', (c: Control) => {
        // console.log("DEBUG: max control ", c);
      }],
      value: [ '', (c: Control) => {
        // console.log("DEBUG: value control ", c);
      }]
    });

    //console.log("DEBUG: constructor control ", this.form_ctrl_);

    this.svg_ctrl_ = fb_.group({
      rail:   [ '', (c: Control) => {
        // console.log("DEBUG: rail control ", c);
      }],
      min:   [ '', (c: Control) => {
        // console.log("DEBUG: min control ", c);
      }],
      max:   [ '', (c: Control) => {
        // console.log("DEBUG: max control ", c);
      }],
      value: [ '', (c: Control) => {
        // console.log("DEBUG: value control: ", c);
      }]
    });

    //const test_ctrl = fb_.control('', () => {
    //  console.log("DEBUG: special value control: ");
    //});

  }
}