//
// header-start
//////////////////////////////////////////////////////////////////////////////////
//
// \file      src/app/main.ts
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

import {Component,
        Directive,
        View           }    from 'angular2/core';

import {RouterLink, RouterOutlet, RouteConfig, ROUTER_PROVIDERS }    from 'angular2/router';



import {bootstrap}           from 'angular2/platform/browser';
import {StickyDivDemoCmp}    from './stickydivdemo/stickydivdemo';
import {SliderDemoSimpleCmp} from './sliderdemo/sliderdemo_simple';
import {SliderDemoService}   from './sliderdemo/sliderdemo_service';
import {enableProdMode}      from 'angular2/core';

@Component({
  selector: 'gg-home',
  template: `
    <div class="w3-theme-l3">
      <div class="w3-container w3-padding">
        <h1>Angular2 Demo and Tutorial</h1>
      </div>
    </div>
    <div class="w3-text-theme">
      <div class="w3-container w3-padding">
        Two great demos are available:<br>
        <a [routerLink]="['StickyDivDemoCmp']" >Sticky Div Demo</a><br>
        <a [routerLink]="['SliderDemoSimpleCmp']" >Slider Demo</a><br>
        <br>
        <br>
      </div>
      <div class="w3-container w3-tiny">
        Page last updated 23-Dec-2015<br>
        Log log all bugs <a href="https://github.com/meandemo/ng2-demo/issues">here</a><br>
        (c) <a href="http://www.ng2goodies.com">ng2goodies</a><br>
      </div>
    </div>
   `,
   directives: [RouterLink, StickyDivDemoCmp, SliderDemoSimpleCmp]
})
class HomeCmp { }


@Component({
  selector: 'main-cmp',
    template: `<router-outlet></router-outlet>`,
    directives: [RouterOutlet]
})
@RouteConfig([
  { path: '' ,          component: HomeCmp,             name: 'HomeCmp' },
  { path: 'stickydiv' , component: StickyDivDemoCmp,    name: 'StickyDivDemoCmp' },
  { path: 'svgslider',  component: SliderDemoSimpleCmp, name: 'SliderDemoSimpleCmp' }
])
class MainCmp { }


// With angular in 2.0.0-beta
// we stay in prod mode until our code refactoring is completed
//

enableProdMode();
bootstrap(MainCmp, [ROUTER_PROVIDERS, SliderDemoService]);
