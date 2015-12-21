//
// header-start
//////////////////////////////////////////////////////////////////////////////////
//
// \file      src/app/lipsum/lipsum.ts
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
import {Component, Directive, ViewChild,
        AfterViewInit, Query, QueryList, ElementRef,
        OnChanges, Input, SimpleChange, Output, EventEmitter, OnInit,
        View} from 'angular2/core';
import {NgFor, NgIf, NgModel } from  'angular2/common';
import {RouteConfig, RouteDefinition, Router, Route, RouteParams,
        ROUTER_PROVIDERS,
        RouterOutlet, RouterLink, APP_BASE_HREF, ROUTER_BINDINGS} from 'angular2/router';

///////////////////////////////////////////////////////////////////////////////
//
// A configurable lipsum generator 
//
///////////////////////////////////////////////////////////////////////////////


@Component({
  selector: 'gg-lipsum',
  template: `
  <!-- from www.cpisum.com -->
  <h3>Monotonectally Communication Principles</h3>
  <p>
  Collaboratively administrate empowered markets via plug-and-play networks.
  Dynamically procrastinate B2C users after installed base benefits.
  Dramatically visualize customer directed convergence without revolutionary ROI.
  </p>
  <p>
  Efficiently unleash cross-media information without cross-media value.
  Quickly maximize timely deliverables for real-time schemas.
  Dramatically maintain clicks-and-mortar solutions without functional solutions.
  </p>
  <p>
  Completely synergize resource taxing relationships via premier niche markets.
  Professionally cultivate one-to-one customer service with robust ideas.
  Dynamically innovate resource-leveling customer service for state of the art customer service.
  </p>
  <h3>Transform Extensible Partnerships</h3>
  <p>
  Objectively innovate empowered manufactured products whereas parallel platforms.
  Holisticly predominate extensible testing procedures for reliable supply chains.
  Dramatically engage top-line web services vis-a-vis cutting-edge deliverables.
  </p>
  <p>
  Proactively envisioned multimedia based expertise and cross-media growth strategies.
  Seamlessly visualize quality intellectual capital without superior collaboration and idea-sharing.
  Holistically pontificate installed base portals after maintainable products.
  </p>
  <p>
  Phosfluorescently engage worldwide methodologies with web-enabled technology.
  Interactively coordinate proactive e-commerce via process-centric "outside the box" thinking.
  Completely pursue scalable customer service through sustainable potentialities.
  </p>
  <h3>Engineer Tracking of Infomediaries</h3>
  <p>
  Collaboratively administrate turnkey channels whereas virtual e-tailers.
  Objectively seize scalable metrics whereas proactive e-services.
  Seamlessly empower fully researched growth strategies and interoperable internal or "organic" sources.
  </p>
  <p>
  Credibly innovate granular internal or "organic" sources whereas high standards in web-readiness.
  Energistically scale future-proof core competencies vis-a-vis impactful experiences.
  Dramatically synthesize integrated schemas with optimal networks.
  </p>
  <p>
  Interactively procrastinate high-payoff content without backward-compatible data.
  Quickly cultivate optimal processes and tactical architectures.
  Completely iterate covalent strategic theme areas via accurate e-markets.
  </p>
  <p>
  Globally incubate standards compliant channels before scalable benefits.
  Quickly disseminate superior deliverables whereas web-enabled applications.
  Quickly drive clicks-and-mortar catalysts for change before vertical architectures.
  </p>
  `,
  styles: [`
  `]
})
export class LipsumCmp {
}
