import {Component, Directive, ViewChild,
        AfterViewInit, Query, QueryList, ElementRef,
        OnChanges, Input, SimpleChange, Output, EventEmitter, OnInit,
        View} from 'angular2/core';
import {NgFor, DecimalPipe, NgIf, NgModel, FormBuilder, NgClass,
        NgControl, NgForm, Control, ControlGroup, FORM_DIRECTIVES } from  'angular2/common';
import {RouteConfig, RouteDefinition, Router, Route, RouteParams,
        ROUTER_PROVIDERS,
        RouterOutlet, RouterLink, APP_BASE_HREF, ROUTER_BINDINGS} from 'angular2/router';

import {DynSliderService,
        DynSliderEvtData}          from '../slider/slider_dyn_service';

///////////////////////////////////////////////////////////////////////////////
//
// Slider with Dynamic number of runners
// 
///////////////////////////////////////////////////////////////////////////////

class Runner {
  static cnt_ = 0;                     // instance counter          
  private val_ = 0;                   // exact value 
  private rounded_val_ = 0;           // rounded to 1/100th precision 
  private delta_ = 0;                 // to track offset while mouseMove;
  private base_ = 0;                  // id. k.push(0);
  private pos_ = 0;                   // pixel offset on the rail
  private trans_pos_ = '';            // the transform string for svg 'translate(${pos_})' 
  private rl_ = 0;                    // rail length in pixel

  private id_ = 0;                    // unique identifier
  private min_ = 0;                   // default min
  private max_ = 100;                 // default max

  constructor(val: number, min: number, max: number, rl: number) {
    this.id_ = Runner.cnt_++;
    // val: initial value;
    // rl: initial rail length
    //
    this.val_ = val;
    this.rl_ = rl;
    this.min_ = min;
    this.max_ = max;
    this.pos_ = this.value2pos(val);
    this.trans_pos_ = `translate(${this.pos_}, 0)`;
  }

  clip3(v: number, min: number, max: number): number {
    v = Number.isNaN(v) ? 0 : v;
    if (v < min) { return min; }
    if (v > max) { return max; }
    return v;
  }

  value2pos(v: number) {
    const pos = (this.rl_ * (v - this.min_)) / (this.max_ - this.min_);
    return this.clip3(pos, 0, this.rl_);
  }

  pos2value(p: number) {
    const v =  this.min_ + (p * (this.max_ - this.min_) / this.rl_);
    return this.clip3(v, this.min_, this.max_);
  }



}

@Component ({
  selector: 'gg-svg-slider-dyn',
  template: `
    <div  id="slider" style="margin:5px">

      <!-- special div which disables mousemove and mouseup event -->
      <div *ngIf="button_is_down_" style="position:relative"
           (window:mousemove)="onMousemove($event)"
           (window:mouseup)="onMouseup($event)" >
      </div>

      <svg  height="100" preserveAspectRatio="xMinYMin meet"
            xmlns="http://www.w3.org/2000/svg" viewBox="-60 -40 800 100" version="1.1" >

        <!-- reference (0,0), no fill, no stroke -->

        <rect #railref  x="0" y="0" width="1" height="1" style="fill:none;stroke:none"  />

        <!-- rail group -->

        <g id="ruler">
          <path [attr.d]="'M 0,0 h' + (rail_length_)" style="stroke-width:2px;stroke:black" />
          <g *ngFor="#_val of tick_marks_">
            <path [attr.d]="'M' + (_val * rail_length_ / 255) + ',0 v 30'" style="stroke-width:2px;stroke:black" />
            <text [attr.x]="_val * rail_length_ /255" y=50 text-anchor="middle" font-size="20">{{_val}}</text>
          </g>
        </g>

        <!-- runner group -->
        <!--
          <rect id="default-rail" x="0" y="-3" [attr.width]="rail_length_" height="7" style="fill:white;stroke-width:2px;stroke:black" />
          <path [attr.d]="'M0,0 L ' + rail_length_ + ',0' " style="stroke-width:2px;stroke:black" />
            <path [attr.d]="'M 0,' + (_val * rail_length_ / 255) + 'v 30'" style="fill:grey;stroke:black">
            <circle cx="0" cy="0" [r]="10 + _idx * 5" />
        -->

        <g *ngFor="#_name of runners_; #_idx = index" [attr.class]="change_notifier_"
            [id]="_name" 
            [attr.transform]="trans_pos_[_idx]"
            (mousedown)="onMousedown(railref, $event, true, _idx)" >
          
          <path id="panel" d="M 0 0 L 10 -10 L 30 -10 L 30 -35 L -30 -35 L -30 -10 L -10 -10 z"
          style="color:black;fill:black" />
          <text id="text" x="0" y="-17" text-anchor="middle"
                font-family="Verdana" font-size="10" fill="white">Runner {{_idx}}
          </text>

        </g>

      </svg>
    </div>
  `,
  styles: [`
  `],
  directives: [FORM_DIRECTIVES, NgFor]
})
export class SvgSliderDynCmp implements OnInit, AfterViewInit, OnChanges {
  //@Input() min: any;
  @Output() minChange:  EventEmitter<number> = new EventEmitter<number>();

