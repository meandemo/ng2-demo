//
// header-start
//////////////////////////////////////////////////////////////////////////////////
//
// \file      src/app/stickydivdemo/stickydivdemo.ts
//
// \brief     This file belongs to the ng2 tutorial project
//
// \author    Bernard
//
// \copyright Copyright ng2goodies 2015
//            Distributed under the MIT License
//            See http://opensource.org/licenses/MIT
//
//////////////////////////////////////////////////////////////////////////////////
// header-log
//
// $Author$
// $Date$
// $Revision$
//
//////////////////////////////////////////////////////////////////////////////////
// header-end
//
import {Component, Directive, ViewChild,
        AfterViewInit, Query, QueryList, ElementRef,
        OnChanges, Input, SimpleChange, Output, EventEmitter, OnInit,
        View} from 'angular2/core';
import {NgFor, NgIf, NgModel } from  'angular2/common';
import {RouteConfig, RouteDefinition, Router, Route, RouteParams,
        ROUTER_PROVIDERS,
        RouterOutlet, RouterLink, APP_BASE_HREF, ROUTER_BINDINGS} from 'angular2/router';

///////////////////////////////////////////////////////////////////////////////
//
// StickyDivDemo Component
//
// route displayed as: http://localhost:3000/stickydivdemo
//
///////////////////////////////////////////////////////////////////////////////

import {StickyDivCmp}          from '../stickydiv/stickydiv';


@Component({
  selector: 'gg-sticky-div-demo',
  templateUrl: 'app/stickydivdemo/stickydivdemo.html',
  directives: [StickyDivCmp, RouterLink]
})
export class StickyDivDemoCmp {
}
/*
  private height_section_b_: number = 40;

  ngOnInit() {
    this.elm_hdr1_ = document.getElementById('inst1');
    //this.elm_hdr1_height_ += this.elm_hdr1_.getBoundingClientRect().height + ':ngOnInit ';
    this.inst1_height_ = this.elm_hdr1_.getBoundingClientRect().height; // + ':ngOnInit ';
  }

  ngAfterViewChecked() {
    if (!this.checked_) {
      this.elm_hdr1_ = document.getElementById('inst1');
      this.inst1_height_ = this.elm_hdr1_.getBoundingClientRect().height; // + ':ngAfterViewChecked ';
      this.checked_ = true;
    }
  }

  ngAfterViewInit() {
    this.elm_hdr1_ = document.getElementById('inst1');
    this.inst1_height_ = this.elm_hdr1_.getBoundingClientRect().height; // + ':ngAfterViewInit ';
  }
}

*/