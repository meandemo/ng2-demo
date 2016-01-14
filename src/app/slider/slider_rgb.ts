import {Component, Directive, ViewChild,
        AfterViewInit, Query, QueryList, ElementRef,
        OnChanges, Input, SimpleChange, Output, EventEmitter, OnInit,
        View} from 'angular2/core';
import {NgFor, DecimalPipe, NgIf, NgModel, FormBuilder, NgClass,
        NgControl, NgForm, Control, ControlGroup, FORM_DIRECTIVES } from  'angular2/common';
import {RouteConfig, RouteDefinition, Router, Route, RouteParams,
        ROUTER_PROVIDERS,
        RouterOutlet, RouterLink, APP_BASE_HREF, ROUTER_BINDINGS} from 'angular2/router';

import {Util}                      from '../../common/util';
import {Runner}                    from './runner';

///////////////////////////////////////////////////////////////////////////////
//
// Nested SVG: not working at the present time
// See: https://github.com/angular/angular/issues/1632
///////////////////////////////////////////////////////////////////////////////

@Component({
  selector: 'g[rgb-pie]',
  template: `
    <g id="circle" [attr.transform]=" 'rotate(' + (-110 + (idx * 40)) + ')' " >
      <path id="pie" d="M 0 0 h 20 A 20,20 0 0,1 14.321 12.855 Z" ></path>
      <g transform="rotate(120)">
        <path id="pie" d="M 0 0 h 20 A 20,20 0 0,1 14.321 12.855 Z" ></path>
        <g transform="rotate(120)">
          <path id="pie" d="M 0 0 h 20 A 20,20 0 0,1 14.321 12.855 Z"></path>
        </g>
      </g>
    </g>
    `
})
class SvgRunnerRgbCmp {
  @Input() idx: number;
}

///////////////////////////////////////////////////////////////////////////////
//
// Slider RGB Selection: Three Runner Slider
//
///////////////////////////////////////////////////////////////////////////////

@Component ({
  selector: 'gg-svg-slider-rgb',
  template: `
    <div  id="slider" style="margin:5px">

      <!-- special div which disables mousemove and mouseup event -->
      <div *ngIf="button_is_down_" style="position:relative"
           (window:mousemove)="onMousemove($event)"
           (window:mouseup)="onMouseup($event)" >
      </div>

      <!--              -->
      <!-- Horizontal   -->
      <!--              -->

      <div *ngIf=!is_vertical_>
        <svg height="100" preserveAspectRatio="xMinYMin meet"
          xmlns="http://www.w3.org/2000/svg" viewBox="-60 -40 800 100" version="1.1" >

          <!-- reference (0,0), no fill, no stroke -->

          <rect #railref  x="0" y="0" width="1" height="1" style="fill:none;stroke:none"  />

          <g id="rail" (mousedown)="onMousedown(railref, $event, false)">
            <path [attr.d]="'M 0,-5 v 10 h' + (rl_) + ' v -10 z'"
                  style="stroke-width:2px;stroke:black;fill:violet" />
          </g>

          <g *ngFor="#_val of tick_marks_">
            <path [attr.d]="'M' + get_pos(_val) + ',5 v 30'" style="stroke-width:2px;stroke:black" />
            <text [attr.x]="get_pos(_val)" y=50 text-anchor="middle" font-size="20">{{_val}}</text>
          </g>

          <g *ngFor="#_runner of runners_; #_idx = index"
              [id]="get_color(_runner)" class="rgb-runner"
              [attr.transform]="'translate(' + _runner.get_pos() + ', 0)'"
              (mousedown)="onMousedown(railref, $event, true, _idx)" >

            <g id="circle" [attr.transform]=" 'rotate(' + (-110 + (_idx * 40)) + ')' " >
              <path id="pie" d="M 0 0 h 20 A 20,20 0 0,1 14.321 12.855 Z" />
              <g transform="rotate(120)">
                <path id="pie" d="M 0 0 h 20 A 20,20 0 0,1 14.321 12.855 Z" />
                <g transform="rotate(120)">
                  <path id="pie" d="M 0 0 h 20 A 20,20 0 0,1 14.321 12.855 Z" />
                </g>
              </g>
            </g>
            -->
          </g>

        </svg>
      </div>

      <!--              -->
      <!-- Vertical     -->
      <!--              -->

      <div *ngIf=is_vertical_>
        <svg width="120" preserveAspectRatio="xMinYMin meet"
             xmlns="http://www.w3.org/2000/svg" [attr.viewBox]="'-40 -60 120 ' + (rl_ + 100)" version="1.1" >

          <rect #railref  x="0" y="0" width="1" height="1" style="fill:none;stroke:none"  />

          <g id="rail" (mousedown)="onMousedown(railref, $event, false)">
            <path [attr.d]="'M -5,0 h 10 v' + (rl_) + ' h -10 z'"
                style="stroke-width:2px;stroke:black;fill:violet" />
          </g>

          <g *ngFor="#_val of tick_marks_">
            <path [attr.d]="'M 5,' + get_pos(_val) + ' h 30'" style="stroke-width:2px;stroke:black" />
            <text [attr.y]="get_pos(_val)" x=35 baseline-shift="-30%" font-size="20">{{_val}}</text>
          </g>
          <g *ngFor="#_runner of runners_; #_idx = index"
              [id]="get_color(_runner)" class="rgb-runner"
              [attr.transform]="'translate(0, ' + _runner.get_pos() + ')'"
              (mousedown)="onMousedown(railref, $event, true, _idx)" >

            <g id="circle" [attr.transform]="'rotate(' + (-110 + (_idx * 40)) + ')' " >
              <path id="pie" d="M 0 0 h 20 A 20,20 0 0,1 14.321 12.855 Z" />
              <g transform="rotate(120)">
                <path id="pie" d="M 0 0 h 20 A 20,20 0 0,1 14.321 12.855 Z" />
                <g transform="rotate(120)">
                  <path id="pie" d="M 0 0 h 20 A 20,20 0 0,1 14.321 12.855 Z" />
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  `,
  styleUrls: [`./css/slider_rgb.css`
  ],
  directives: [FORM_DIRECTIVES, NgIf, NgFor]
})
export class SvgSliderRgbCmp implements OnInit, AfterViewInit, OnChanges {
  @Input() min: any;
  @Output() minChange:  EventEmitter<number> = new EventEmitter<number>();

