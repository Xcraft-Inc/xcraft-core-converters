const T = require('goblin-nabu/widgets/helpers/t.js');
const StringBuilder = require('goblin-nabu/lib/string-builder.js');

//-----------------------------------------------------------------------------

function _rgbToCmy(r, g, b) {
  return {c: 255 - r, m: 255 - g, y: 255 - b};
}

function _cmyToRgb(c, m, y) {
  return {r: 255 - c, g: 255 - m, b: 255 - y};
}

function _rgbToHsl(r, g, b) {
  (r /= 255), (g /= 255), (b /= 255);

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

function _hslToRgb(h, s, l) {
  h = h / 360;
  s = s / 100;
  l = l / 100;

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

function _rgbToGrey(r, g, b) {
  return {n: 255 - (r + g + b) / 3};
}

function _greyToRgb(n) {
  return {r: 255 - n, g: 255 - n, b: 255 - n};
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

function _toCanonicalRGB(r, g, b) {
  return `#${_dec2hex(r)}${_dec2hex(g)}${_dec2hex(b)}`;
}

function _toCanonicalCMY(c, m, y) {
  return `CMY(${c},${m},${y})`;
}

function _toCanonicalHSL(h, s, l) {
  return `HSL(${h},${s},${l})`;
}

function _toCanonicalGrey(n) {
  return `G(${n})`;
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
    const cmy = _rgbToCmy(rgb.r, rgb.g, rgb.b);
    const hsl = _rgbToHsl(rgb.r, rgb.g, rgb.b);
    const g = _rgbToGrey(rgb.r, rgb.g, rgb.b);
    return {
      mode: 'RGB',
      ...rgb,
      ...cmy,
      ...hsl,
      ...g,
    };
  } else if (canonical.startsWith('CMY(') && canonical.endsWith(')')) {
    const p = canonical.substring(4, canonical.length - 1).split(',');
    if (p.length === 3) {
      const cmy = {
        c: parseInt(p[0]),
        m: parseInt(p[1]),
        y: parseInt(p[2]),
      };
      const rgb = _cmyToRgb(cmy.c, cmy.m, cmy.y);
      const hsl = _rgbToHsl(rgb.r, rgb.g, rgb.b);
      const g = _rgbToGrey(rgb.r, rgb.g, rgb.b);
      return {
        mode: 'CMY',
        ...rgb,
        ...cmy,
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
      const rgb = _hslToRgb(hsl.h, hsl.s, hsl.l);
      const cmy = _rgbToCmy(rgb.r, rgb.g, rgb.b);
      const g = _rgbToGrey(rgb.r, rgb.g, rgb.b);
      return {
        mode: 'HSL',
        ...rgb,
        ...cmy,
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
      const cmy = _rgbToCmy(rgb.r, rgb.g, rgb.b);
      const hsl = _rgbToHsl(rgb.r, rgb.g, rgb.b);
      return {
        mode: 'G',
        ...rgb,
        ...cmy,
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
    return _toCanonicalRGB(analysis.r, analysis.g, analysis.b);
  } else if (analysis.mode === 'CMY') {
    return _toCanonicalCMY(analysis.c, analysis.m, analysis.y);
  } else if (analysis.mode === 'HSL') {
    return _toCanonicalHSL(analysis.h, analysis.s, analysis.l);
  } else if (analysis.mode === 'G') {
    return _toCanonicalGrey(analysis.n);
  }
}

function toRGB(canonical) {
  if (!canonical) {
    return null;
  }

  if (canonical.startsWith('#')) {
    return canonical;
  } else if (canonical.startsWith('CMY(') && canonical.endsWith(')')) {
    const p = canonical.substring(4, canonical.length - 1).split(',');
    if (p.length === 3) {
      const cmy = {
        c: parseInt(p[0]),
        m: parseInt(p[1]),
        y: parseInt(p[2]),
      };
      const rgb = _cmyToRgb(cmy.c, cmy.m, cmy.y);
      return _toCanonicalRGB(rgb.r, rgb.g, rgb.b);
    }
  } else if (canonical.startsWith('HSL(') && canonical.endsWith(')')) {
    const p = canonical.substring(4, canonical.length - 1).split(',');
    if (p.length === 3) {
      const hsl = {
        h: parseInt(p[0]),
        s: parseInt(p[1]),
        l: parseInt(p[2]),
      };
      const rgb = _hslToRgb(hsl.h, hsl.s, hsl.l);
      return _toCanonicalRGB(rgb.r, rgb.g, rgb.b);
    }
  } else if (canonical.startsWith('G(') && canonical.endsWith(')')) {
    const p = canonical.substring(2, canonical.length - 1).split(',');
    if (p.length === 1) {
      const g = {
        n: parseInt(p[0]),
      };
      const rgb = _greyToRgb(g.n);
      return _toCanonicalRGB(rgb.r, rgb.g, rgb.b);
    }
  }
  return null;
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
      result = _toCanonicalRGB(p[0].trim(), p[1].trim(), p[2].trim());
    } else {
      error = T('Doit contenir 3 nombres');
    }
  } else if (edited.startsWith('CMY(') && edited.endsWith(')')) {
    const p = edited.substring(4, edited.length - 1).split(',');
    if (p.length === 3) {
      result = _toCanonicalCMY(p[0].trim(), p[1].trim(), p[2].trim());
    } else {
      error = T('Doit contenir 3 nombres');
    }
  } else if (edited.startsWith('HSL(') && edited.endsWith(')')) {
    const p = edited.substring(4, edited.length - 1).split(',');
    if (p.length === 3) {
      result = _toCanonicalHSL(p[0].trim(), p[1].trim(), p[2].trim());
    } else {
      error = T('Doit contenir 3 nombres');
    }
  } else if (edited.startsWith('G(') && edited.endsWith(')')) {
    const p = edited.substring(2, edited.length - 1).split(',');
    if (p.length === 1) {
      result = _toCanonicalGrey(p[0].trim());
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
  getDisplayed,
  parseEdited,
};
