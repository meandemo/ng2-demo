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
// Slider Demo: Gradient
//
///////////////////////////////////////////////////////////////////////////////

import {LipsumCmp}                 from '../lipsum/lipsum';
import {SvgSliderRgbCmp}           from '../slider/slider_rgb';
import {SvgSliderDynCmp}           from '../slider/slider_dyn';
import {SliderDemoService}         from '../sliderdemo/sliderdemo_service';
import {SliderService,
        SliderEvtData}          from '../slider/slider_service';

import {Util}                      from '../../common/util';
import {Runner,
        RunnerEvtData}             from '../slider/runner';


import {AnimateHeightDrctv}        from '../animation/animations';



@Component ({
  selector: 'gg-slider-demo-gradient',
  templateUrl: 'app/sliderdemo/sliderdemo_gradient.html',
  styles: [`

    div#container {
      width: 100%;
      height: 500px;
      position: relative;
      background: none;
    }
    div#container-control {
      font-size: 12px;
      width: 100%;
      background: black;
      color: white;
    }
    div#animate-control {
      font-size: 12px;
      width: 100%;
      height: 20px;
      background: black;
      color: white;
    }

    div#canvas-enclosure {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0px;
      left: 0px;
      z-index: 5;
      background: none;
    }

    canvas#canvas {
      position: absolute;
      top: 0px;
      left: 0px;
      z-index: 6;
      background: none;
    }

    div#hslider {
      width: 100%;
      height: 80px;
      position: absolute;
      bottom: 0px;
      left: 0px;
      z-index: 30;
      background: none;
    }

    div#vslider {
      margin: 0px;
      width: 80px;
      height: 100%;
      background: none;
      position: absolute;
      top: 0px;
      left: 250px;
      background: none;
      z-index: 20;
    }
}
  `],
  //styleUrls: ['css/sliderdemo_gradient.css'],
  directives: [AnimateHeightDrctv, LipsumCmp, SvgSliderRgbCmp, SvgSliderDynCmp]
})
export class SliderDemoGradientCmp implements OnInit, OnChanges, AfterViewInit, OnActivate, OnDeactivate {
  private nb_points_ = 10;
  private initial_points_ = 3;
  private indexes_: number[] = [];
  private rgbs_: any[] = [];
  private xs_: number[] = []; // = [10, 20, 30, 40];
  private ids_: string[] = []; //= [null, null, null, null];
  private are_enabled_: boolean[] = []; // = [false, false, false, false];
  private r2i_table_: Map<string, number>;
  private i2rgb_table_: Map<number, any>;
  private hrail_length_: number;
  private vrail_length_: number;
  private runners_: Runner[] = [];
  private idx_last_enabled_vslider_: number;

  // canvas variables
  private canvas_: any;
  private ctx_: any;
  private canvas_height_: number;
  private canvas_width_: number;

  private dx_ = 40;
  private dy_ = 40 + this.vrail_length_;
  //private notifier_: any = { 'toggle': true};

  private cfg_ = {
    hide_colored_lines: false,
    hide_vertical_bars: false,
    hide_vertical_runners: false,
    hide_horizontal_bar: false,
    use_spline_interpolation: false,
    hide_horizontal_runners: false
  };

  private txt_configuration_: string;


  onCheckboxChange(name: string, evt: any) {
    if (name === 'hide_colored_lines') {
      this.cfg_.hide_colored_lines = !this.cfg_.hide_colored_lines;
      this.update_curves();
    }
    if (name === 'use_spline_interpolation') {
      this.cfg_.use_spline_interpolation = !this.cfg_.use_spline_interpolation;
      this.update_curves();
    }
  }

  ngOnChanges(evt: any) {
    console.log("TRACE: ngOnChanges()... ", evt);
  }

  ngAfterViewInit() {
  }

    //  console.log('CANVAS width  = ', wt);
    //  console.log('CANVAS height = ', ht);
    //  this.ctx_.scale(1, 1);
    //  this.ctx_.fillStyle = '#FF0000';
    //  this.ctx_.strokeStyle = '#FF0000';

