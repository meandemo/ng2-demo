import {Util}                      from '../../common/util';

///////////////////////////////////////////////////////////////////////////////
//
// Common Runner Class
//
///////////////////////////////////////////////////////////////////////////////

export class Runner {
  static cnt_ = 0x1234;           // instance counter

  private val_ = 0;                   // exact value
  private delta_ = 0;                 // to track offset while mouseMove;
  private base_ = 0;                  // id. k.push(0);
  private pos_ = 0;                   // pixel offset on the rail
  private rl_ = 0;                    // rail length in pixel

  private id_: string;                // unique identifier
  private min_ = 0;                   // default min
  private max_ = 100;                 // default max
  private is_inverted_ = false;       // inverted pos - value


  constructor(val: number, min: number, max: number, rl: number) {

    this.id_ = 'R' + Util.to_04X(Runner.cnt_);
    Runner.cnt_ = Util.CRC16(Runner.cnt_);
    //To${Runner.cnt_}`;
    // val: initial value;
    // rl: initial rail length
    //
    this.val_ = val;
    this.rl_ = rl;
    this.min_ = min;
    this.max_ = max;
    this.pos_ = this.value2pos(val);
  }

  // when the direction is changed
  // we update the position, not the value
  //
  set_direction(is_inverted: boolean) {
    if (is_inverted !== this.is_inverted_) {
      this.is_inverted_ = is_inverted;
      this.pos_ = this.rl_ - this.pos_;
    }
  }

  get_id() {
    return this.id_;
  }

  get_pos() {
    return this.pos_;
  }

  get_value(need_rounded?: boolean) {
    if (need_rounded) {
      return  Math.round(this.val_ * 10) / 10;
    } else {
      return this.val_;
    }
  }

  value2pos(v: number) {
    let pos = (this.rl_ * (v - this.min_)) / (this.max_ - this.min_);
    if (this.is_inverted_) {
      pos =  this.rl_ - pos;
    }
    return Util.clip3(pos, 0, this.rl_);
  }


  pos2value(p: number) {
    let v =  this.min_ + (p * (this.max_ - this.min_) / this.rl_);
    if (this.is_inverted_) {
      v = this.max_ - v;
    }
    return Util.clip3(v, this.min_, this.max_);
  }

  //
  // update the class when the value has changed
  //
  update_value(v:  number) {
    //console.log('[TRACE] update_valuie = ', v);
    this.val_ = Util.clip3(v, this.min_, this.max_);
    this.pos_ = this.value2pos(this.val_);
  }

  // update the class when the position has changed
  // special case of a new runner created at a given
  // position in pixel offset on rail
  //
  update_position(pos:  number) {
    //console.log('[TRACE] update_position = ', pos);
    this.pos_ = Util.clip3(pos, 0, this.rl_);
    this.val_ = this.pos2value(this.pos_);
  }

  //
  // update the class when the rail length has changed
  // value does not change, only the position on the rail
  //
  update_rail_length(rl:  number) {
    //console.log('[TRACE] set_value = ', v);
    this.rl_ = rl;
    this.pos_ = this.value2pos(this.val_);
  }

  //
  // update the class when the min value change
  // value does not change, only the position on the rail
  // changes
  //
  update_min(min:  number) {
    //console.log('[TRACE] min = ', v);
    this.min_ = min;
    this.pos_ = this.value2pos(this.val_);
  }

  //
  // update the class when the min value change
  // value does not change, only the position on the rail
  // changes
  //
  update_max(max:  number) {
    //console.log('[TRACE] min = ', v);
    this.max_ = max;
    this.pos_ = this.value2pos(this.val_);
  }


  //
  // to manage the mouse down & mouse move event
  //


  init_mouse_down_evt(offset: number) {
    this.delta_ = offset - this.pos_;
  }

  set_delta(delta: number) {
    this.delta_ = delta;
  }

  update_mouse_move_position(offset: number) {
    const pos = offset - this.delta_;
    this.pos_ = Util.clip3(pos, 0, this.rl_);
    this.val_ = this.pos2value(this.pos_);
  }
}
