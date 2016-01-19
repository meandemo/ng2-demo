import {bootstrap}           from 'angular2/platform/browser';
import {ROUTER_PROVIDERS}    from 'angular2/router';
import {enableProdMode}      from 'angular2/core';


import {MainCmp}             from './main';
import {SliderDemoService}   from './sliderdemo/sliderdemo_service';
import {DynSliderService}    from './slider/slider_dyn_service';

import {HTTP_PROVIDERS,
        ConnectionBackend,
        Http}                from 'angular2/http';



enableProdMode();
bootstrap(MainCmp, [ROUTER_PROVIDERS, SliderDemoService, DynSliderService])
  .catch((err) => {
    console.error(err);
  }
);
