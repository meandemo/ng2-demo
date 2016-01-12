import {Component, Directive, ViewChild,
        AfterViewInit, Query, QueryList, ElementRef,
        OnChanges, Input, SimpleChange, Output, EventEmitter, OnInit, Inject, forwardRef,
        View} from 'angular2/core';
import {NgFor, DecimalPipe, NgIf, NgModel, FormBuilder, NgClass,
        NgControl, NgForm, Control, ControlGroup, FORM_DIRECTIVES } from  'angular2/common';
import {RouteConfig, RouteDefinition, Router, Route, RouteParams, Location, LocationStrategy,
        ROUTER_PROVIDERS, OnActivate, OnDeactivate, ComponentInstruction,
        RouterOutlet, RouterLink, APP_BASE_HREF, ROUTER_BINDINGS} from 'angular2/router';

///////////////////////////////////////////////////////////////////////////////
//
// Slider Demo Simple
//
///////////////////////////////////////////////////////////////////////////////

import {LipsumCmp}                 from '../lipsum/lipsum';
import {SvgSliderRgbCmp}           from '../slider/slider_rgb';
import {SliderDemoService}         from '../sliderdemo/sliderdemo_service';


// Slider Demo RGB

@Component ({
  selector: 'gg-slider-demo-rgb',
  templateUrl: 'app/sliderdemo/sliderdemo_rgb.html',
  //events: ['colorChange'],
  directives: [LipsumCmp, SvgSliderRgbCmp]
})
export class SliderDemoRgbCmp implements AfterViewInit, OnActivate, OnDeactivate {
  private values_: any = { 'red': 55, 'green': 105, 'blue': 155 };
  private length_: number = 600;

  // Note: I could not find a way to capture the 3 fields
  // with /^#([\da-f]{2}){3}$/i  => so I unrolled the 3 captures
  //
  private re_long_hex_: RegExp = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i;
  private re_short_hex_: RegExp = /^#([\da-f])([\da-f])([\da-f])$/i;
  private hex_str_: string;
  private cell_hex_str_: string;
  private form_ctrl_: ControlGroup = null;

  get values_red() {
    //console.log("TRACE: get red value", this.values_.red);
    return this.values_.red;
  }

  set values_red(r: number) {
    //console.log("TRACE: set red value", this.values_.red);
    this.values_.red = r;
    this.hex_str_ = this.to_rgb_str(this.values_.red, this.values_.green, this.values_.blue);
    this.cell_hex_str_ = this.hex_str_;
  }

  get values_green() {
    //console.log("TRACE: get green value", this.values_.green);
    return this.values_.green;
  }

  set values_green(r: number) {
    //console.log("TRACE: set green value", this.values_.green);
    this.values_.green = r;
    this.hex_str_ = this.to_rgb_str(this.values_.red, this.values_.green, this.values_.blue);
    this.cell_hex_str_ = this.hex_str_;
  }
  get values_blue() {
    //console.log("TRACE: get blue value", this.values_.blue);
    return this.values_.blue;
  }

  set values_blue(r: number) {
    //console.log("TRACE: set blue value", this.values_.blue);
    this.values_.blue = r;
    this.hex_str_ = this.to_rgb_str(this.values_.red, this.values_.green, this.values_.blue);
    this.cell_hex_str_ = this.hex_str_;
  }


  rgb2str(v: number): string {
    v = Math.round(v);
    if (v < 0) {
      return '00';
    } else if (v > 255) {
      return 'ff';
    } else if (v < 16) {
      return '0' + v.toString(16);
    } else {
      return v.toString(16);
    }
  }

  to_rgb_str(r: number, g: number, b: number): string {
    return '#' + this.rgb2str(r) + this.rgb2str(g) + this.rgb2str(b);
  }


  routerOnActivate(next: ComponentInstruction, prev: ComponentInstruction) {
    //console.log('Activate:   navigating from ', prev);
    //console.log('            navigating to ', next);
    //console.log('            router state', this.location_);
    //console.log('            router url() ', this.location_.normalize());
    if (prev === null) {
      //console.log('[DEBUG] Navigating to ', next);
      //console.log('[DEBUG] Location is ', this.location_);
      //console.log('[DEBUG] Hum! navigation to ', window.location.pathname, ' without navigate() or routerLink');
      // need to notify the side navigation panel that we are on page 1
      this.slider_demo_service_.emit(2);
    }
  }

  routerOnDeactivate(next: ComponentInstruction, prev: ComponentInstruction) {
    //console.log('Deactivate: navigating from ', prev);
    //console.log('            navigating to ', next);
  }

  ngAfterViewInit() {
     // rfu
  }


  //
  //
  //

  hex_string_validator(c: Control): {[key: string]: any} {
    c['ongoing'] = false;
    c['msg'] = null;
    //console.log('============ DEBUG hex_string_validator ', c);
    //console.log('DEBUG string has been modified by user ', this.form_ctrl_);
    //console.log('DEBUG control ', this.form_ctrl_['hex_string']);
    let s = c.value;
    //console.log('DEBUG control string ', s);
    if (s === null || s === '') {
      c['msg'] = 'hex color string can not be empty';
      return {'empty': true};
    }

    //
    let res = s.match(this.re_long_hex_);
    if (res) {
      this.values_.red   = parseInt(res[1], 16);
      this.values_.green = parseInt(res[2], 16);
      this.values_.blue  = parseInt(res[3], 16);
      //console.log("NEW     = ", s);
      //console.log("CURRENT = ", this.hex_str_);
      //this.hex_str_ = s;
      this.cell_hex_str_ = s;

      return null;
    }

    res = s.match(this.re_short_hex_);
    if (res) {
      this.values_.red   = 17 * parseInt(res[1], 16);
      this.values_.green = 17 * parseInt(res[2], 16);
      this.values_.blue  = 17 * parseInt(res[3], 16);

      //console.log("NEW*    = ", s);
      //console.log("CURRENT*= ", this.hex_str_);
      //this.hex_str_ = s;
      this.cell_hex_str_ = s;
      return null;
    }

    // invalid hex string detection
    // the user can continue to key in values
    // without impact on the  RGB input fields and RGB sliders.
    //
    if (s.length > 7) {
      c['msg'] = 'hex color string must have at 4 or 7 characters';
      return {'length': true};
    }

    if (!s.match(/^#/)) {
      //console.log('Error: Hex color must start with a #');
      c['msg'] = 'hex color string must start with a #';
      return {'error': true};
    }
    if (!s.match(/^#$|^#([\da-f])+$/i)) {
      c['msg'] = 'hex color string must have hexadecimal digits after the #';
      return {'error': true};
    }

    // when we reach here, the input field has a partially valid hex color
    // ie. #12
    return {'ongoing': true};
  }

  constructor(private fb_: FormBuilder, private location_: Location,
              @Inject(forwardRef(() => SliderDemoService)) private slider_demo_service_: SliderDemoService ) {
    this.hex_str_ = this.to_rgb_str(this.values_.red, this.values_.green, this.values_.blue);
    this.cell_hex_str_ = this.hex_str_;

    this.form_ctrl_ = this.fb_.group({
      hex_string: [ '', (c: Control): {[key: string]: any} => { return this.hex_string_validator(c); } ]
    });

    //console.log('DEBUG: hex_str = ', this.hex_str_);
  }
}