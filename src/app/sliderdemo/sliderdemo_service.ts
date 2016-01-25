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
// Slider Demo Service
//
///////////////////////////////////////////////////////////////////////////////

import {SliderDemoSimpleCmp}   from '../sliderdemo/sliderdemo_simple';
import {SliderDemoRgbCmp}      from '../sliderdemo/sliderdemo_rgb';
import {SliderDemoDynCmp}      from '../sliderdemo/sliderdemo_dyn';
import {SliderDemoGradientCmp} from '../sliderdemo/sliderdemo_gradient';
import {Slider001Cmp,
        Slider002Cmp,
        Slider003Cmp }         from '../sliderdemo/sliderdemo_rfu';

const views_ = [
    {
      component: SliderDemoSimpleCmp,
      name:      'SliderDemoSimpleCmp',
      pathName:  'simpleslider',
      linkName:  'Simple Sliders',
      linkIndex: 1
    },
    {
      component: SliderDemoRgbCmp,
      name:      'SliderDemoRgbCmp',
      pathName:  'rgbslider',
      linkName:  'Rgb Sliders',
      linkIndex: 2
    },
    {
      component: SliderDemoDynCmp,
      name:      'SliderDemoDynCmp',
      pathName:  'dynslider',
      linkName:  'Dynamic Sliders',
      linkIndex: 3
    },
    {
      component: SliderDemoGradientCmp,
      name:      'SliderDemoGradientCmp',
      pathName:  'gradientslider',
      linkName:  'Gradient with Sliders',
      linkIndex: 4
    },
    {
      component: Slider001Cmp,
      name:      'Slider001Cmp',
      pathName:  'multisliders',
      linkName:  'RFU Multiple Sliders',
      linkIndex: 5
    },
    {
      component: Slider002Cmp,
      name:      'Slider002Cmp',
      pathName:  'verticalslider',
      linkName:  'RFU Vertical Sliders',
      linkIndex: 6
    },
    {
      component: Slider003Cmp,
      name:      'Slider003Cmp',
      pathName:  'linkedslider',
      linkName:  'RFU Linked Sliders',
      linkIndex: 7
    }
  ];

export class SliderDemoService extends EventEmitter<number> {

  static get_static_routes(prefix: string): RouteDefinition[] {
    let res: RouteDefinition[] = [];

    views_.forEach((elm) => {
      res.push({path: (prefix + elm.pathName), component: elm.component, name: elm.name});
    });

    return res;
  }


  // get_link() return is an array like this
  // ['Slider000']
  // which is used by the service client
  // to navigate to a selected route: i.e:
  // this.router_.navigate(this.dashboard_.get_link(idx));

  get_link(idx: number): string[] {
    return [views_[idx].name];
  }


  // get_router_config() returns an array of RouteDefinition
  // {path: 'verticalslider', component: VerticalSliderCmp, name: 'VerticalSliderCmp'}
  // which is used by the client to initialize the routes: i.e
  // constructor(private slider_service_: SliderService,
  //             private router_: Router) {
  //   router_.config(dashboard_.get_router_config());
  //   ...
  // }
  // prefix is either '' or 'parent/'

  get_routes(prefix: string): RouteDefinition[] {
    let res: RouteDefinition[] = [];

    views_.forEach((elm) => {
      res.push({path: (prefix + elm.pathName), component: elm.component, name: elm.name});
    });

    return res;
  }

  // get_link_config() returns an array to be used in <a> directives:
  // <a [routerLink]="_elm.linkRef">{{elm.linkName}}</a>
  //
  get_link_config() {
    let res: any[] = [];

    views_.forEach((elm) => {
      res.push({linkRef: [elm.name], idx: elm.linkIndex, linkName: `${elm.linkIndex}   ${elm.linkName}`});
    });

    return res;
  }


  total_views(): number {
    return views_.length;
  }
}