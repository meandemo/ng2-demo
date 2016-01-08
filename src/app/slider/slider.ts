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
// Slider components are here
//
///////////////////////////////////////////////////////////////////////////////



// SVG Slider

@Component ({
  selector: 'gg-svg-slider',
  template: `
    <div  id="slider" style="margin:5px">

      <!-- special div which disable mousemove and mouseup event -->

      <div *ngIf="button_is_down_" style="position:relative"
           (window:mousemove)="onMousemove($event)"
           (window:mouseup)="onMouseup($event)" >
      </div>
      <svg  height="90" preserveAspectRatio="xMinYMin meet"
            xmlns="http://www.w3.org/2000/svg" viewBox="-60 -50 350 90" version="1.1" >

        <!-- reference (0,0), no fill, no stroke -->

        <rect #railref  x="0" y="0" width="1" height="1" style="fill:none;stroke:none"  />

        <!-- rail group -->

        <g id="rail" (mousedown)="onMousedown(railref, $event, false)">
          <rect id="default-rail" x="0" y="-10" [attr.width]="rail_length_" height="20" />
          <!--
          <rect id="default-rail" x="0" y="-10" width="180" height="20" />
          <path id="default-rail" d="M 0 -10 v 20 h 180 v -20 z" />
          -->
        </g>

        <!-- runner group -->

        <g  id="runner" [attr.transform]="trans_pos_"
                        (mousedown)="onMousedown(railref, $event, true)" >

          <g *ngIf="runner_style_is_circle_" id="circle">
            <circle cx="0" cy="0" r="20" />
          </g>

          <g  *ngIf="runner_style_is_label_" id="label">
            <path id="panel" d="M 0 0 L 10 -10 L 30 -10 L 30 -35 L -30 -35 L -30 -10 L -10 -10 z"
                style="color:black;fill:black" />
            <text id="text" x="-17" y="-17" font-family="Verdana" font-size="15" fill="white">{{ value_ | number:'1.1-1' }}</text>
          </g>
        </g>
      </svg>
    </div>
  `,
  directives: [FORM_DIRECTIVES]
})
export class SvgSliderCmp implements OnInit, AfterViewInit, OnChanges {
  @Input() min: any;
  @Output() minChange:  EventEmitter<number> = new EventEmitter<number>();

  @Input() max: any;
  @Output() maxChange:  EventEmitter<number> = new EventEmitter<number>();

  @Input() length: any;
  @Output() lengthChange:  EventEmitter<number> = new EventEmitter<number>();

  @Input() shape: any;

  @Input('value') value: any;
  @Output('valueChange') emit_value_: EventEmitter<number> = new EventEmitter<number>();

  private min_: number;
  private max_: number;
  private value_: number;
  private rounded_value_: number;
  private rail_length_: number;
  private min_rail_length_: number;
  private max_rail_length_: number;

  private pos_: number;

  private delta_: number;
  private base_: number;
  private button_is_down_: boolean = false;

  private trans_pos_: string;
  private label_offset_: number = 0;

  private runner_style_is_circle_: boolean = true;
  private runner_style_is_label_:  boolean = false;

