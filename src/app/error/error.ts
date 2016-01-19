//
// header-start
//////////////////////////////////////////////////////////////////////////////////
//
// \file      src/app/error/error.ts
//
// \brief     This file belongs to the ng2 tutorial project
//
// \author    Bernard
//
// \copyright Copyright ng2goodies 2016
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
        Injectable,
        OnChanges, Input, SimpleChange, Output, EventEmitter, OnInit, Inject, forwardRef,
        View} from 'angular2/core';
import {NgFor, DecimalPipe, NgIf, NgModel, FormBuilder, NgClass,
        NgControl, NgForm, Control, ControlGroup, FORM_DIRECTIVES } from  'angular2/common';
import {RouteConfig, RouteDefinition, Router, Route, RouteParams, Location, LocationStrategy,
        ROUTER_PROVIDERS, OnActivate, CanReuse, OnDeactivate, ComponentInstruction,
        RouterOutlet, RouterLink, APP_BASE_HREF, ROUTER_BINDINGS} from 'angular2/router';
import {HTTP_BINDINGS, HTTP_PROVIDERS, Http} from 'angular2/http';



///////////////////////////////////////////////////////////////////////////////
//
// A 404 Page Catcher
//
// We've added a special http request to retrieve the URL
// which has triggered the error route.
//
///////////////////////////////////////////////////////////////////////////////


@Component({
  selector: 'gg-error',
  bindings: [HTTP_BINDINGS],
  template: `
  <div *ngIf="is_error_">
    Error,<br>
    The requested url: {{error_url_}} does not exists.<br>
  </div>
  <div *ngIf="!is_error_">
    This is the site error page.<br>
    You've done a reload of this page, haven't you?<br>
    Or you've typed/pasted the url in the browser url bar.<br>
  </div>
  You can get back to the home page now!<br>
  <a [routerLink]="['HomeCmp']"><i class="fa fa-home w3-large"></i></a>
  `,
  styles: [`
  `],
  directives: [RouterLink, NgIf]
})
export class ErrorCmp {
  private error_url_: string;
  private is_error_ = false;

  constructor(private http_: Http) {
    http_.get('api/public/v1/errorurl').subscribe(
      (response: any) => {
        this.error_url_ = response.text();
        this.is_error_ = (this.error_url_ !== '/error');
      },
      (error: any) => {
        this.is_error_ = false;
        console.log('ERR =', error.text());
      }
    );
  }


/*
  ngOnInit() {
    console.log('OnInit:     http is', this.http_);
    console.log('OnInit:     router state', this.location_);
    this.http_.get('').subscribe(
      () => { console.log('On Next'); },
      () => { console.log('On Error'); },
      () => { console.log('On Completed'); }
    );
  }
*/

/*
  routerCanReuse(next: ComponentInstruction, prev: ComponentInstruction) {
    console.log('OnReuse:    http is', this.http_);
    console.log('OnReuse:    navigating from ', prev);
    console.log('OnReuse:    navigating to ', next);
    console.log('OnReuse:    router state', this.location_);

    return  true;
  }
*/

/*
  routerOnActivate(next: ComponentInstruction, prev: ComponentInstruction) {
    console.log('Activate:   navigating from ', prev);
    console.log('            navigating to ', next);
    console.log('            router state', this.location_);
    //console.log('            router url() ', this.location_.normalize());
    console.log('1            http ', this.http_);
    //console.log('2            http ', this.http_.BaseRequestOptions);
    //console.log('3            http ', this.http_.XHRBackend);
    //console.log('4            http ', this.http_.headers);
    console.log('5            http ', this.http_.get(''));
    if (prev === null) {
      //console.log('[DEBUG] Navigating to ', next);
      //console.log('[DEBUG] Location is ', this.location_);
      //console.log('[DEBUG] Hum! navigation to ', window.location.pathname, ' without navigate() or routerLink');
      // need to notify the side navigation panel that we are on page 1
    }
  }
*/
}