  //@Input() max: any;
  @Output() maxChange:  EventEmitter<number> = new EventEmitter<number>();

  @Input() length: any;
  @Output() lengthChange:  EventEmitter<number> = new EventEmitter<number>();

  //@Input('values') values: any;
  @Output('values') emit_values: EventEmitter<number[]> = new EventEmitter<number[]>();

  private min_: number;
  private max_: number;
  private rail_length_: number;
  private min_rail_length_: number;
  private max_rail_length_: number;
  private change_notifier_ = 'dummy';

  private nb_runners_: number;
  private active_runner_: number[] = [];

  private value_: number[] = [];
  private rounded_value_: number[] = [];

  private pos_: number[] = [];

  private delta_: number[] = [];
  private base_: number[] = [];
  private button_is_down_: boolean = false;

  private trans_pos_: string[] = [];
  private label_offset_: number = 0;
  private runners_: string[] = [];

  private tick_marks_: number[] = [0, 50, 100, 150, 200, 255];

  constructor(private dyn_slider_service_: DynSliderService) {
    this.min_ = 0;
    this.max_ = 255;
    this.nb_runners_ = 3;
    this.rail_length_ = 700;
    this.min_rail_length_ = 10;
    this.max_rail_length_ = 4096;

    for (let i = 0; i < this.nb_runners_; ++i) {
      this.value_.push(0);
      this.rounded_value_.push(0);
      this.pos_.push(0);
      this.delta_.push(0);
      this.base_.push(0);
      this.trans_pos_.push('');
      this.runners_.push(`runner${i}`);
      this.values_changed(50 + (50 * i), i);
    }

    //console.log("[TRACE] constructor value = ", this.value_);
    //console.log("[TRACE] pos   = ", this.pos_);
    //console.log("[TRACE] trans = ", this.trans_pos_);

    dyn_slider_service_.subscribe({
      next: (data: DynSliderEvtData) => {
        if (data.add) {
          //console.log('[TRACE] Receive add slider request');
          const m = this.rounded_value_.length;
          this.rounded_value_.push(0);
          this.pos_.push(0);
          this.delta_.push(0);
          this.base_.push(0);
          this.trans_pos_.push('');
          this.runners_.push(`runner${m}`);
          this.value_.push(0);
          //this.values_changed(0);
          this.emit_full();
          //change_notifier = `dummy${value_.length}`;
        } else if (data.del) {
          //console.log('[TRACE] Receive remove slider request:', data.idx);
          this.rounded_value_.splice(data.idx, 1);
          this.pos_.splice(data.idx, 1);
          this.delta_.splice(data.idx, 1);
          this.base_.splice(data.idx, 1);
          this.trans_pos_.splice(data.idx, 1);
          this.runners_.splice(data.idx, 1);
          this.value_.splice(data.idx, 1);
          this.emit_full();
        } else {
          //console.log('[TRACE] Receive update slider request:', data.idx, ' with value ', data.val);
          this.values_changed(data.val, data.idx);
        }
        //console.log('[TRACE] notify value = ', this.value_);
      }
    });

  }

  clip3(v: number, min: number, max: number): number {
    v = Number.isNaN(v) ? 0 : v;
    if (v < min) { return min; }
    if (v > max) { return max; }
    return v;
  }

  value2pos(v: number) {
    const pos = (this.rail_length_ * (v - this.min_)) / (this.max_ - this.min_);
    return this.clip3(pos, 0, this.rail_length_);
  }

  pos2value(p: number) {
    const v =  this.min_ + (p * (this.max_ - this.min_) / this.rail_length_);
    return this.clip3(v, this.min_, this.max_);
  }


  emit(idx: number) {
    const str = `emit_values`;
    if (str in this) {
      //console.log('[TRACE] emit  ',`${this.rounded_value_[idx]}`);
      this[str].emit(this.rounded_value_);
    }
  }

  emit_full() {
    const str = `emit_values`;
    if (str in this) {
      //console.log('[TRACE] emit* ',`${this.rounded_value_}`);
      this[str].emit(this.rounded_value_);
    }
  }