  ngOnInit() {
    // console.log('[TRACE] OnInit()');  // the canvas enclosure
    let elm  = document.getElementById('canvas-enclosure');
    this.canvas_ = document.getElementById('canvas');
    this.canvas_.width  = elm.clientWidth;
    this.canvas_.height = elm.clientHeight;
    this.ctx_ = this.canvas_.getContext("2d");
    this.ctx_.globalAlpha = 1;
    this.ctx_.lineWidth = 2;

    this.hrail_length_ = this.canvas_.width - 80;
    this.vrail_length_ = this.canvas_.height - 120;
    this.dx_ = 40;
    this.dy_ = 40 + this.vrail_length_;
  }
    //  this.canvas_ = document.getElementById('canvas');
    //  this.ctx_ = this.canvas_.getContext("2d");



  routerOnActivate(next: ComponentInstruction, prev: ComponentInstruction) {
    // console.log('Activate:   navigating from ', prev);
    // console.log('            navigating to ', next);
    // console.log('            router state', this.location_);
    // console.log('            router url() ', this.location_.normalize());
    if (prev === null) {
      // console.log('[DEBUG] Navigating to ', next);
      // console.log('[DEBUG] Location is ', this.location_);
      // console.log('[DEBUG] Hum! navigation to ', window.location.pathname, ' without navigate() or routerLink');
      // need to notify the side navigation panel that we are on page 1
      this.slider_demo_service_.emit(4);
    }
  }

  routerOnDeactivate(next: ComponentInstruction, prev: ComponentInstruction) {
    // console.log('Deactivate: navigating from ', prev);
    // console.log('            navigating to ', next);
  }


  click_add_char(elm: any, evt: any) {
    // console.log('[TRACE] add char', elm);
    // console.log('[TRACE] add char', evt);
  }

  click_delete_runner(runner: Runner) {
    // console.log('[TRACE] Requesting delete of runner ', runner);
    let evt_data: SliderEvtData = {'del': true, 'runner': runner};
    this.slider_service_.next(evt_data);
  }

  click_add_runner(val: number) {
    // console.log('[TRACE] Requesting addition of a runner');
    let evt_data: SliderEvtData = {'add': true, 'val': val};
    this.slider_service_.next(evt_data);
  }

  runner_pos_change(runner: Runner, evt: any ) {
    const val = evt.target.valueAsNumber;
    // console.log('[TRACE] Runner[', runner, '] has changed to', val);
    let evt_data: SliderEvtData = {'runner': runner, 'val': val};
    this.slider_service_.next(evt_data);
  }


  rgb_value_changes(idx: number, x: number, rgb_datas: RunnerEvtData[], comp: any) {
    // console.log('[TRACE] RGB[', idx, '] x = ', x, ' has changed to',
    //            rgb_datas[0].value, rgb_datas[1].value, rgb_datas[2].value);

    this.rgbs_[idx][0] = rgb_datas[0].value;
    this.rgbs_[idx][1] = rgb_datas[1].value;
    this.rgbs_[idx][2] = rgb_datas[2].value;

    this.update_curves();

    let compi = this.i2rgb_table_.get(idx);
    if (compi === undefined) {
      this.i2rgb_table_.set(idx, comp);
    }
  }

  //
  // the rdatas are always sent in the same order
  // some elements may be removed, some may be added
  // We maintain a mapping between the vertical sliders RGB[0], RGB[1], ..... RGB[N-1]
  // and the horizontal slider Hxxx
  //
  //                R[0] R[1] R[2] R[3]
  //     Hxxx     [ H41F H9E3 H123  -   ]

  // All runners in the rdatas array must be assigned to
  // and RGB[x], this assignement must always be the same
  // Phase #1
  // Is it possible that some RGB[x] as associated with a ID not in the rdatas.
  // we mark this [x] as available
  // Phase #1
  // We iterate through the rdatas, with a hash table
  // If an ID is not is the hash table
  // We iterate through the RGB[x] to find the first free index
  // a associate the new name with it.

  // add current  [ H41F H9E3 H123 H24A ]
  //
  // del current  [ R41F R9E3 R123 R24A ]
  //

