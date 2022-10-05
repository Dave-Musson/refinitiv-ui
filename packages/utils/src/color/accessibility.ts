import { colord, extend } from 'colord';
import hwbPlugin from 'colord/plugins/hwb.js';
import namesPlugin from 'colord/plugins/names.js';
extend([hwbPlugin, namesPlugin]);

type NColWB = {
  ncol: string;
  w: number;
  b: number;
}

type NColLocalized = {
  name: string | undefined,
  lightIntense: string,
  colorName: string,
  colorMixPercent: number,
  colorMixName: string
}

class AccessibilityColor {
  private color;
  private ncolwb: NColWB;

  /**
   * constructor to parse string to default color
   * set default format color
   * @param color string color
   */
  constructor (color: string) {
    this.color = colord(color);
    this.ncolwb = this.getNColWB();
  }

  private get isGreyScale (): boolean {
    return this.ncolwb.w + this.ncolwb.b === 100;
  }

  private getMixColorName = (colorName: string): [string, string] => {
    switch (colorName) {
      case 'Y':
        return ['Yellow', 'Green'];
      case 'G':
        return ['Green', 'Cyan'];
      case 'C':
        return ['Cyan', 'Blue'];
      case 'B':
        return ['Blue', 'Magenta'];
      case 'M':
        return ['Magenta', 'Red'];
      case 'R':
      default:
        return ['Red', 'Yellow'];
    }
  };

  private get lightIntense (): string {
    const lightness = this.color.toHsl().l;
    if (lightness >= 80) {
      return 'Very Light';
    }
    else if (lightness >= 65) {
      return 'Light';
    }
    else if (lightness <= 10) {
      return 'Very Dark';
    }
    else if (lightness <= 40) {
      return 'Dark';
    }
    return '';
  }
  private get lightIntenseLocalized (): string {
    const lightness = this.color.toHsl().l;
    if (lightness >= 75) {
      return 'VERY_LIGHT';
    }
    else if (lightness >= 60) {
      return 'LIGHT';
    }
    else if (lightness <= 25) {
      return 'VERY_DARK';
    }
    else if (lightness <= 40) {
      return 'DARK';
    }
    return '';
  }

  private sortMixColor = (
    color1: string,
    color2: string,
    mixPercent: number
  ): [string, string, number] => {
    if (mixPercent > 50) {
      return [color2, color1, 100 - mixPercent];
    }
    else {
      return [color1, color2, mixPercent];
    }
  };

  private getColorAdmixture = (): [string, string, number] => {
    if (this.isGreyScale) {
      return this.sortMixColor('Black', 'White', this.ncolwb.w);
    }
    
    const ncolCode = this.ncolwb.ncol[0];
    const ncolMixPercent = parseInt(this.ncolwb.ncol.slice(1), 10);
    const [colorName, colorMixName] = this.getMixColorName(ncolCode);
    
    return this.sortMixColor(colorName, colorMixName, ncolMixPercent);
  };

  private hueToNcol = (hue: number): string => {
    while (hue >= 360) {
      hue -= 360;
    }
    if (hue < 60) {
      return `R${hue / 0.6}`;
    }
    if (hue < 120) {
      return `Y${(hue - 60) / 0.6}`;
    }
    if (hue < 180) {
      return `G${(hue - 120) / 0.6}`;
    }
    if (hue < 240) {
      return `C${(hue - 180) / 0.6}`;
    }
    if (hue < 300) {
      return `B${(hue - 240) / 0.6}`;
    }
    if (hue < 360) {
      return `M${(hue - 300) / 0.6}`;
    }
    return '';
  };

  private getNColWB = (): NColWB => {
    const { h, w, b } = this.color.toHwb();
    let ncol = this.hueToNcol(h);
    ncol = `${ncol[0]}${Math.round(Number(ncol.slice(1)))}`;
    return { ncol, w, b };
  };

  public get description (): string {
    const name = this.color.toName();
    if (name) {
      return name[0].toUpperCase() + name.slice(1);
    }
    const [colorName, colorMixName, colorMixPercent] = this.getColorAdmixture();
    const lightIntense = !this.isGreyScale && this.lightIntense ? `${this.lightIntense} ` : '';
    if (colorMixPercent > 0) {
      return `${lightIntense}${colorName} with ${colorMixPercent}% ${colorMixName}`;
    }
    else {
      return `${lightIntense}${colorName}`;
    }
  }

  public toLocalized (): NColLocalized {
    const name = this.color.toName();
    const [colorName, colorMixName, colorMixPercent] = this.getColorAdmixture();
    return {
      name,
      lightIntense: !this.isGreyScale ? this.lightIntenseLocalized : '',
      colorName: colorName.toUpperCase(),
      colorMixPercent,
      colorMixName: colorMixName.toUpperCase()
    };
  }
}



export {
  AccessibilityColor
};
