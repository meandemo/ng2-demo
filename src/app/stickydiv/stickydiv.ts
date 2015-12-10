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

    <div *ngIf="is_fixed_ && is_enabled_" 
      [style.height.px]="div_height_"
      [style.width.px]="div_width_"
      style="padding: 0; font-size: 12px; color: black; background-color: red">
      Ouch! If you see this text on the browser, you have a problem with
      stick div id: {{instance_id_}}. It is likely that  
      the maxscroll value is not large enough, please
      increase it.
    </div>

  <!-- div 2 -->

    <div [id]="instance_id_" [ngStyle]="setStyles(is_fixed_ && is_enabled_)"
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

  private y_offset_ = 0;
  private div_width_ = 0;
  private div_height_ = 0;
  private div_top_ = 0;
  private div_current_top_ = 0;
  private div_left_ = 0;
  private is_fixed_ = false;
  private is_enabled_ = false;
  private menu_items_: any[];
  private instance_id_: string;
  private do_check_ = false;


  //
  // We use the constructor to register a unique id
  // needed for the div#2 above: <div [id]="instance_id_" ...>
  // and used by getElementById()
  //
  constructor() {
    this.instance_id_ = `sticky-div-magic-${StickyDivCmp.instance_cnt_}`; 
    ++StickyDivCmp.instance_cnt_;
  }

  // 
  // At the ngOnInit() stage, we can't do much
  // The @Input is not yet injected if the maxscroll value
  // is not known at this stage.
  //
  ngOnInit() {
    if ('maxscroll' in this) {
      this.is_enabled_ = true;
    }
  }

  height(): number {
    return this.div_height_;
  }

  //
  // At the afterViewInit() stage,
  // we can extract the div#2 size and position using getElementById.  
  // We could not find an 'angular' way to access DOM elements of the template  
  // Note that without the use of a unique instance_id_,
  // we could not ensure that getElementById() returns the div#2 object
  // linked with 'this', the current class instance.
  // Note: @Input may not be injected yet.

  //
  ngAfterViewInit() {
    const obj = document.getElementById(this.instance_id_);
    const bbox = obj.getBoundingClientRect();

    this.div_height_      = bbox.bottom - bbox.top;
    this.div_width_       = bbox.right - bbox.left;
    this.div_current_top_ = bbox.top;
    this.div_left_        = bbox.left;

    //console.log('[Trace] afterViewInit()     id     ' + this.instance_id_);
    //console.log('[Trace] afterViewInit()     top    ' + bbox.top);
    //console.log('[Trace] afterViewInit()     bottom ' + bbox.bottom);
    //console.log('[Trace] afterViewInit()     left   ' + bbox.left);
    //console.log('[Trace] afterViewInit()     right  ' + bbox.right);
  }



  //
  // At the afterViewChecked() stage,
  // @Input is injected, so we can finally obtain the numerical
  // value associated with this maxscroll property 
  //
  ngAfterViewChecked() {
    if (!('maxscroll' in this)) {
      this.is_enabled_ = false;
      return;
    }
    this.is_enabled_ = true;

    //console.log('[Trace] afterViewChecked() id        = ' + this.instance_id_);
    this.y_offset_ = 0 + this.maxscroll;  
    this.div_top_  = this.div_current_top_ - this.y_offset_;   
  }


  setStyles(is_fixed: boolean): any {
    if (is_fixed) {
      return {
        'height': `${this.div_height_}px`,
        'width': `${this.div_width_}px`,
        'position': 'fixed',
        'padding': '0px',
        'z-index': 140,
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
    this.is_fixed_ = (window.pageYOffset >= this.y_offset_);

    // console.log('[Trace] onScroll()         id        = ' + this.instance_id_);
    // console.log('[Trace] onScroll()         pageYOf.. = ' + window.pageYOffset);
    // console.log('[Trace] onScroll()         is_fixed  = ' + this.is_fixed_);
  }

  //
  // not yet implemented
  //
  onResize() {
    //console.log('[Trace] onResize() id        = ' + this.instance_id_);
  }
}
