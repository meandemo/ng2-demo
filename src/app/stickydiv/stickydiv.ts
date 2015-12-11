//
// header-start
//////////////////////////////////////////////////////////////////////////////////
//
// \file      src/app/stickydiv/stickydiv.ts
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
import {Component, Directive, View, OnInit, AfterViewChecked,
        Input, AfterViewInit, NgIf, NgClass
        } from 'angular2/angular2';


///////////////////////////////////////////////////////////////////////////////
//
// A configurable sticky div component
//
///////////////////////////////////////////////////////////////////////////////


@Component({
  selector: 'sticky-div',
  template: `
  <!--
    The 2 div below make the sticky div magic
    We'll comment on the first after.
    The second div includes the user content with ng-content,
    after it has scrolled to it max position,
    its position style is changed to 'fixed' with a high z-index, therefore
    it remains always visible and the scrollable content located below
    simply passes under it.

    When the second div position is changed to 'fixed', it is removed from the
    scrollable content, so we must add a content of the same height in place
    of the the navbar. The first div is doing just this
  -->

  <!-- div 1 -->

    <div *ngIf="is_div2_fixed_"
      [style.height.px]="div_height_"
      [style.width.px]="div_width_"
      (window:resize)="onResize()"
      style="padding: 0; font-size: 12px; color: black; background-color: red">
      Ouch! If you see this text on the browser, you have a problem with
      stick div id: {{instance_id_}}. It is likely that
      the maxscroll value is not large enough, please
      increase it.
    </div>

  <!-- div 2 -->

    <div [id]="div2_id_" [ngStyle]="setStyles(is_div2_fixed_)"
      (window:scroll)="onScroll()">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
  `],
  directives: [NgIf, NgClass]
})
export class StickyDivCmp implements OnInit, AfterViewInit {
  static instance_cnt_ = 0;
  @Input() maxscroll: any;

  public clientHeight: number;


  private is_sticky_ = false;

  private y_offset_ = 0;
  private div_width_ = 0;
  private div_height_ = 0;
  private div_top_ = 0;
  private div_initial_top_ = 0;
  private div_left_ = 0;
  private menu_items_: any[];

  private div2_id_: string;
  private do_check_ = false;

  private is_div2_fixed_ = false;
  private div2_elm_: any;

  //
  // We use the constructor to register a unique id
  // needed for the div#2 above
  //  <div [id]="div2_id_" ...>
  // and used by getElementById()
  //
  constructor() {
    this.div2_id_ = `sticky-div2-magic-${StickyDivCmp.instance_cnt_}`;
    ++StickyDivCmp.instance_cnt_;
  }

  //
  // At the ngOnInit() stage, we can't do much
  // The @Input is not yet injected as the maxscroll value
  // is not known at this stage (except if hardcoded value).
  //
  ngOnInit() {
  }

  //
  // At the afterViewInit() stage,
  // we can extract the div#2 size and position using getElementById.  
  // (could not find an 'angular' way to access DOM elements of the template)  
  //
  // Note that the use of a unique id for div#2  (using a static instance counter)
  // guarantees that getElementById() returns the div#2 
  // linked with 'this', the current class instance.
  // Note: @Input may not be injected yet!

  //
  ngAfterViewInit() {
    this.div2_elm_ = document.getElementById(this.div2_id_);
    this.clientHeight = this.div2_elm_.clientHeight;
    const bbox = this.div2_elm_.getBoundingClientRect();
    this.div_height_      = bbox.height;
    this.div_width_       = bbox.width;
    this.div_initial_top_ = bbox.top;
    this.div_left_        = bbox.left;


  }

  // At the afterViewChecked() stage,
  // @Input is injected, so we can finally obtain the numerical
  // value associated with this maxscroll property
  //
  ngAfterViewChecked() {
    if ('maxscroll' in this) {

      this.is_sticky_ = true;
      this.y_offset_ = 0 + this.maxscroll;
      this.div_top_  = this.div_initial_top_ - this.y_offset_;
    }
  }


  setStyles(is_fixed: boolean): any {
    if (is_fixed) {
      return {
        'position': 'fixed',
        'padding': '0px',
        'z-index': 140,
        'height': `${this.div_height_}px`,
        'width': `${this.div_width_}px`,
        'top': `${this.div_top_}px`,
        'left': `${this.div_left_}px`
      };
    } else {
      return {};
    }
  }


  //
  // When a sticky-div has scrolled up to its
  // max amount, it becomes fixed.
  //
  onScroll() {
    if (this.is_sticky_) {
      this.is_div2_fixed_ = (window.pageYOffset >= this.y_offset_);
    }
  }
  /*
      this.div_left_        = bbox.left;
      this.is_div2_fixed_   = false;

      console.log('[Trace] onScroll()          id     ' + this.instance_id_);
      console.log('[Trace] onScroll()          offset ' + this.y_offset_);
      console.log('[Trace] onScroll()          divtop ' + this.div_top_);
      console.log('[Trace] onScroll()          top    ' + bbox.top);
      console.log('[Trace] onScroll()          bottom ' + bbox.bottom);
      console.log('[Trace] onScroll()          left   ' + bbox.left);
      console.log('[Trace] onScroll()          right  ' + bbox.right);


    } else if (window.pageYOffset > this.y_offset_) {
      this.is_div2_fixed_ = true;
    } else {
      this.is_div2_fixed_ = false;
    }
  }
  */


  //
  // Using a non-optiminal page reload feature
  //
  onResize() {
    if (this.is_sticky_) {
      window.location.reload();
      is_div2_fixed_ = false;
      this.is_sticky_ = false;
    }
  }
}


//  const obj = document.getElementById(this.div2_id_);
//   const bbox = obj.getBoundingClientRect();
//   this.div_height_      = bbox.height;
//   this.div_width_       = bbox.width;
//   this.div_initial_top_ = bbox.top;
//   this.div_left_        = bbox.left;
//     this.y_offset_ = 0 + this.maxscroll;
//     this.div_top_  = this.div_initial_top_ - this.y_offset_;
//    this.clientHeight = this.div_height_;
//   }

