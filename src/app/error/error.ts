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
import {NgFor, DecimalPipe, NgIf, NgModel, FormBuilder, NgClass, CORE_DIRECTIVES,
        NgSwitch, NgSwitchWhen, NgSwitchDefault,
        NgControl, NgForm, Control, ControlGroup, FORM_DIRECTIVES } from  'angular2/common';
import {RouteConfig, RouteDefinition, Router, Route, RouteParams, Location, LocationStrategy,
        ROUTER_PROVIDERS, OnActivate, CanReuse, OnDeactivate, ComponentInstruction,
        RouterOutlet, RouterLink, APP_BASE_HREF, ROUTER_BINDINGS} from 'angular2/router';
import {HTTP_BINDINGS, Http} from 'angular2/http';

//import 'rxjs/add/operator/map';



///////////////////////////////////////////////////////////////////////////////
//
// A 404 Page Catcher
//
// We've added a special http request to retrieve the URL
// which has triggered the error route.
//
///////////////////////////////////////////////////////////////////////////////

import {CustomHttp} from '../http';

@Injectable()
@Component({
  selector: 'gg-error',
  template: `
  <div [ngSwitch]="error_state_">
    <div *ngSwitchWhen="'forbidden'">
      Error,<br>
      The previous request from server did not trigger a 404 response.<br>
      You're running a test or you've hit the 'back' button of your browser.<br>
    </div>
    <div *ngSwitchWhen="'reloaded'">
      Error,<br>
      You've done a reload of this page, haven't you?<br>
      Either through a manual reload or a livereload or <br>
      you've typed/pasted the /error url in the browser url bar.<br>
    </div>
    <div *ngSwitchWhen="'normal'">
      Error,<br>
      The requested url: {{error_url_}} does not exists.<br>
    </div>
    <div *ngSwitchDefault>
      Internal Error<br>
      The internal state value is incorrect (state value is {{error_state_}}).
       The requested url: {{error_url_}} does not exists.<br>
    </div>
  </div>  
  <br>
  <br>
  You can get back to the home page now!<br>
  <a [routerLink]="['HomeCmp']"><i class="fa fa-home w3-large"></i></a>
  `,
  styles: [`
  `],
  directives: [RouterLink, NgSwitch, NgSwitchWhen, NgSwitchDefault]
})

export class ErrorCmp {
  private error_url_: string;
  private error_state_ = 'forbidden';


  constructor(private http_: CustomHttp, private location_: Location) {

    let obs = http_.get_error_url();

    obs.subscribe(
      (response: any) => {
        // console.log('[TRACE obs.subscribe response = ', response);
        this.error_url_ = response.text();
        this.error_state_ = (this.error_url_ === '/error') ? 'reloaded' : 'normal';
      },
      (error: any) => {
        this.error_state_ = 'forbidden';
        // console.log('ERR =', error.text());
      }
    );
  }
}