  hrunner_changes(rdatas: RunnerEvtData[]) {
    // Phase #0
    // console.log('[TRACE] Runner have changed ', rdatas.length);

    // Initialize a mapping 'ID' -> idx f
    this.idx_last_enabled_vslider_ = -1;
    this.runners_ = [];
    let rmaps = new Map<string, number>();
    rdatas.forEach((rdata: RunnerEvtData, i: number) => {
      rmaps.set(rdata.id, rdata.value);
      this.runners_.push(rdata.runner);
    });

    let has_changed = false;

    // Phase #1
    // if an ID is not in rmaps, then it must be removed from the list of ID
    //
    this.ids_.forEach((id: string, i: number) => {
      if (id && rmaps.get(id) === undefined ) {
        this.ids_[i] = null;
        has_changed = true;
      }
    });

    // Phase #2
    // iterate through rdatas again, and check the global mapping
    // some elements of rdatas may not be in the mapping
    // (newly created elemnent)
    rdatas.forEach((rdata: RunnerEvtData) => {
      let id = rdata.id;
      let idx = this.r2i_table_.get(id);
      if (idx === undefined) {
        // this ID is not the global table
        idx = this.ids_.findIndex((lid: string) => {
          return lid === null;
        });
        if (idx !== -1) {
          has_changed = true;
          this.r2i_table_.set(id, idx);
          this.ids_[idx] = id;
          this.idx_last_enabled_vslider_ = idx;
        }
      }
    });

    //
    // IDS is now complete
    // we can populate xs_ and are_enable_
    //
    this.ids_.forEach((id: string, i: number) => {
      if (id !== null) {
        this.are_enabled_[i] = true;
        this.xs_[i] = rmaps.get(id);
      } else {
        this.are_enabled_[i] = false;
      }
      this.update_curves();
    });

    //this.notifier_.toggle = !this.notifier_.toggle;
  }



  //
  // xs_[i] is a vector of x coordinates
  // rgbs_[i] is a vector of 3 values [r, g, b]
  // step1: we need to sort the xs_[i] in increasing order
  // step2: prepare the x, yr, yg, yb array

  update_curves() {
    // console.log('[TRACE] update_curves()');

    // step 1: sort

    let sindexes = Array.from({length: this.nb_points_}, ((v, k) => k));
    sindexes.sort((a: number, b: number) => {
      // note: return -1  -> a is sorted lower than b
      // note: return  0  -> a and b are not changed
      // note: return  1  -> b is sorted lower than a
      if (this.are_enabled_[a] && this.are_enabled_[b]) {
        return this.xs_[a] - this.xs_[b];
      } else if (!this.are_enabled_[a] && !this.are_enabled_[b]) {
        return 0;
      } else if (!this.are_enabled_[a]) {
        return 1;
      } else {
        return -1;
      }
    });

    // step 2: prepare the x, y array
    // - avoid duplicate on x coordinates
    // - if length is 0 -> add default
    // - if first is not at 0, duplicate first
    // - if last is not at max, duplicate last

    let xs: number[] = [];
    let yrs: number[] = [];
    let ygs: number[] = [];
    let ybs: number[] = [];

    let x_prev = NaN;
    sindexes.forEach((idx: number) => {
      if (this.are_enabled_[idx]) {
        let x = this.xs_[idx];
        if (x !== x_prev) {
          x_prev = x;
          xs.push(x);
          yrs.push(this.rgbs_[idx][0]);
          ygs.push(this.rgbs_[idx][1]);
          ybs.push(this.rgbs_[idx][2]);
        }
      }
    });

    if (xs.length === 0) {
      let xmid = this.hrail_length_ / 2;
      let ymid = this.vrail_length_ / 2;
      xs.push(xmid);
      yrs.push(ymid);
      ygs.push(ymid);
      ybs.push(ymid);
    }

    if (xs[0] !== 0) {
      xs.unshift(0);
      yrs.unshift(yrs[0]);
      ygs.unshift(ygs[0]);
      ybs.unshift(ybs[0]);
    }

    let li = xs.length - 1;
    if (xs[li] !== this.hrail_length_) {
      xs.push(this.hrail_length_);
      yrs.push(yrs[li]);
      ygs.push(ygs[li]);
      ybs.push(ybs[li]);
    }


    this.draw_canvas(xs, [yrs, ygs, ybs]);
    this.update_configuration(xs, [yrs, ygs, ybs]);
  }


  // draw background using
  // painfull line by line draw

