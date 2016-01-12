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
import {SvgSliderDynCmp}           from '../slider/slider_dyn';
import {SliderDemoService}         from '../sliderdemo/sliderdemo_service';
import {DynSliderService,
        DynSliderEvtData}          from '../slider/slider_dyn_service';

// Dynamic Slider Demo 

@Component ({
  selector: 'gg-slider-demo-dyn',
  templateUrl: 'app/sliderdemo/sliderdemo_dyn.html',
  //events: ['colorChange'],
  directives: [LipsumCmp, SvgSliderDynCmp]
})
export class SliderDemoDynCmp implements AfterViewInit, OnActivate, OnDeactivate {
  private length_: number = 600;
  private values_array_: number[];

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
      this.slider_demo_service_.emit(3);
    }
  }

  click_delete_runner(idx: number) {
    console.log('[TRACE] Requesting delete of runner ', idx);
    let evt_data: DynSliderEvtData = {'add': false, 'idx': idx, 'del': true, 'val': 0};
    this.dyn_slider_service_.next(evt_data);
  }

  click_add_runner() {
    console.log('[TRACE] Requesting addition of a runner');
    let evt_data: DynSliderEvtData = {'add': true, 'idx': 0, 'del': false, 'val': 0};
    this.dyn_slider_service_.next(evt_data);
  }

  runner_pos_change(idx: number, evt: any ) {
    const val = evt.target.valueAsNumber;
    console.log('[TRACE] Value[', idx, '] has changed to', val);
    let evt_data: DynSliderEvtData = {'add': false, 'idx': idx, 'del': false, 'val': val};
    this.dyn_slider_service_.next(evt_data);
  }



  routerOnDeactivate(next: ComponentInstruction, prev: ComponentInstruction) {
    //console.log('Deactivate: navigating from ', prev);
    //console.log('            navigating to ', next);
  }

  ngAfterViewInit() {
     // rfu
  }



  constructor(private location_: Location, private dyn_slider_service_: DynSliderService,
              @Inject(forwardRef(() => SliderDemoService)) private slider_demo_service_: SliderDemoService ) {

    //this.form_ctrl_ = this.fb_.group({
    //  hex_string: [ '', (c: Control): {[key: string]: any} => { return this.hex_string_validator(c); } ]
    //});

    //console.log('DEBUG: hex_str = ', this.hex_str_);
  }
}