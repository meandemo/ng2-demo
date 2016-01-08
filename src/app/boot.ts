import {bootstrap}           from 'angular2/platform/browser';
import {ROUTER_PROVIDERS}    from 'angular2/router';
import {enableProdMode}      from 'angular2/core';


import {MainCmp}             from './main';
import {SliderDemoService}   from './sliderdemo/sliderdemo_service';


enableProdMode();
bootstrap(MainCmp, [ROUTER_PROVIDERS, SliderDemoService])
  .catch((err) => {
    console.error(err);
  }
);
