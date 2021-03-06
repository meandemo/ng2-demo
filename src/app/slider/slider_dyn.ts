import {Component, Directive, ViewChild,
        AfterViewInit, Query, QueryList, ElementRef,
        OnChanges, Input, SimpleChange, Output, EventEmitter, OnInit,
        View} from 'angular2/core';
import {NgFor, DecimalPipe, NgIf, NgModel, FormBuilder, NgClass,
        CORE_DIRECTIVES,
        NgControl, NgForm, Control, ControlGroup, FORM_DIRECTIVES } from  'angular2/common';
import {RouteConfig, RouteDefinition, Router, Route, RouteParams,
        ROUTER_PROVIDERS,
        RouterOutlet, RouterLink, APP_BASE_HREF, ROUTER_BINDINGS} from 'angular2/router';

import {SliderService,
        SliderEvtData}          from '../slider/slider_service';

import {Util}                      from '../../common/util';
import {Runner,
        RunnerEvtData}             from './runner';



///////////////////////////////////////////////////////////////////////////////
//
// Slider with Dynamic number of runners
//
///////////////////////////////////////////////////////////////////////////////


@Component ({
  selector: 'gg-svg-slider-dyn',
  template: `
    <div id="slider" style="margin:0px">

      <!-- special div which disables mousemove and mouseup event -->
      <div *ngIf="button_is_down_" style="position:relative"
           (window:mousemove)="onMousemove($event)"
           (window:mouseup)="onMouseup($event)" >
      </div>

      <svg [attr.height]="is_special_  ? 80 : 120" preserveAspectRatio="xMinYMin meet"
             xmlns="http://www.w3.org/2000/svg"
             [attr.viewBox]="(is_special_ ? -40 : -60) + ' -40 ' + (rl_ + 80) + ' ' + (is_special_ ? 80: 120)" version="1.1" >

        <!-- reference (0,0), no fill, no stroke -->

        <rect #railref  x="0" y="0" width="1" height="1" style="fill:none;stroke:none"  />

        <!-- rail group -->

        <g *ngIf="!hide_rail_" >
          <g id="rail" (mousedown)="onMousedown(railref, $event, false)">
            <path *ngIf="is_special_"  [attr.d]="'M 0,-5 v 6  h' + (rl_) + ' v -6 z'" style="fill:white" />
            <path *ngIf="!is_special_" [attr.d]="'M 0,-5 v 10 h' + (rl_) + ' v -10 z'" style="stroke-width:2px;stroke:black;fill:violet" />
          </g>

          <!-- tick marks -->
          <g *ngIf="!is_special_" *ngFor="#_val of tick_marks_">
            <path [attr.d]="'M' + get_pos(_val) + ',5 v 30'" style="stroke-width:2px;stroke:black" />
            <text [attr.x]="get_pos(_val)" y=50 text-anchor="middle" font-size="20">{{_val}}</text>
          </g>
        </g>

        <!-- runners group -->
        <g *ngIf="!hide_runners_">
          <g *ngFor="#_runner of runners_; #_idx = index"
              [id]="_runner.get_id()"
              [attr.transform]="'translate(' + _runner.get_pos() + ', 0)'">
            <g class="runner"
              (mousedown)="onMousedown(railref, $event, true, _idx)" >
              <path *ngIf="!is_special_" id="panel" d="M 0 0 L 10 -10 L 30 -10 L 30 -35 L -30 -35 L -30 -10 L -10 -10 z"
                    style="color:black;fill:black" />
              <text *ngIf="!is_special_" id="text" x="0" y="-17" text-anchor="middle"
                  font-family="Verdana" font-size="10" fill="white">{{_runner.get_id()}}
              </text>
              <path *ngIf="is_special_" id="panel" d="M 0 0 L 10  10 L 20  10 L 20  35 L -20  35 L -20  10 L -10  10 z"
                    style="color:black;fill:black;stroke:white;stroke-width:1px" />

              <g *ngIf="is_special_" (click)="onMouseclick(railref, $event, _runner)">
                <rect x="10" y="25" width="9" height="9" style="fill:white"  />
                <path d="M 12 27 L 18 33"
                    style="stroke:black;stroke-width:1px" />
                <path d="M 18 27 L 12 33"
                    style="stroke:black;stroke-width:1px" />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  `,
  styles: [`
  `],
  directives: [CORE_DIRECTIVES]
})
export class SvgSliderDynCmp implements OnInit, AfterViewInit, OnChanges {
  static cnt_ = 0;
  @Input() min: any;
  @Output() minChange:  EventEmitter<number> = new EventEmitter<number>();

  @Input() max: any;
  @Output() maxChange:  EventEmitter<number> = new EventEmitter<number>();

  @Input() length: any;
  @Output() lengthChange:  EventEmitter<number> = new EventEmitter<number>();

  @Input() vertical: boolean;
  @Input() special: boolean;
  @Input() hiderail: boolean;
  @Input() hiderunners: boolean;

  //@Input('values') values_: any;
  @Output('values') emit_values_: EventEmitter<RunnerEvtData[]> = new EventEmitter<RunnerEvtData[]>(false);

  private min_: number;
  private max_: number;
  private rl_: number;          // rail length
  private min_rl_: number;
  private max_rl_: number;

  private runners_: Runner[] = [];
  private active_runners_: Runner[];
  private nb_runners_: number;
  private is_vertical_: boolean = false;
  private is_special_: boolean = false;
  private hide_rail_: boolean = false;
  private hide_runners_: boolean = false;

