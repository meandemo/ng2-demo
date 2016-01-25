import {bootstrap}        from 'angular2/platform/browser';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {FormBuilder}      from 'angular2/common';
import {enableProdMode,
        Injectable,
        provide}          from 'angular2/core';



import {HTTP_PROVIDERS,
        Http,
        ConnectionBackend,
        RequestOptions,
        Request,
        RequestOptionsArgs,
        RequestMethod, }  from 'angular2/http';


import {CustomHttp} from './http';
import {MainCmp} from './main';
//import {NavBarService, MainRouteService} from './main_services';
import {SliderDemoService}               from './sliderdemo/sliderdemo_service';
import {SliderService}                   from './slider/slider_service';



enableProdMode();
bootstrap(MainCmp, [ROUTER_PROVIDERS, FormBuilder,
                    HTTP_PROVIDERS,
                    provide(CustomHttp, {
                      useFactory: (http: Http) => {
                        return new CustomHttp(http); },
                      deps: [Http]}),
//                    NavBarService, MainRouteService,
                    SliderDemoService, SliderService])
  .catch((err) => {
    console.error(err);
  });
