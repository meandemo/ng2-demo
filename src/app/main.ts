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


import {StickyDivDemoCmp}    from './stickydivdemo/stickydivdemo';
import {SliderDemoSimpleCmp} from './sliderdemo/sliderdemo_simple';
import {SliderDemoRgbCmp}    from './sliderdemo/sliderdemo_rgb';
import {SliderDemoService}   from './sliderdemo/sliderdemo_service';
import {assertionsEnabled}   from 'angular2/src/facade/lang';

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
        Three great demos are available:<br>
        <a [routerLink]="['StickyDivDemoCmp']" >Sticky Div</a><br>
        <a [routerLink]="['SliderDemoSimpleCmp']" >SVG Based Slider</a><br>
        <a [routerLink]="['SliderDemoRgbCmp']" >SVG Based Color Selector with full form control</a><br>
        <br>
        <br>
      </div>
      <div class="w3-container w3-tiny">
        Using angular2 version {{ng2version_}} in {{mode_str_}}<br>
        Page last updated 12-Jan-2016<br>
        Log log all bugs <a href="https://github.com/meandemo/ng2-demo/issues">here</a><br>
        (c) <a href="http://www.ng2goodies.com">ng2goodies</a><br>
      </div>
    </div>
   `,
   directives: [RouterLink, StickyDivDemoCmp, SliderDemoSimpleCmp]
})
class HomeCmp {
  private mode_str_: string = 'production mode';
  private is_in_prod_mode_: boolean = true;
  private ng2version_: string = '2.0.0-beta.1';

  constructor() {
    if (assertionsEnabled()) {
      this.mode_str_ = 'development mode';
      this.is_in_prod_mode_ = false;
    }
  }
}



@Component({
  selector: 'gg-main',
    template: `<router-outlet></router-outlet>`,
    directives: [RouterOutlet]
})
@RouteConfig([
  { path: '' ,          component: HomeCmp,             name: 'HomeCmp' },
  { path: 'stickydiv' , component: StickyDivDemoCmp,    name: 'StickyDivDemoCmp' },
  { path: 'svgslider',  component: SliderDemoSimpleCmp, name: 'SliderDemoSimpleCmp' },
  { path: 'rgbslider',  component: SliderDemoRgbCmp,    name: 'SliderDemoRgbCmp' }
])
export class MainCmp {
}