  draw_background_slow(xs: number[], yys: any[]) {
    let ctx = this.ctx_;
    let x0: number;
    let ys0: number[];

    let x1 = xs[0];
    let ys1 = yys.map((yy: any) => { return yy[0]; });
    let as = [0, 0, 0];
    let bs = [0, 0, 0];
    let cs = [0, 0, 0];

    let i = 0;
    for (let x = 0; x < this.hrail_length_; x++) {
      if (x >= x1) {
        i++;
        x0 = x1;
        ys0 = ys1;
        x1 = xs[i];
        ys1 = yys.map((yy: any) => { return yy[i]; });
        for (let c = 0; c < 3; c++) {
          as[c] = (ys1[c] - ys0[c]) / (x1 - x0);
          bs[c] = ys0[c] - as[c] * x0;
        }
      }
      // RGB: 3 linear interpolations
      for (let c = 0; c < 3; c++) {
        let y = x * as[c]  + bs[c];
        cs[c] = 255 * (y / this.vrail_length_);
      }
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.vrail_length_);
      ctx.strokeStyle = Util.rgb2str(cs[0], cs[1], cs[2]);
      ctx.stroke();
    }
  }

  //
  // We have received a json configuration
  // { "data": [ [0.2497, "#2b5680" ], [0.5006, "#b56801" ], [0.7503, "#2b5681" ] ] }
  // step1: update the gradient to reflect these new values
  // step2: remove all runners

  update_configuration_from_json(obj: any) {

    // delete all existing runners we have to do it
    // in two steps, as the runners_ array is updated
    // by the change event from the slider_dyn
    //

    let deleted_runners: Runner[] = [];
    this.runners_.forEach((runner: Runner, i: number) => {
      deleted_runners.push(runner);
    });

    deleted_runners.forEach((runner: Runner, i: number) => {
      //let v = this.notifier_.toggle;
      // we have a major issue here as the change event is asynchronous
      // we have to wait util the runner is effectively removed
      //
      // let p = new Promise((resolve: any, reject: any) => {
      // console.log('Init promise');
      //  this.notifier_.watch('toggle', () => {
      //    console.log('notified has toggled');
      //    resolve(true); });
      //});
      this.click_delete_runner(runner);

      //p.then((val: any) => { console.log('Promise fulfilled', val); })
      // .catch((reason: any) => { console.log('Reject promise ', reason); });
    });

    // console.log('[TRACE] are enabled_ ', this.are_enabled_);


    // add runners at the x offset
    // we must get the vertical RGB slider
    // which has been added
    // to set the color
    //

    let res = '';
    obj['data'].forEach((pair: any[], i: number) => {
      let x = pair[0];
      let sxi = x.toFixed(4);
      let colori = pair[1];
      res +=  `${sxi} ${colori}\n`;

      this.click_add_runner(x * this.hrail_length_);
      // console.log('[TRACE] add runner ', this.idx_last_enabled_vslider_);

      if (this.idx_last_enabled_vslider_ !== -1) {
        let colors = Util.str2rgb(pair[1]).map((c: number) => { return this.vrail_length_ * c / 255; });
        let comp = this.i2rgb_table_.get(this.idx_last_enabled_vslider_);
        comp.set_values(colors);
      }
    });

    this.txt_configuration_ = res;
  }


  update_configuration(xs: number[], yys: any[]) {
    let vscale = 255 / this.vrail_length_;
    let res = '';
    xs.forEach((xi: number, i: number) => {
      if ((i !== 0) && (i !== (xs.length - 1))) {
        let sxi = (xi / this.hrail_length_).toFixed(4);
        let ysi = yys.map((yy: any) => { return vscale * yy[i]; });
        let colori  = Util.rgb2str(ysi[0], ysi[1], ysi[2]);
        res +=  `${sxi} ${colori}\n`;
        }
    });

    this.txt_configuration_ = res;
  }


  // we need a bit of tinkering to covert into a JSON IsObject
  // 1. remove the trailing \n
  // 2.
  clicked_apply_config() {
    let msg0 = this.txt_configuration_ + '\n';
    let msg1 = msg0.replace(/^#.*?\n/g, '');
    let msg2 = msg1.replace(/^\n#.*?\n/g, '\n');
    let msg3 = msg2.replace(/\n*$/, ' ] ] }');
    msg3 = msg3.replace(/\n/g, ' ], [');
    msg3 = msg3.replace(/^/, '{ "data": [ [');
    msg3 = msg3.replace(/ (#\w+) /g, ', "$1" ');

    // console.log("APPLY config[2] = ", msg2);
    // console.log("APPLY config[3] = ", msg3);
    try {
      let obj = JSON.parse(msg3);
      // check the indexes 0 <=  idx <= 1
      // check correct hex string (6 digit)
      obj['data'].forEach((pair: any[], i: number) => {
        let v = pair[0];
        if (v < 0 || v > 1) {
          throw (`ValueError: the ${i}th number must be been 0 and 1 inclusive but got ${v}`);
        }
        let hex = pair[1];
        if (!hex.match(/^#(\d|[A-F]){6}$/i)) {
          throw (`ColorError: the ${i}th color must have 6 hexadecimal digits but got ${hex}`);
        }
      });
      this.update_configuration_from_json(obj);
    } catch (e) {
      console.log('Error: ', e);
      this.txt_configuration_ = '# Error: could not understand the text field\n' +
                                 this.txt_configuration_;
    }
  }

  clicked_save_config() {
    console.log('INFO: save configuration not implemented yet!');
  }


  // draw background using canvas native gradient facilities
  //

  draw_background_with_gradient(xs: number[], yys: any[]) {
    let ctx = this.ctx_;
    let vscale = 255 / this.vrail_length_;
    ctx.save();

    let grd = ctx.createLinearGradient(0, 0, this.hrail_length_, 0);
    xs.forEach((xi: number, i: number) => {
      let ysi = yys.map((yy: any) => { return vscale * yy[i]; });
      let colori  = Util.rgb2str(ysi[0], ysi[1], ysi[2]);
      grd.addColorStop(xi / this.hrail_length_, colori);
    });

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, this.hrail_length_, this.vrail_length_);
    ctx.restore();
  }


  draw_canvas(xs: number[], yys: any[]) {
    //  console.log('CANVAS width  = ', this.canvas_.getBoundingClientRect().width);
    //  console.log('CANVAS height = ', this.canvas_.getBoundingClientRect().height);
    let ctx = this.ctx_;
    ctx.save();
    ctx.moveTo(0, 0);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this.canvas_.width, this.canvas_.height);

    const colors = ['red', 'green', 'blue'];

    ctx.save();
    ctx.translate(40, 40 + this.vrail_length_);
    ctx.scale(1, -1);

    // draw background

    this.draw_background_with_gradient(xs, yys);

    // draw RGB lines

    if (!this.cfg_.hide_colored_lines) {
      for (let c = 0; c < 3; c++) {
        let ys = yys[c];
        ctx.beginPath();
        ctx.moveTo(xs[0], ys[0]);
        for (let j = 1; j < xs.length; j++) {
          ctx.lineTo(xs[j], ys[j]);
        }
        ctx.strokeStyle = colors[c];
        ctx.stroke();
      }
    }
    ctx.restore();
    ctx.restore();
  }
    //  this.ctx_.beginPath();
    //  this.ctx_.moveTo(xs[0], 255 - yrs[0]);
    //  this.ctx_.lineTo(xs[1], 255 - yrs[1]);
    //  this.ctx_.stroke();
    //
    //  console.log('[DEBUG] X values = ', xs);
    //  console.log('[DEBUG] R values = ', yrs);
    //  }


  constructor(private location_: Location, private slider_service_: SliderService,
              @Inject(forwardRef(() => SliderDemoService)) private slider_demo_service_: SliderDemoService ) {
    this.r2i_table_ = new Map<string, number>();
    this.i2rgb_table_ = new Map<number, any>();
    //this.indexes_ = Array.from({length: this.nb_points_}, ((v, k) => k));
    //console.log('[DEBUG] Indexes = ', this.indexes_);
    for (let  i = 0; i < this.nb_points_; i++) {
      this.indexes_.push(i);
      this.xs_.push(0);
      this.ids_.push(null);
      this.are_enabled_.push(false);
      let rgb = [0, 0, 0];
      this.rgbs_.push(rgb);
      this.runners_.push(null);
    }
  }
}