  @Input() max: any;
  @Output() maxChange:  EventEmitter<number> = new EventEmitter<number>();

  @Input() length: any;
  @Output() lengthChange:  EventEmitter<number> = new EventEmitter<number>();

  @Input() vertical: boolean;

  @Input('red') value0: any;
  @Output('redChange') emit_value0_: EventEmitter<number> = new EventEmitter<number>();

  @Input('green') value1: any;
  @Output('greenChange') emit_value1_: EventEmitter<number> = new EventEmitter<number>();

  @Input('blue') value2: any;
  @Output('blueChange') emit_value2_: EventEmitter<number> = new EventEmitter<number>();

  private min_: number;
  private max_: number;
  private rl_: number;          // rail length
  private min_rl_: number;
  private max_rl_: number;
  private r2name_: Map<Runner, [string, number]>;

  private runners_: Runner[] = [];
  private active_runners_: Runner[];
  private nb_runners_: number;
  private is_vertical_: boolean = false;

  private button_is_down_: boolean = false;

  private tick_marks_: number[] = [0, 50, 100, 150, 200, 255];

  constructor() {
    const colors  = ['red', 'green', 'blue'];
    this.min_ = 0;
    this.max_ = 255;
    this.nb_runners_ = 3;
    this.rl_ = 700;
    this.min_rl_ = 10;
    this.max_rl_ = 4096;
    this.r2name_ = new Map<Runner, [string, number]>();

    for (let i = 0; i < this.nb_runners_; ++i) {
      let runner = new Runner(50 + (50 * i), this.min_, this.max_, this.rl_);
      this.runners_.push(runner);
      this.r2name_.set(runner, [colors[i], i]);
    }
  }

  get_pos(v: number) {
    let pos = (this.rl_ * (v - this.min_)) / (this.max_ - this.min_);
    if (this.is_vertical_) {
      pos = this.rl_ - pos;
    }
    return Util.clip3(pos, 0, this.rl_);
  }

  get_color(runner: Runner) {
    //console.log("[TRACE] get_color: ", (this.r2name_.get(runner))[0]);
    return (this.r2name_.get(runner))[0];
  }

  emit_runner_value(runner: Runner) {
    const idx = (this.r2name_.get(runner))[1];
    const str = `emit_value${idx}_`;
    if (str in this) {
      let v = this.runners_[idx].get_value(true);
      this[str].emit(v);
    }
  }

  ngOnInit() {
    //console.log("[TRACE] ngOnInit() ");
    if ('vertical' in this) {
      this.is_vertical_ = true;
    }



    if ('min' in this) {
      this.min_ = Number(this.min);
    }

    if ('max' in this) {
      this.max_ = Number(this.max);
    }

    if (this.max_ === this.min_) {
      this.max_ = this.min_ + 1;
    } else if (this.max_ < this.min_) {
      const tmp = this.max_;
      this.max_ = this.min_;
      this.min_ = tmp;
    }

    if ('length' in this) {
      this.rl_ = Number(this.length);
    } else {
      this.rl_ = 700;
    }
    this.rl_ = Util.clip3(this.rl_, this.min_rl_, this.max_rl_);
    this.runners_.forEach((runner: Runner, i: number, runners: Runner[]) => {
      runner.set_direction(this.is_vertical_);
      runner.update_rail_length(this.rl_);
      this.emit_runner_value(runner);
    });
  }

