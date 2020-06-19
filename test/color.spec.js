'use strict';

const assert = require('assert');
const ColorConverters = require('../lib/color.js');

//-----------------------------------------------------------------------------

describe('Converter color', function () {
  it('#Test parseEdited', function () {
    let result;

    result = ColorConverters.parseEdited('');
    assert.strictEqual(result.value, null);
    assert.strictEqual(result.error, null);

    result = ColorConverters.parseEdited('#123');
    assert.strictEqual(result.value, '#112233');
    assert.strictEqual(result.error, null);

    result = ColorConverters.parseEdited('#aabbff');
    assert.strictEqual(result.value, '#AABBFF');
    assert.strictEqual(result.error, null);

    result = ColorConverters.parseEdited('rgb(1,2,3)');
    assert.strictEqual(result.value, '#010203');
    assert.strictEqual(result.error, null);

    result = ColorConverters.parseEdited('rgb(1, 2, 3)');
    assert.strictEqual(result.value, '#010203');
    assert.strictEqual(result.error, null);

    result = ColorConverters.parseEdited('rgb(0,128,255)');
    assert.strictEqual(result.value, '#0080FF');
    assert.strictEqual(result.error, null);

    result = ColorConverters.parseEdited('rgb(0, 128, 255)');
    assert.strictEqual(result.value, '#0080FF');
    assert.strictEqual(result.error, null);

    result = ColorConverters.parseEdited('cmy(100,0,255)');
    assert.strictEqual(result.value, 'CMY(100,0,255)');
    assert.strictEqual(result.error, null);

    result = ColorConverters.parseEdited('cmy(100, 0, 255)');
    assert.strictEqual(result.value, 'CMY(100,0,255)');
    assert.strictEqual(result.error, null);

    result = ColorConverters.parseEdited('g(100)');
    assert.strictEqual(result.value, 'G(100)');
    assert.strictEqual(result.error, null);

    result = ColorConverters.parseEdited('hsl(360,100,100)');
    assert.strictEqual(result.value, 'HSL(360,100,100)');
    assert.strictEqual(result.error, null);

    result = ColorConverters.parseEdited('hsl(360, 100, 100)');
    assert.strictEqual(result.value, 'HSL(360,100,100)');
    assert.strictEqual(result.error, null);
  });

  // prettier-ignore
  it('#Test getDisplayed', function() {
    assert.strictEqual(ColorConverters.getDisplayed(null        ), null);
    assert.strictEqual(ColorConverters.getDisplayed('#000000'   ), 'RGB(0,0,0)');
    assert.strictEqual(ColorConverters.getDisplayed('#0080FF'   ), 'RGB(0,128,255)');
    assert.strictEqual(ColorConverters.getDisplayed('#FFFFFF'   ), 'RGB(255,255,255)');
    assert.strictEqual(ColorConverters.getDisplayed('CMY(0,0,0)'), 'CMY(0,0,0)');
    assert.strictEqual(ColorConverters.getDisplayed('G(100)'    ), 'G(100)');
    assert.strictEqual(ColorConverters.getDisplayed('HSL(1,2,3)'), 'HSL(1,2,3)');
  });

  it('#Test analysisFromCanonical', function () {
    let result;

    result = ColorConverters.analysisFromCanonical(null);
    assert.strictEqual(result, null);

    result = ColorConverters.analysisFromCanonical('RGB(0,0,0)'); // wrong canonical value (must be '#rrggbb')
    assert.strictEqual(result, null);

    result = ColorConverters.analysisFromCanonical('#0080FF');
    assert.strictEqual(result.mode, 'RGB');
    assert.strictEqual(result.r, 0);
    assert.strictEqual(result.g, 128);
    assert.strictEqual(result.b, 255);

    result = ColorConverters.analysisFromCanonical('#FF0000');
    assert.strictEqual(result.mode, 'RGB');
    assert.strictEqual(result.r, 255);
    assert.strictEqual(result.g, 0);
    assert.strictEqual(result.b, 0);
    assert.strictEqual(result.c, 0);
    assert.strictEqual(result.m, 255);
    assert.strictEqual(result.y, 255);
    assert.strictEqual(result.h, 0);
    assert.strictEqual(result.s, 100);
    assert.strictEqual(result.l, 100);
    assert.strictEqual(result.n, 170);

    result = ColorConverters.analysisFromCanonical('#00FF00');
    assert.strictEqual(result.mode, 'RGB');
    assert.strictEqual(result.r, 0);
    assert.strictEqual(result.g, 255);
    assert.strictEqual(result.b, 0);
    assert.strictEqual(result.c, 255);
    assert.strictEqual(result.m, 0);
    assert.strictEqual(result.y, 255);
    assert.strictEqual(result.h, 120);
    assert.strictEqual(result.s, 100);
    assert.strictEqual(result.l, 100);
    assert.strictEqual(result.n, 170);

    result = ColorConverters.analysisFromCanonical('#FFC800');
    assert.strictEqual(result.mode, 'RGB');
    assert.strictEqual(result.r, 255);
    assert.strictEqual(result.g, 200);
    assert.strictEqual(result.b, 0);
    assert.strictEqual(result.h, 47);
    assert.strictEqual(result.s, 100);
    assert.strictEqual(result.l, 100);

    result = ColorConverters.analysisFromCanonical('CMY(1,222,33)');
    assert.strictEqual(result.mode, 'CMY');
    assert.strictEqual(result.c, 1);
    assert.strictEqual(result.m, 222);
    assert.strictEqual(result.y, 33);

    result = ColorConverters.analysisFromCanonical('CMY(0,255,255)');
    assert.strictEqual(result.mode, 'CMY');
    assert.strictEqual(result.r, 255);
    assert.strictEqual(result.g, 0);
    assert.strictEqual(result.b, 0);
    assert.strictEqual(result.c, 0);
    assert.strictEqual(result.m, 255);
    assert.strictEqual(result.y, 255);
    assert.strictEqual(result.h, 0);
    assert.strictEqual(result.s, 100);
    assert.strictEqual(result.l, 100);
    assert.strictEqual(result.n, 170);

    result = ColorConverters.analysisFromCanonical('HSL(360,100,100)');
    assert.strictEqual(result.mode, 'HSL');
    assert.strictEqual(result.h, 360);
    assert.strictEqual(result.s, 100);
    assert.strictEqual(result.l, 100);

    result = ColorConverters.analysisFromCanonical('HSL(0,100,100)');
    assert.strictEqual(result.mode, 'HSL');
    assert.strictEqual(result.r, 255);
    assert.strictEqual(result.g, 0);
    assert.strictEqual(result.b, 0);
    assert.strictEqual(result.c, 0);
    assert.strictEqual(result.m, 255);
    assert.strictEqual(result.y, 255);
    assert.strictEqual(result.h, 0);
    assert.strictEqual(result.s, 100);
    assert.strictEqual(result.l, 100);
    assert.strictEqual(result.n, 170);

    result = ColorConverters.analysisFromCanonical('HSL(120,100,100)');
    assert.strictEqual(result.mode, 'HSL');
    assert.strictEqual(result.r, 0);
    assert.strictEqual(result.g, 255);
    assert.strictEqual(result.b, 0);
    assert.strictEqual(result.c, 255);
    assert.strictEqual(result.m, 0);
    assert.strictEqual(result.y, 255);
    assert.strictEqual(result.h, 120);
    assert.strictEqual(result.s, 100);
    assert.strictEqual(result.l, 100);
    assert.strictEqual(result.n, 170);

    result = ColorConverters.analysisFromCanonical('HSL(47,100,100)');
    assert.strictEqual(result.mode, 'HSL');
    assert.strictEqual(result.r, 255);
    assert.strictEqual(result.g, 200);
    assert.strictEqual(result.b, 0);
    assert.strictEqual(result.h, 47);
    assert.strictEqual(result.s, 100);
    assert.strictEqual(result.l, 100);

    result = ColorConverters.analysisFromCanonical('G(55)');
    assert.strictEqual(result.mode, 'G');
    assert.strictEqual(result.n, 55);

    result = ColorConverters.analysisFromCanonical('G(128)');
    assert.strictEqual(result.mode, 'G');
    assert.strictEqual(result.r, 127);
    assert.strictEqual(result.g, 127);
    assert.strictEqual(result.b, 127);
    assert.strictEqual(result.c, 128);
    assert.strictEqual(result.m, 128);
    assert.strictEqual(result.y, 128);
    assert.strictEqual(result.h, 0);
    assert.strictEqual(result.s, 0);
    assert.strictEqual(result.l, 50);
    assert.strictEqual(result.n, 128);

    result = ColorConverters.analysisFromCanonical('G(127)');
    assert.strictEqual(result.mode, 'G');
    assert.strictEqual(result.r, 128);
    assert.strictEqual(result.g, 128);
    assert.strictEqual(result.b, 128);
    assert.strictEqual(result.c, 127);
    assert.strictEqual(result.m, 127);
    assert.strictEqual(result.y, 127);
    assert.strictEqual(result.h, 0);
    assert.strictEqual(result.s, 0);
    assert.strictEqual(result.l, 50);
    assert.strictEqual(result.n, 127);
  });

  // prettier-ignore
  it('#Test slide', function () {
    assert.strictEqual(ColorConverters.slide("#224466", "#446688", 0.0), "#224466");
    assert.strictEqual(ColorConverters.slide("#224466", "#446688", 0.5), "#335577");
    assert.strictEqual(ColorConverters.slide("#224466", "#446688", 1.0), "#446688");
  });
});