  ngOnInit() {
    if ('length' in this) {
      this.rail_length_ = Number(this.length);
    } else {
      this.rail_length_ = 700;
    }
    this.rail_length_ = this.clip3(this.rail_length_, this.min_rail_length_, this.max_rail_length_);
    for (let i = 0; i < this.nb_runners_; ++i) {
      this.values_changed(this.value_[i], i);
    }

    //console.log("[TRACE] after view init value = ", this.value_);
    this.emit_full();
  }

  values_changed(v: number, idx: number) {
    //console.log('[TRACE] value change[', idx, '] = ', v);
    this.value_[idx] = this.clip3(v, this.min_, this.max_);
    this.rounded_value_[idx] =   Math.round(v * 10) / 10;
    this.pos_[idx] = this.value2pos(v);
    this.trans_pos_[idx] = `translate(${this.pos_[idx]},${this.label_offset_})`;
  }

  position_changed(pos: number, idx: number) {
    //console.log('[TRACE] pos change[', idx, '] = ', pos);
    this.pos_[idx] = this.clip3(pos, 0, this.rail_length_);
    this.trans_pos_[idx] = `translate(${this.pos_[idx]},${this.label_offset_})`;
    this.value_[idx] = this.pos2value(this.pos_[idx]);
    this.rounded_value_[idx] = Math.round(this.value_[idx] * 10) / 10;
    this.emit(idx);
  }

  //
  // detecting changes and emit value
  // value, min, max
  // when the button is down, the changes
  // to the runner position are emitted with mousemove

  ngOnChanges(changes: {[propName: string]: SimpleChange}) {
  }


  ngAfterViewInit() {
    this.label_offset_ = 0;

    if ('length' in this) {
      this.rail_length_ = Number(this.length);
    } else {
      this.rail_length_ = 700;
    }
    this.rail_length_ = this.clip3(this.rail_length_, this.min_rail_length_, this.max_rail_length_);
    for (let i = 0; i < this.nb_runners_; ++i) {
      this.values_changed(this.value_[i], i);
    }
    this.emit_full();
    //console.log("[TRACE] after view init value = ", this.value_);
  }

  //
  // Details on the position calculation
  //
  //                    initial               final          !onbutton       
  //  [3]---------------------------------------------------------> (= evt.clientX)
  //
  //  |--------->@              (= base_  given by elm.getBoundingClientRect().left)
  //             @       +=======+            +=======+
  //             +-------|       |------------|       |---------------------+
  //             +-------|   o   |------------|   o   |-----------o---------+
  //             +-------|     x |------------|     x |---------------------+
  //                     +=======+            +=======+
  //             |---------->     (= pos)
  //                        <->   (= offset)
  //  [1]--------------------->   (= evt.clientX)
  //  [2]-----------------------------------------> (= evt.clientX)
  //
  //  On initial mouse down, we can compute delta as we have:
  //  evt.clientX[1] = base + pos + offset   
  //
  //  On mouse move/up, we can compute npos_ given by
  //  evt.clientX[2] = base + npos + offset   
  //  => npos = evt.clientX[2] - (evt.clientX[1] - pos)
  // 
  //  Special case when rail is clicked [3], we assume a virtual [1], so we have: 
  //  evt.clientX[3] = base + npos  
  //  evt.clientX[1] = base + pos 
  //  => npos = evt.clientX[3] - (evt.clientX[1]  - pos)

  // Note the preventDefault to ensure that the future mouse events
  // are not propagated to other elements

  onMousedown(elm: any, evt: any, on_button: boolean, idx?: number) {
    evt.preventDefault();
    this.button_is_down_ = true;
    this.active_runner_ = [];
    if (!on_button) {
      // special case when the mouse down occur on the slide zone
      // and not on the slider button
      for (let i = 0; i < this.nb_runners_; ++i) {
        this.delta_[i] = elm.getBoundingClientRect().left;
        const pos = evt.clientX - this.delta_[i];
        this.position_changed(pos, i);
        this.active_runner_.push(i);
      }
    } else {
      this.active_runner_.push(idx);
      this.delta_[idx] = evt.clientX - this.pos_[idx];
    }
  }

  //
  // this function can only be called when button_is_down_ is true
  // as we have used a special div with *ngIf
  // <div *ngIf="button_is_down_"  (window:mousemove)="onMousemove($event)" ..
  //
  onMousemove(evt: any) {
    this.active_runner_.forEach((val: number, idx: number, arr: number[]) => {
      const pos = evt.clientX - this.delta_[val];
      this.position_changed(pos, val);
    });
  }

  //
  // the release of the mouse button
  // removes the div with the (window:mousemove) events
  //

  onMouseup(evt: any) {
    this.button_is_down_ = false;
  }
}