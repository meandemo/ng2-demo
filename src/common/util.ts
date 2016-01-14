


//
// Util functions in a static class
// Can't use isNaN 
// http://stackoverflow.com/questions/32967380/how-compatible-is-will-be-typescript-to-es6-ecmascript-2015

export class Util {

  static CRC16(v: number) {
    const mask1 = 0x1021;  // CRC-CCITT
    const mask2 = 0xFFFF;
    // implement a quick CRC
    let r = (v << 1) & mask2;
    if ( v >= 0x8000) {
      r = r ^ mask1;
    }
    return r;
  }

  static to_04X(v: number): string {
    let r = '000' + v.toString(16).toUpperCase();
    return r.slice(-4);
  }

  static to_hex(v: number): string {
    v = Math.round(v);
    if (v < 0) {
      return '00';
    } else if (v > 255) {
      return 'ff';
    } else if (v < 16) {
      return '0' + v.toString(16);
    } else {
      return v.toString(16);
    }
  }

  static rgb2str(r: number, g: number, b: number): string {
    return '#' + Util.to_hex(r) + Util.to_hex(g) + Util.to_hex(b);
  }

  static clip3(v: number, min: number, max: number): number {
    v = isNaN(v) ? 0 : v;
    if (v < min) { return min; }
    if (v > max) { return max; }
    return v;
  }


}

