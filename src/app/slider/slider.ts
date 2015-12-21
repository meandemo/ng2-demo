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
    <div #topslider id="slider" style="margin:5px"> <!-- style="position:relative;width:220px;height:40px" > -->
      <div *ngIf="button_is_down_" style="position:relative"
           (window:mousemove)="onMousemove($event)"
           (window:mouseup)="onMouseup($event)" >
      </div>
      <svg  height="50" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg" viewBox="-25 -25 230 50" version="1.1" >
        <path id="rail" (mousedown)="onMousedown(topslider, $event, false)"
              d="M 0 -10 v 20 h 180 v -20 z" />
        <circle  id="runner" (mousedown)="onMousedown(topslider, $event, true)"
                class="drag sizer" [attr.cx]="pos_" cy="0" r="20" />
      </svg>
    </div>
  `,
  directives: [FORM_DIRECTIVES]
})
export class SvgSliderCmp implements OnInit, AfterViewInit, OnChanges {
  @Input() min: any;
  @Input() max: any;
  @Input() initial: any;
  @Input() width: any;

  @Input('runner') value: any;
  @Output('runnerChange') emit_value_: EventEmitter<number> = new EventEmitter<number>();

  private max_: number;
  private value_: number;
  private width_: number;
  private pos_: number;

  private delta_: number;
  private base_: number;
  private button_is_down_: boolean = false;


  constructor() {
    //this.min_ = 0;
    this.max_ = 100;
    //this.value = this.value_;
    this.width_ = 180;
  }

  clip3(v: number, min: number, max: number): number {
    v = Number.isNaN(v) ? 0 : v;
    if (v < min) { return min; }
    if (v > max) { return max; }
    return v;
  }

  value2pos(v: number) {
    const pos = (this.width_ * (v - this.min)) / (this.max_ - this.min);
    return this.clip3(pos, 0, this.width_);
  }

  pos2value(p: number) {
    const v =  this.min + (p * (this.max_ - this.min) / this.width_);
    return this.clip3(v, this.min, this.max_);
  }

  ngOnInit() {
    // not much is done here
  }

  ngOnChanges(changes: {[propName: string]: SimpleChange}) {
    console.log('[DEBUG] slider ngOnChanges, changeNotifier = ', changes);
    if ('value' in this && changes && !this.button_is_down_) {
      let value = Number(changes['value'].currentValue);
      console.log('[DEBUG] slider ngOnChanges, changeNotifier = ', value);
      this.value_ = this.clip3(value, this.min, this.max_);
      this.pos_ = this.value2pos(this.value_);
      this.emit_value_.emit(this.value_);
    }
  }

  ngAfterViewInit() {
    if ('min' in this) {
      this.min = 0 + this.min;
    } else {
      this.min = 0;
    }
    if ('max' in this) {
      this.max_ = 0 + this.max;
    }
    if (this.max_ === this.min) {
      this.max_ = this.min + 1;
    } else if (this.max_ < this.min) {
      const tmp = this.max_;
      this.max_ = this.min;
      this.min = tmp;
    }

    if ('initial' in this) {
      this.value_ = 0 + this.initial;
    } else {
      this.value_ = this.min;
    }

    //if ('value' in this) {
    //  this.value_ = 0 + this.value;
    //}
    this.value_ = this.clip3(this.value_, this.min, this.max_);
    //this.value = this.value_;
    this.pos_ = this.value2pos(this.value_);
    this.emit_value_.emit(this.value_);


    if ('width' in this) {
      this.width_ = 0 + this.width;
    }

    this.width = (this.width_ < 10) ? 10 : this.width_;

  }

  //                    initial            final
  //
  //  |---------->            (= base_  given by elm.getBoundingClientRect().left)
  //             @       +====+            +====+
  //             +-------|    |------------|    |---+
  //             +-------|  x |------------|  x |---+
  //                     +====+            +====+
  //             |----- >     (= npos_)
  //                     <--> (= delta_)
  //  [1]------------------ > (= evt.clientX)
  //  [2]------------------------------------ > (= evt.clientX)
  //
  //  On initial mouse down, we can compute delta as we have:
  //  evt.clientX = base_ + npos_ + delta_   [1]
  //
  //  On mouse up, we can compute npos_ given by
  //  evt.clientX = base_ + npos_ + delta_   [1]

  // Note the preventDefault to ensure that the future mouse events
  // are not propagated to other elements

  onMousedown(elm: any, evt: any, on_button: boolean) {
    this.base_ = elm.getBoundingClientRect().left;
    evt.preventDefault();
    this.button_is_down_ = true;
    this.delta_ = evt.clientX - (this.base_ + this.pos_);
    if (!on_button) {
      // special case when the mouse down occur on the slide zone
      // and not on the slider button
      this.delta_ = 20;
      const pos = evt.clientX - (this.base_ + this.delta_);
      this.pos_ = this.clip3(pos, 0, this.width_);

      this.value_ = this.pos2value(this.pos_);
      this.emit_value_.emit(this.value_);
      //this.value = this.value_;
    }
  }

  //
  // this function can only be called when button_is_down_ is true
  // has we have used a special div with *ngIf
  // <div *ngIf="button_is_down_"  (window:mousemove)="onMousemove($event)" ..
  //
  onMousemove(evt: any) {
    //console.log("DEBUG: mouse move event ", evt.clientX);
    //this.mouse_x = evt.clientX;
    const pos = evt.clientX - (this.base_ + this.delta_);
    this.pos_ = this.clip3(pos, 0, this.width_);
    this.value_ = this.pos2value(this.pos_);
    this.emit_value_.emit(this.value_);
    //this.value = this.value_;
  }

  //
  // same as onMousemouse()
  // the release of the mouse button removes the div with the (window:mousemove) events
  //

  onMouseup(evt: any) {
    this.button_is_down_ = false;
  //  const pos = evt.clientX - (this.base_ + this.delta_);
  //  this.pos_ = this.clip3(pos, 0, this.width_);
  //  this.value_ = this.pos2value(this.pos_);
    //this.value = this.value_;
  }
}