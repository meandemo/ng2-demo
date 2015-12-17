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

import {bootstrap}           from 'angular2/platform/browser';
import {StickyDivDemoCmp}   from './stickydivdemo/stickydivdemo';


@Component({
  selector: 'main-cmp'
})
@View({
  template: `
    <gg-sticky-div-demo></gg-sticky-div-demo>
    `,
  directives: [StickyDivDemoCmp]
})
class MainCmp { }

bootstrap(MainCmp, []);
