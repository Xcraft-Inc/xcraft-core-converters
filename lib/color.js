const T = require('goblin-nabu/widgets/helpers/t.js');
const StringBuilder = require('goblin-nabu/lib/string-builder.js');

//-----------------------------------------------------------------------------

function _rgbToCmyk(rgb) {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const k = 1 - Math.max(Math.max(r, g), b);
  if (k === 1) {
    return {
      c: 0,
      m: 0,
      y: 0,
      k: 100,
    };
  }
  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

function _cmykToRgb(cmyk) {
  const c = cmyk.c / 100;
  const m = cmyk.m / 100;
  const y = cmyk.y / 100;
  const k = cmyk.k / 100;

  const r = Math.round(255 * (1 - c) * (1 - k));
  const g = Math.round(255 * (1 - m) * (1 - k));
  const b = Math.round(255 * (1 - y) * (1 - k));

  return {r, g, b};
}

function _rgbToHsl(rgb) {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = max;

  var d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function _hslToRgb(hsl) {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  var r, g, b;

  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = l * (1 - s);
  var q = l * (1 - f * s);
  var t = l * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      (r = l), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = l), (b = p);
      break;
    case 2:
      (r = p), (g = l), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = l);
      break;
    case 4:
      (r = t), (g = p), (b = l);
      break;
    case 5:
      (r = l), (g = p), (b = q);
      break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function _rgbToGrey(rgb) {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const n = 1 - (r + g + b) / 3;

  return {n: Math.round(n * 100)};
}

function _greyToRgb(n) {
  const x = Math.round((1 - n / 100) * 255);

  return {r: x, g: x, b: x};
}

//-----------------------------------------------------------------------------

// Expand "#12f" to "#1122ff".
function _extendColorRGB(color) {
  if (color && color.length === 4) {
    let extendedColor = '#';
    for (let i = 1; i < color.length; i++) {
      extendedColor += color.charAt(i) + color.charAt(i);
    }
    return extendedColor;
  }
  return color;
}

function _exploseColorRGB(color) {
  color = _extendColorRGB(color);

  if (!color || color.length !== 7) {
    return {r: 0, g: 0, b: 0};
  }

  return {
    r: parseInt(color.substr(1, 2), 16),
    g: parseInt(color.substr(3, 2), 16),
    b: parseInt(color.substr(5, 2), 16),
  };
}

function _dec2hex(i) {
  return (Math.trunc(i) + 0x100).toString(16).substr(-2).toUpperCase();
}

function _toCanonicalRGB(rgb) {
  return `#${_dec2hex(rgb.r)}${_dec2hex(rgb.g)}${_dec2hex(rgb.b)}`;
}

function _toCanonicalCMYK(cmyk) {
  return `CMYK(${cmyk.c},${cmyk.m},${cmyk.y},${cmyk.k})`;
}

function _toCanonicalHSL(hsl) {
  return `HSL(${hsl.h},${hsl.s},${hsl.l})`;
}

function _toCanonicalGrey(g) {
  return `G(${g.n})`;
}

//-----------------------------------------------------------------------------

function check(canonical) {
  if (!canonical || typeof canonical !== 'string') {
    return false;
  }

  // TODO
  return true;
}

function analysisFromCanonical(canonical) {
  if (!canonical) {
    return null;
  }

  if (canonical.startsWith('#')) {
    const rgb = _exploseColorRGB(canonical);
    const cmyk = _rgbToCmyk(rgb);
    const hsl = _rgbToHsl(rgb);
    const g = _rgbToGrey(rgb);
    return {
      mode: 'RGB',
      ...rgb,
      ...cmyk,
      ...hsl,
      ...g,
    };
  } else if (canonical.startsWith('CMYK(') && canonical.endsWith(')')) {
    const p = canonical.substring(5, canonical.length - 1).split(',');
    if (p.length === 4) {
      const cmyk = {
        c: parseInt(p[0]),
        m: parseInt(p[1]),
        y: parseInt(p[2]),
        k: parseInt(p[3]),
      };
      const rgb = _cmykToRgb(cmyk);
      const hsl = _rgbToHsl(rgb);
      const g = _rgbToGrey(rgb);
      return {
        mode: 'CMYK',
        ...rgb,
        ...cmyk,
        ...hsl,
        ...g,
      };
    }
  } else if (canonical.startsWith('HSL(') && canonical.endsWith(')')) {
    const p = canonical.substring(4, canonical.length - 1).split(',');
    if (p.length === 3) {
      const hsl = {
        h: parseInt(p[0]),
        s: parseInt(p[1]),
        l: parseInt(p[2]),
      };
      const rgb = _hslToRgb(hsl);
      const cmyk = _rgbToCmyk(rgb);
      const g = _rgbToGrey(rgb);
      return {
        mode: 'HSL',
        ...rgb,
        ...cmyk,
        ...hsl,
        ...g,
      };
    }
  } else if (canonical.startsWith('G(') && canonical.endsWith(')')) {
    const p = canonical.substring(2, canonical.length - 1).split(',');
    if (p.length === 1) {
      const g = {
        n: parseInt(p[0]),
      };
      const rgb = _greyToRgb(g.n);
      const cmyk = _rgbToCmyk(rgb);
      const hsl = _rgbToHsl(rgb);
      return {
        mode: 'G',
        ...rgb,
        ...cmyk,
        ...hsl,
        ...g,
      };
    }
  }
  return null;
}

function analysisToCanonical(analysis) {
  if (!analysis) {
    return null;
  }

  if (analysis.mode === 'RGB') {
    return _toCanonicalRGB(analysis);
  } else if (analysis.mode === 'CMYK') {
    return _toCanonicalCMYK(analysis);
  } else if (analysis.mode === 'HSL') {
    return _toCanonicalHSL(analysis);
  } else if (analysis.mode === 'G') {
    return _toCanonicalGrey(analysis);
  }
}

function toRGB(canonical) {
  if (!canonical) {
    return null;
  }

  if (canonical.startsWith('#')) {
    return canonical;
  } else if (canonical.startsWith('CMYK(') && canonical.endsWith(')')) {
    const p = canonical.substring(5, canonical.length - 1).split(',');
    if (p.length === 4) {
      const cmyk = {
        c: parseInt(p[0]),
        m: parseInt(p[1]),
        y: parseInt(p[2]),
        k: parseInt(p[3]),
      };
      const rgb = _cmykToRgb(cmyk);
      return _toCanonicalRGB(rgb);
    }
  } else if (canonical.startsWith('HSL(') && canonical.endsWith(')')) {
    const p = canonical.substring(4, canonical.length - 1).split(',');
    if (p.length === 3) {
      const hsl = {
        h: parseInt(p[0]),
        s: parseInt(p[1]),
        l: parseInt(p[2]),
      };
      const rgb = _hslToRgb(hsl);
      return _toCanonicalRGB(rgb);
    }
  } else if (canonical.startsWith('G(') && canonical.endsWith(')')) {
    const p = canonical.substring(2, canonical.length - 1).split(',');
    if (p.length === 1) {
      const g = {
        n: parseInt(p[0]),
      };
      const rgb = _greyToRgb(g.n);
      return _toCanonicalRGB(rgb);
    }
  }
  return null;
}

function slide(color1, color2, slider) {
  const e1 = _exploseColorRGB(toRGB(color1));
  const e2 = _exploseColorRGB(toRGB(color2));

  const r = e1.r + (e2.r - e1.r) * slider;
  const g = e1.g + (e2.g - e1.g) * slider;
  const b = e1.b + (e2.b - e1.b) * slider;

  return _toCanonicalRGB({r, g, b});
}

function getDisplayed(canonical) {
  if (!canonical) {
    return null;
  }

  if (canonical.startsWith('#')) {
    const rgb = _exploseColorRGB(canonical);
    return `RGB(${rgb.r},${rgb.g},${rgb.b})`;
  }

  // TODO
  return canonical;
}

function parseEdited(edited) {
  if (!edited || edited === '') {
    return {value: null, error: null};
  }

  edited = edited.toUpperCase();

  let result = edited;
  let error = null;

  if (edited.startsWith('#')) {
    result = _extendColorRGB(edited);
  } else if (edited.startsWith('RGB(') && edited.endsWith(')')) {
    const p = edited.substring(4, edited.length - 1).split(',');
    if (p.length === 3) {
      result = _toCanonicalRGB({
        r: p[0].trim(),
        g: p[1].trim(),
        b: p[2].trim(),
      });
    } else {
      error = T('Doit contenir 3 nombres');
    }
  } else if (edited.startsWith('CMYK(') && edited.endsWith(')')) {
    const p = edited.substring(5, edited.length - 1).split(',');
    if (p.length === 4) {
      result = _toCanonicalCMYK({
        c: p[0].trim(),
        m: p[1].trim(),
        y: p[2].trim(),
        k: p[3].trim(),
      });
    } else {
      error = T('Doit contenir 4 nombres');
    }
  } else if (edited.startsWith('HSL(') && edited.endsWith(')')) {
    const p = edited.substring(4, edited.length - 1).split(',');
    if (p.length === 3) {
      result = _toCanonicalHSL({
        h: p[0].trim(),
        s: p[1].trim(),
        l: p[2].trim(),
      });
    } else {
      error = T('Doit contenir 3 nombres');
    }
  } else if (edited.startsWith('G(') && edited.endsWith(')')) {
    const p = edited.substring(2, edited.length - 1).split(',');
    if (p.length === 1) {
      result = _toCanonicalGrey({n: p[0].trim()});
    } else {
      error = T('Doit contenir un seul nombre');
    }
  } else {
    error = T('Format inconnu');
  }

  return {value: result, error: error};
}

//-----------------------------------------------------------------------------

module.exports = {
  check,
  analysisFromCanonical,
  analysisToCanonical,
  toRGB,
  slide,
  getDisplayed,
  parseEdited,
};
