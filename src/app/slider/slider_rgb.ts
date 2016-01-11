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

      <svg  height="100" preserveAspectRatio="xMinYMin meet"
            xmlns="http://www.w3.org/2000/svg" viewBox="-60 -40 800 100" version="1.1" >

        <!-- reference (0,0), no fill, no stroke -->

        <rect #railref  x="0" y="0" width="1" height="1" style="fill:none;stroke:none"  />

        <!-- rail group -->

        <g id="ruler" (mousedown)="onMousedown(railref, $event, false)">
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

        <g *ngFor="#_name of runners_; #_idx = index"
            [id]="_name" 
            [attr.transform]="trans_pos_[_idx]"
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
        </g>

      </svg>
    </div>
  `,
  styles: [`
  `],
  directives: [FORM_DIRECTIVES, NgFor]
})
export class SvgSliderRgbCmp implements OnInit, AfterViewInit, OnChanges {
  @Input() min: any;
  @Output() minChange:  EventEmitter<number> = new EventEmitter<number>();

  @Input() max: any;
  @Output() maxChange:  EventEmitter<number> = new EventEmitter<number>();

  @Input() length: any;
  @Output() lengthChange:  EventEmitter<number> = new EventEmitter<number>();


  @Input('red') value0: any;
  @Output('redChange') emit_value0_: EventEmitter<number> = new EventEmitter<number>();

  @Input('green') value1: any;
  @Output('greenChange') emit_value1_: EventEmitter<number> = new EventEmitter<number>();

  @Input('blue') value2: any;
  @Output('blueChange') emit_value2_: EventEmitter<number> = new EventEmitter<number>();

  private min_: number;
  private max_: number;
  private rail_length_: number;
  private min_rail_length_: number;
  private max_rail_length_: number;

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

  private runner_style_is_circle_: boolean = true;
  private runner_style_is_label_:  boolean = false;
  private tick_marks_: number[] = [0, 50, 100, 150, 200, 255];
  constructor() {
    this.min_ = 0;
    this.max_ = 255;
    this.nb_runners_ = 3;

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

    this.rail_length_ = 700;
    this.min_rail_length_ = 10;
    this.max_rail_length_ = 4096;
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
    const str = `emit_value${idx}_`;
    if (str in this) {
      this[str].emit(this.rounded_value_[idx]);
    }
  }

  ngOnInit() {
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
      this.rail_length_ = Number(this.length);
    } else {
      this.rail_length_ = 700;
    }
    this.rail_length_ = this.clip3(this.rail_length_, this.min_rail_length_, this.max_rail_length_);
  }

  values_changed(v: number, idx: number) {
    this.value_[idx] = this.clip3(v, this.min_, this.max_);
    this.rounded_value_[idx] =   Math.round(v * 10) / 10;
    this.pos_[idx] = this.value2pos(v);
    this.trans_pos_[idx] = `translate(${this.pos_[idx]},${this.label_offset_})`;
  }

  position_changed(pos: number, idx: number) {
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
    if (this.button_is_down_) {
      return;
    }

    for (let i = 0; i < this.nb_runners_; ++i) {
      const str = `value${i}`;
      if (changes[str]) {
        let v = Number(changes[str].currentValue);
        if ((Number.isNaN(v)) || (v < this.min_) || (v > this.max_)) {
          // submitted value is invalid, emit the current value
          this.emit(i);
        } else {
          // it's a valid value => update runner position
          // but no need to emit the value in this case
          // as it is a valid external change.
          this.values_changed(v, i);
        }
      }
    }

    if (changes['min']) {
      let v = Number(changes['min'].currentValue);
      if ((Number.isNaN(v)) || (v > Math.min(...this.value_))) {
        // invalid change
        if ('minChange' in this) {
          this.minChange.emit(this.min_);
        }
      } else {
        // valid change, update runner position
        this.min_ = v;
        for (let i = 0; i < this.nb_runners_; ++i) {
          this.values_changed(this.value_[i], i);
        }
      }
    }

    if (changes['max']) {
      let v = Number(changes['max'].currentValue);
      if ((Number.isNaN(v)) || (v < Math.max(...this.value_))) {
        // invalid change
        if ('maxChange' in this) {
          this.maxChange.emit(this.max_);
        }
      } else {
        // valid change, update runner position
        this.max_ = v;
        for (let i = 0; i < this.nb_runners_; ++i) {
          this.values_changed(this.value_[i], i);
        }
      }
    }
  }


  ngAfterViewInit() {
    this.runner_style_is_circle_ = true;
    this.runner_style_is_label_ = false;
    this.label_offset_ = 0;

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
      this.rail_length_ = Number(this.length);
    } else {
      this.rail_length_ = 700;
    }
    this.rail_length_ = this.clip3(this.rail_length_, this.min_rail_length_, this.max_rail_length_);

    for (let i = 0; i < this.nb_runners_; ++i) {
      let v = (this.min_ + this.max_) / 2;
      const str = `value${i}`;
      if (str in this) {
        v = Number(this[str]);
      }
      this.values_changed(v, i);
      this.emit(i);
    }
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