  //
  // detecting changes and emit value
  // value, min, max
  // when the button is down, the changes
  // to the runner position are emitted with mousemove
  get_min_of_values(): number {
    let min = this.max_;
    this.runners_.forEach((runner: Runner, i: number, runners: Runner[]) => {
      min = Math.min(min, runner.get_value());
    });
    return min;
  }

  get_max_of_values(): number {
    let max = this.min_;
    this.runners_.forEach((runner: Runner, i: number, runners: Runner[]) => {
      max = Math.max(max, runner.get_value());
    });
    return max;
  }

  ngOnChanges(changes: {[propName: string]: SimpleChange}) {
    if (this.button_is_down_) {
      return;
    }

    this.runners_.forEach((runner: Runner, i: number, runners: Runner[]) => {
      const str = `value${i}`;
      if (changes[str]) {
        let v = Number(changes[str].currentValue);
        if ((Number.isNaN(v)) || (v < this.min_) || (v > this.max_)) {
          // submitted value is invalid, emit the current value
          this.emit_runner_value(runner);
        } else {
          // it's a valid value => update runner position
          // but no need to emit the value in this case
          // as it is a valid external change.
          runner.update_value(v);
        }
      }
    });

    if (changes['min']) {
      let v = Number(changes['min'].currentValue);
      if (Number.isNaN(v) || (v > this.get_min_of_values())) {
        // invalid change
        if ('minChange' in this) {
          this.minChange.emit(this.min_);
        }
      } else {
        // valid change, update runner position
        this.min_ = v;
        this.runners_.forEach((runner: Runner, i: number, runners: Runner[]) => {
          runner.update_min(v);
        });
      }
    }

    if (changes['max']) {
      let v = Number(changes['max'].currentValue);
      if (Number.isNaN(v) || (v < this.get_max_of_values())) {
        // invalid change
        if ('maxChange' in this) {
          this.maxChange.emit(this.max_);
        }
      } else {
        // valid change, update runner position
        this.max_ = v;
        this.runners_.forEach((runner: Runner, i: number, runners: Runner[]) => {
          runner.update_max(v);
        });
      }
    }

    if (changes['length']) {
      let v = Number(changes['length'].currentValue);
      if (Number.isNaN(v) || (v < this.get_max_of_values())) {
        // invalid change
        if ('lengthChange' in this) {
          this.maxChange.emit(this.max_);
        }
      } else {
        // valid change, update runner position
        this.rl_ = v;
        this.runners_.forEach((runner: Runner, i: number, runners: Runner[]) => {
          runner.update_rail_length(this.rl_);
        });
      }
    }
  }


  ngAfterViewInit() {
    if ('min' in this) {
      this.min_ = Number(this.min);
    }

    if ('max' in this) {
      this.max_ = Number(this.max);
    }

    if (this.max_ === this.min_) {
      this.max_ = this.min_ + 1;
    } else if (this.max_ < this.min_) {
      const tmp = this.max_;
      this.max_ = this.min_;
      this.min_ = tmp;
    }

    if ('length' in this) {
      this.rl_ = Number(this.length);
    } else {
      this.rl_ = 700;
    }
    this.rl_ = Util.clip3(this.rl_, this.min_rl_, this.max_rl_);
    this.runners_.forEach((runner: Runner, i: number, runners: Runner[]) => {
      runner.update_rail_length(this.rl_);
      runner.update_min(this.min_);
      runner.update_max(this.max_);
      this.emit_runner_value(runner);
    });
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
    this.active_runners_ = [];
    let evt_pos = this.is_vertical_ ? evt.clientY : evt.clientX;
    if (!on_button) {
      // special case when the mouse down occur on the slide zone
      // and not on the slider button:
      // all the sliders are selected and moved to that position
      let delta = this.is_vertical_ ? elm.getBoundingClientRect().top :
                                elm.getBoundingClientRect().left;
      this.runners_.forEach((runner: Runner, i: number, runners: Runner[]) => {
        runner.set_delta(delta);
        runner.update_position(evt_pos - delta);
        this.active_runners_.push(runner);
        this.emit_runner_value(runner);
      });
    } else {
      this.active_runners_.push(this.runners_[idx]);
      this.runners_[idx].init_mouse_down_evt(evt_pos);
    }
  }

  //
  // this function can only be called when button_is_down_ is true
  // as we have used a special div with *ngIf
  // <div *ngIf="button_is_down_"  (window:mousemove)="onMousemove($event)" ..
  // the release of the mouse button
  // removes the div with the (window:mousemove) events

  onMousemove(evt: any) {
    let evt_pos = this.is_vertical_ ? evt.clientY : evt.clientX;
    this.active_runners_.forEach((runner: Runner, i: number, runners: Runner[]) => {
      runner.update_mouse_move_position(evt_pos);
      this.emit_runner_value(runner);
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