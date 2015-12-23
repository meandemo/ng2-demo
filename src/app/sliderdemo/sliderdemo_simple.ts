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


class NumericalSlider {
  min_:         number = 0;
  max_:         number = 100;
  value_:       number = 50;
  runner_shape_: string = 'circle';
  length_:      number = 180;
  prev_min_:    number = 0;
  prev_max_:    number = 100;
  prev_value_:  number = 50;


  ctrl_: ControlGroup = null;

  fb_: FormBuilder;

  constructor(fb: FormBuilder, min: number, max: number, value: number) {
    this.min_    = min;
    this.max_    = max;
    this.value_  = value;
    this.runner_shape_ = 'circle';

    this.prev_min_   = this.min_;
    this.prev_max_   = this.max_;
    this.prev_value_ = this.value_;
    this.fb_ = fb;
  }

  add_control(): ControlGroup {
    this.ctrl_ = this.fb_.group({
      min:   [ '',  (c: Control) => { this.check_min_value(c); } ],
      max:   [ '',  (c: Control) => { this.check_max_value(c); } ],
      value: [ '',  (c: Control) => { this.check_current_value(c); } ]
    });

    return this.ctrl_;
  }

  // min value can't be greater than current value

  check_min_value(c: Control) {
    let v = Number(c.value);
    if (c.value === "" || Number.isNaN(v) || v > this.value_) {
      this.min_ = this.prev_min_;
    } else {
      this.prev_min_ = this.min_;
      this.min_ = v;
    }
  }

  // max value can't be lower than current value

  check_max_value(c: Control) {
    let v = Number(c.value);
    if (c.value === "" || Number.isNaN(v) || v < this.value_) {
      this.max_ = this.prev_max_;
    } else {
      this.prev_max_ = this.max_;
      this.max_ = v;
    }
  }

  //
  // current value must be between min and max
  //

  check_current_value(c: Control) {
    let v = Number(c.value);
    //console.log('DEBUG: current value is ', v);
    if (c.value === "" || Number.isNaN(v) || (v < this.min_) || (v > this.max_)) {
      this.value_ = this.prev_value_;
    } else {
      this.prev_value_ = this.value_;
      this.value_ = v;
    }
  }
}


@Component ({
  selector: 'gg-slider-demo-simple',
  templateUrl: 'app/sliderdemo/sliderdemo_simple.html',
  directives: [LipsumCmp, SvgSliderCmp, FORM_DIRECTIVES]
})
export class SliderDemoSimpleCmp implements AfterViewInit {
  public id_ = '000';
  public std_slider_: NumericalSlider;
  public svg_slider_: NumericalSlider;

  private std_ctrl_: ControlGroup;


  ngAfterViewInit() {
     // rfu 
  }

  constructor(private fb_: FormBuilder) {
    this.std_slider_ = new NumericalSlider(fb_, 0, 100, 25);
    this.svg_slider_ = new NumericalSlider(fb_, 0, 100, 35);
    this.std_ctrl_ = this.std_slider_.add_control();
  }
}