  private button_is_down_: boolean = false;

  private tick_marks_: number[] = [0, 20, 40, 60, 80, 100];
  private nb_ticks_: number = 6;


  constructor(private slider_service_: SliderService) {
    this.min_ = 0;
    this.max_ = 100;
    this.nb_runners_ = 3;
    this.rl_ = 700;
    this.min_rl_ = 10;
    this.max_rl_ = 4096;


    let initial_values = Util.create_values(this.nb_runners_, this.min_, this.max_);

    initial_values.forEach((val: number, i: number) => {
      let runner = new Runner(val, this.min_, this.max_, this.rl_);
      this.runners_.push(runner);
    });

    // console.log("[TRACE] constructor value = ", this.value_);
    // console.log("[TRACE] pos   = ", this.pos_);
    // console.log("[TRACE] trans = ", this.trans_pos_);

    slider_service_.subscribe({
      next: (data: SliderEvtData) => {
        if (data.add) {
          // console.log('[TRACE] Receive add slider request');
          let runner = new Runner(0, this.min_, this.max_, this.rl_);
          this.runners_.push(runner);
          runner.update_value(data.val);
          this.emit_full();
        } else if (data.del) {
          // console.log('[TRACE] Receive remove slider request:', data.runner);
          let idx: number;
          idx = this.runners_.findIndex((runner: Runner) => {
            return (runner === data.runner);
          });
          this.runners_.splice(idx, 1);
          this.emit_full();
        } else {
          // console.log('[TRACE] Receive update slider request:', data.idx, ' with value ', data.val);
          data.runner.update_value(data.val);
        }
      }
    });
  }


  // given value between min and max
  // converted into a pixel position between 0 and rail length

  get_pos(v: number) {
    const pos = (this.rl_ * (v - this.min_)) / (this.max_ - this.min_);
    return Util.clip3(pos, 0, this.rl_);
  }

  emit_full() {
    const str = `emit_values_`;
    if (str in this) {
      let datas: RunnerEvtData[] = [];
      this.runners_.forEach((runner: Runner, i: number, runners: Runner[]) => {
        let data = <RunnerEvtData>{};
        data['runner'] = runner;
        data['id']  = runner.get_id();
        data['value'] = runner.get_value(true);
        datas.push(data);
      });
      // console.log('[TRACE] Dyn emit* ', datas);
      this[str].emit(datas);
    }
  }

  ngOnChanges(changes: {[propName: string]: SimpleChange}) {
    if (this.button_is_down_) {
      return;
    }

    if (changes['hiderail']) {
      let v = changes['hiderail'].currentValue;
      this.hide_rail_ = (v === true);
    }

    if (changes['hiderunners']) {
      let v = changes['hiderunners'].currentValue;
      this.hide_runners_ = (v === true);
    }
  }


  ngOnInit() {
    /*
    if ('length' in this) {
      this.rl_ = Util.clip3(Number(this.length), this.min_rl_, this.max_rl_);
      this.runners_.forEach((runner: Runner, i: number, runners: Runner[]) => {
        runner.update_rail_length(this.rl_);
      });
    }
    this.emit_full();
    */
  }

  ngAfterViewInit() {
    if ('min' in this) {
      this.min_ = Number(this.min);
    }

    if ('max' in this) {
      this.max_ = Number(this.max);
    }

    if ('special' in this) {
      // console.log("[TRACE] RGB ngAfterViewInit() special is true");
      this.is_special_ = true;
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
    }
    this.rl_ = Util.clip3(this.rl_, this.min_rl_, this.max_rl_);

    const initial_values = Util.create_values(this.nb_runners_, this.min_, this.max_);
    this.runners_.forEach((runner: Runner, i: number, runners: Runner[]) => {
      runner.update_rail_length(this.rl_);
      runner.update_min(this.min_);
      runner.update_max(this.max_);
      runner.update_value(initial_values[i]);
    });
    this.emit_full();
    this.tick_marks_ = Util.create_ticks(this.nb_ticks_, this.min_, this.max_);
  }


  onMouseclick(elm: any, evt: any, drunner: Runner) {
    let idx = this.runners_.findIndex((runner: Runner) => {
            return (runner === drunner);
    });
    this.runners_.splice(idx, 1);
    this.emit_full();
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
    if (!on_button) {
      // special case when the mouse down occur on the slide zone
      // and not on the slider button:
      // we add a slider here
      let runner = new Runner(0, this.min_, this.max_, this.rl_);
      let delta = elm.getBoundingClientRect().left;
      runner.set_delta(delta);
      runner.update_position(evt.clientX - delta);
      this.runners_.push(runner);
      this.emit_full();
      this.active_runners_.push(runner);
    } else {
      this.active_runners_.push(this.runners_[idx]);
      this.runners_[idx].init_mouse_down_evt(evt.clientX);
    }
  }

  //
  // this function can only be called when button_is_down_ is true
  // as we have used a special div with *ngIf
  // <div *ngIf="button_is_down_"  (window:mousemove)="onMousemove($event)" ..
  // the release of the mouse button
  // removes the div with the (window:mousemove) events

  onMousemove(evt: any) {
    this.active_runners_.forEach((runner: Runner, i: number, runners: Runner[]) => {
      runner.update_mouse_move_position(evt.clientX);
    });
    this.emit_full();
  }

  //
  // the release of the mouse button
  // removes the div with the (window:mousemove) events
  //

  onMouseup(evt: any) {
    this.button_is_down_ = false;
  }
}
