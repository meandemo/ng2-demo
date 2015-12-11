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

import {bootstrap, bind, Component, Directive
       } from 'angular2/angular2';

///////////////////////////////////////////////////////////////////////////////
//
// StickyDivDemo Component  
// 
// route displayed as: http://localhost:3000/stickydivdemo 
//
///////////////////////////////////////////////////////////////////////////////

import {StickyDivCmp}          from '../stickydiv/stickydiv';


@Component({
  selector: 'sticky-div-demo',
  templateUrl: 'app/stickydivdemo/stickydivdemo.html',
  directives: [StickyDivCmp]
})
export class StickyDivDemoCmp {

  onClick() {
    let w = window.open();
    w.document.open();
    w.document.write("<h1>Hello World!</h1><p>To be removed in dist. version</p>");
    w.document.close();
  }
}