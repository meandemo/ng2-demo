import {Component, Directive, ViewChild,
        AfterViewInit, Query, QueryList, ElementRef,
        OnChanges, Input, SimpleChange, Output, EventEmitter, OnInit, Inject, forwardRef,
        View} from 'angular2/core';
import {NgFor, DecimalPipe, NgIf, NgModel, FormBuilder, NgClass,
        NgControl, NgForm, Control, ControlGroup, FORM_DIRECTIVES } from  'angular2/common';
import {RouteConfig, RouteDefinition, Router, Route, RouteParams, Location, LocationStrategy,
        ROUTER_PROVIDERS, OnActivate, OnDeactivate, ComponentInstruction,
        RouterOutlet, RouterLink, APP_BASE_HREF, ROUTER_BINDINGS} from 'angular2/router';

import {AnimationBuilder} from 'angular2/src/animate/animation_builder';



///////////////////////////////////////////////////////////////////////////////
//
// Height Animation Directive
//
///////////////////////////////////////////////////////////////////////////////
//
// inspired from http://embed.plnkr.co/xkHA4HWwT9McoA4sbUnI
// The exportAs allow the parent to get a reference to instance.
// and call toggle() directly
//

@Directive({
  selector : '[gg-animate-height]',
  exportAs : 'ah',
})
export class AnimateHeightDrctv implements OnInit {
  @Input('gg-animate-height') value_: string;
  private is_visible_ = false;

  constructor(private ab_: AnimationBuilder, private e_: ElementRef) {
    this.value_ = '100px';
  }

  ngOnInit() {
    if ('gg-animate-height' in this) {
      this.value_ = this['gg-animate-height'];
    }
    // console.log("DEBUG height = ", this.value_);
  }


  toggle() {
    this.is_visible_ = !this.is_visible_;
    let animation = this.ab_.css();
    animation.setDuration(500); // Duration in ms

    if (this.is_visible_) {
      // was invisible, change to visible
      // height will change from 0 to given value
      animation
        .setFromStyles({height: '0'})
        .setToStyles({height: this.value_});
    } else {
      // If is visible we make it slide up
      animation
        .setFromStyles({height: this.value_})
        .setToStyles({height: '0'});
    }

    // Animation has been defined, it can now start
    animation.start(this.e_.nativeElement);
  }
}