  constructor() {
    this.min_ = 0;
    this.max_ = 100;
    this.value_ = 50;
    this.rail_length_ = 180;
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


  emit() {
    if ('emit_value_' in this) {
      this.emit_value_.emit(this.rounded_value_);
    }
  }

  ngOnInit() {
    // not much is done here
  }

  values_changed(v: number) {
    this.value_ = this.clip3(v, this.min_, this.max_);
    this.rounded_value_ =   Math.round(v * 10) / 10;
    this.pos_ = this.value2pos(v);
    this.trans_pos_ = `translate(${this.pos_},${this.label_offset_})`;
  }

  position_changed(pos: number) {
    this.pos_ = this.clip3(pos, 0, this.rail_length_);
    this.trans_pos_ = `translate(${this.pos_},${this.label_offset_})`;
    this.value_ = this.pos2value(this.pos_);
    this.rounded_value_ = Math.round(this.value_ * 10) / 10;
    this.emit();
  }

  //
  // detecting changes and emit value
  // value, min, max, shape type
  // when the button is down, the changes
  // to the runner position are emitted with mousemove

  ngOnChanges(changes: {[propName: string]: SimpleChange}) {
    if (this.button_is_down_) {
      return;
    }

    if (changes['value']) {
      let v = Number(changes['value'].currentValue);
      if ((Number.isNaN(v)) || (v < this.min_) || (v > this.max_)) {
        // submitted value is invalid, emit the current value
        this.emit();
      } else {
        // it's a valid value => update runner position
        // but no need to emit the value in this case
        // as it is a valid external change.
        this.values_changed(v);
      }

    } else if (changes['min']) {
      let v = Number(changes['min'].currentValue);
      if ((Number.isNaN(v)) || (v > this.value_)) {
        // invalid change
        if ('minChange' in this) {
          this.minChange.emit(this.min_);
        }
      } else {
        // valid change, update runner position
        this.min_ = v;
        this.values_changed(this.value_);
      }


    } else if (changes['max']) {
      let v = Number(changes['max'].currentValue);
      if ((Number.isNaN(v)) || (v < this.value_)) {
        // invalid change
        if ('maxChange' in this) {
          this.maxChange.emit(this.max_);
        }
      } else {
        // valid change, update runner position
        this.max_ = v;
        this.values_changed(this.value_);
      }

    } else if (changes['shape']) {
      if (changes['shape'].currentValue === 'label') {
        this.runner_style_is_circle_ = false;
        this.runner_style_is_label_ = true;
        this.label_offset_ = -10;
      } else {
        this.runner_style_is_circle_ = true;
        this.runner_style_is_label_ = false;
        this.label_offset_ = 0;
      }
      this.trans_pos_ = `translate(${this.pos_},${this.label_offset_})`;

    } else if (changes['length']) {
      let v = Number(changes['length'].currentValue);
      if ((Number.isNaN(v)) || (v < this.min_rail_length_)
                            || (v > this.max_rail_length_)) {
        // invalid change
        if ('lengthChange' in this) {
          this.lengthChange.emit(this.rail_length_);
        }
      } else {
        // valid change, update runner position
        this.rail_length_ = v;
        this.values_changed(this.value_);
      }
    }
  }


  ngAfterViewInit() {
    if ('shape' in this) {
      if (this.shape === 'label') {
        this.runner_style_is_circle_ = false;
        this.runner_style_is_label_ = true;
        this.label_offset_ = -10;
      } else {
        this.runner_style_is_circle_ = true;
        this.runner_style_is_label_ = false;
        this.label_offset_ = 0;
      }
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
      this.rail_length_ = Number(this.length);
    } else {
      this.rail_length_ = 250;
    }
    this.rail_length_ = this.clip3(this.rail_length_, this.min_rail_length_, this.max_rail_length_);


    let v = (this.min_ + this.max_) / 2;
    if ('value' in this) {
      v = Number(this.value);
    }

    this.values_changed(v);
    this.emit();

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

  onMousedown(elm: any, evt: any, on_button: boolean) {
    evt.preventDefault();
    this.button_is_down_ = true;
    this.delta_ = evt.clientX - this.pos_;
    if (!on_button) {
      // special case when the mouse down occur on the slide zone
      // and not on the slider button
      this.delta_ = elm.getBoundingClientRect().left;
      const pos = evt.clientX - this.delta_;
      this.position_changed(pos);
    }
  }

  //
  // this function can only be called when button_is_down_ is true
  // as we have used a special div with *ngIf
  // <div *ngIf="button_is_down_"  (window:mousemove)="onMousemove($event)" ..
  //
  onMousemove(evt: any) {
    const pos = evt.clientX - this.delta_;
    this.position_changed(pos);
  }

  //
  // the release of the mouse button
  // removes the div with the (window:mousemove) events
  //

  onMouseup(evt: any) {
    this.button_is_down_ = false;
  }
}