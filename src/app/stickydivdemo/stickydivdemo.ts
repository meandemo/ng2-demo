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
