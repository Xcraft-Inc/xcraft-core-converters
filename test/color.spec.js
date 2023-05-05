'use strict';

const assert = require('assert');
const ColorConverters = require('../lib/color.js');

//-----------------------------------------------------------------------------

describe('xcraft.converters.color', function () {
  it('parseEdited', function () {
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

    result = ColorConverters.parseEdited('cmyk(100,0,0,50)');
    assert.strictEqual(result.value, 'CMYK(100,0,0,50)');
    assert.strictEqual(result.error, null);

    result = ColorConverters.parseEdited('cmyk(100, 0, 0, 50)');
    assert.strictEqual(result.value, 'CMYK(100,0,0,50)');
    assert.strictEqual(result.error, null);

    result = ColorConverters.parseEdited('g(100)');
    assert.strictEqual(result.value, 'G(100)');
    assert.strictEqual(result.error, null);

    result = ColorConverters.parseEdited('hsl(80,100,100)');
    assert.strictEqual(result.value, 'HSL(80,100,100)');
    assert.strictEqual(result.error, null);

    result = ColorConverters.parseEdited('hsl(360,100,100)');
    assert.strictEqual(result.value, 'HSL(360,100,100)');
    assert.strictEqual(result.error, null);

    result = ColorConverters.parseEdited('hsl(360, 100, 100)');
    assert.strictEqual(result.value, 'HSL(360,100,100)');
    assert.strictEqual(result.error, null);
  });

  it('parseEdited with error', function () {
    let result;

    result = ColorConverters.parseEdited('#');
    assert.strictEqual(result.value, '#FFFFFF');
    assert.notEqual(result.error, null);

    result = ColorConverters.parseEdited('#1234');
    assert.strictEqual(result.value, '#FFFFFF');
    assert.notEqual(result.error, null);

    result = ColorConverters.parseEdited('#1234567');
    assert.strictEqual(result.value, '#FFFFFF');
    assert.notEqual(result.error, null);

    result = ColorConverters.parseEdited('#0X0000');
    assert.strictEqual(result.value, '#FFFFFF');
    assert.notEqual(result.error, null);

    result = ColorConverters.parseEdited('rgb(1,2,333)');
    assert.strictEqual(result.value, '#0102FF');
    assert.notEqual(result.error, null);

    result = ColorConverters.parseEdited('rgb(1,2,3,4)');
    assert.strictEqual(result.value, '#010203');
    assert.notEqual(result.error, null);

    result = ColorConverters.parseEdited('rgb(0,128)');
    assert.strictEqual(result.value, '#0080FF');
    assert.notEqual(result.error, null);

    result = ColorConverters.parseEdited('cmyk(101,0,0,50)');
    assert.strictEqual(result.value, 'CMYK(100,0,0,50)');
    assert.notEqual(result.error, null);

    result = ColorConverters.parseEdited('cmyk(100,0,0,50,2)');
    assert.strictEqual(result.value, 'CMYK(100,0,0,50)');
    assert.notEqual(result.error, null);

    result = ColorConverters.parseEdited('g(101)');
    assert.strictEqual(result.value, 'G(100)');
    assert.notEqual(result.error, null);

    result = ColorConverters.parseEdited('hsl(360,101,100)');
    assert.strictEqual(result.value, 'HSL(360,100,100)');
    assert.notEqual(result.error, null);

    result = ColorConverters.parseEdited('hsl(360,100)');
    assert.strictEqual(result.value, 'HSL(360,100,100)');
    assert.notEqual(result.error, null);

    result = ColorConverters.parseEdited('hsl(360,100,100,2)');
    assert.strictEqual(result.value, 'HSL(360,100,100)');
    assert.notEqual(result.error, null);
  });

  // prettier-ignore
  it('getDisplayed', function() {
    assert.strictEqual(ColorConverters.getDisplayed(null           ), null);
    assert.strictEqual(ColorConverters.getDisplayed('#000000'      ), '#000000');
    assert.strictEqual(ColorConverters.getDisplayed('#0080FF'      ), '#0080FF');
    assert.strictEqual(ColorConverters.getDisplayed('#FFFFFF'      ), '#FFFFFF');
    assert.strictEqual(ColorConverters.getDisplayed('CMYK(0,0,0,0)'), 'CMYK(0,0,0,0)');
    assert.strictEqual(ColorConverters.getDisplayed('G(100)'       ), 'G(100)');
    assert.strictEqual(ColorConverters.getDisplayed('HSL(1,2,3)'   ), 'HSL(1,2,3)');
  });

  it('analysisFromCanonical', function () {
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
    assert.strictEqual(result.m, 100);
    assert.strictEqual(result.y, 100);
    assert.strictEqual(result.k, 0);
    assert.strictEqual(result.h, 0);
    assert.strictEqual(result.s, 100);
    assert.strictEqual(result.l, 100);
    assert.strictEqual(result.n, 67);

    result = ColorConverters.analysisFromCanonical('#00FF00');
    assert.strictEqual(result.mode, 'RGB');
    assert.strictEqual(result.r, 0);
    assert.strictEqual(result.g, 255);
    assert.strictEqual(result.b, 0);
    assert.strictEqual(result.c, 100);
    assert.strictEqual(result.m, 0);
    assert.strictEqual(result.y, 100);
    assert.strictEqual(result.k, 0);
    assert.strictEqual(result.h, 120);
    assert.strictEqual(result.s, 100);
    assert.strictEqual(result.l, 100);
    assert.strictEqual(result.n, 67);

    result = ColorConverters.analysisFromCanonical('#FFC800');
    assert.strictEqual(result.mode, 'RGB');
    assert.strictEqual(result.r, 255);
    assert.strictEqual(result.g, 200);
    assert.strictEqual(result.b, 0);
    assert.strictEqual(result.h, 47);
    assert.strictEqual(result.s, 100);
    assert.strictEqual(result.l, 100);

    result = ColorConverters.analysisFromCanonical('#FFFFFF');
    assert.strictEqual(result.mode, 'RGB');
    assert.strictEqual(result.r, 255);
    assert.strictEqual(result.g, 255);
    assert.strictEqual(result.b, 255);
    assert.strictEqual(result.c, 0);
    assert.strictEqual(result.m, 0);
    assert.strictEqual(result.y, 0);
    assert.strictEqual(result.k, 0);

    result = ColorConverters.analysisFromCanonical('#000000');
    assert.strictEqual(result.mode, 'RGB');
    assert.strictEqual(result.r, 0);
    assert.strictEqual(result.g, 0);
    assert.strictEqual(result.b, 0);
    assert.strictEqual(result.c, 0);
    assert.strictEqual(result.m, 0);
    assert.strictEqual(result.y, 0);
    assert.strictEqual(result.k, 100);

    result = ColorConverters.analysisFromCanonical('CMYK(11,22,33,44)');
    assert.strictEqual(result.mode, 'CMYK');
    assert.strictEqual(result.c, 11);
    assert.strictEqual(result.m, 22);
    assert.strictEqual(result.y, 33);
    assert.strictEqual(result.k, 44);

    result = ColorConverters.analysisFromCanonical('CMYK(0,100,100,0)');
    assert.strictEqual(result.mode, 'CMYK');
    assert.strictEqual(result.r, 255);
    assert.strictEqual(result.g, 0);
    assert.strictEqual(result.b, 0);
    assert.strictEqual(result.c, 0);
    assert.strictEqual(result.m, 100);
    assert.strictEqual(result.y, 100);
    assert.strictEqual(result.k, 0);
    assert.strictEqual(result.h, 0);
    assert.strictEqual(result.s, 100);
    assert.strictEqual(result.l, 100);
    assert.strictEqual(result.n, 67);

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
    assert.strictEqual(result.m, 100);
    assert.strictEqual(result.y, 100);
    assert.strictEqual(result.k, 0);
    assert.strictEqual(result.h, 0);
    assert.strictEqual(result.s, 100);
    assert.strictEqual(result.l, 100);
    assert.strictEqual(result.n, 67);

    result = ColorConverters.analysisFromCanonical('HSL(120,100,100)');
    assert.strictEqual(result.mode, 'HSL');
    assert.strictEqual(result.r, 0);
    assert.strictEqual(result.g, 255);
    assert.strictEqual(result.b, 0);
    assert.strictEqual(result.c, 100);
    assert.strictEqual(result.m, 0);
    assert.strictEqual(result.y, 100);
    assert.strictEqual(result.k, 0);
    assert.strictEqual(result.h, 120);
    assert.strictEqual(result.s, 100);
    assert.strictEqual(result.l, 100);
    assert.strictEqual(result.n, 67);

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

    result = ColorConverters.analysisFromCanonical('G(50)');
    assert.strictEqual(result.mode, 'G');
    assert.strictEqual(result.r, 128);
    assert.strictEqual(result.g, 128);
    assert.strictEqual(result.b, 128);
    assert.strictEqual(result.c, 0);
    assert.strictEqual(result.m, 0);
    assert.strictEqual(result.y, 0);
    assert.strictEqual(result.k, 50);
    assert.strictEqual(result.h, 0);
    assert.strictEqual(result.s, 0);
    assert.strictEqual(result.l, 50);
    assert.strictEqual(result.n, 50);
  });

  // prettier-ignore
  it('toRGB', function () {
    assert.strictEqual(ColorConverters.toRGB("#224466"        ), "#224466");
    assert.strictEqual(ColorConverters.toRGB("CMYK(0,0,0,0)"  ), "#FFFFFF");
    assert.strictEqual(ColorConverters.toRGB("CMYK(0,0,0,100)"), "#000000");
    assert.strictEqual(ColorConverters.toRGB("HSL(0,100,100)" ), "#FF0000");
    assert.strictEqual(ColorConverters.toRGB("HSL(60,100,100)"), "#FFFF00");
    assert.strictEqual(ColorConverters.toRGB("HSL(0,50,100)"  ), "#FF8080");
    assert.strictEqual(ColorConverters.toRGB("HSL(0,100,50)"  ), "#800000");
    assert.strictEqual(ColorConverters.toRGB("G(0)"           ), "#FFFFFF");
    assert.strictEqual(ColorConverters.toRGB("G(50)"          ), "#808080");
    assert.strictEqual(ColorConverters.toRGB("G(100)"         ), "#000000");
  });

  // prettier-ignore
  it('slide', function () {
    assert.strictEqual(ColorConverters.slide("#224466", "#446688", 0.0), "#224466");
    assert.strictEqual(ColorConverters.slide("#224466", "#446688", 0.5), "#335577");
    assert.strictEqual(ColorConverters.slide("#224466", "#446688", 1.0), "#446688");
  });

  it('getLuminance', function () {
    assert.strictEqual(ColorConverters.getLuminance('#000000'), 0);
    assert.strictEqual(ColorConverters.getLuminance('#FFFFFF'), 1);
    assert.strictEqual(ColorConverters.getLuminance('#FF0000'), 0.2126);
    assert.strictEqual(ColorConverters.getLuminance('#00FF00'), 0.7152);
    assert.strictEqual(ColorConverters.getLuminance('#0000FF'), 0.0722);
    assert.strictEqual(ColorConverters.getLuminance('#888888'), 0.2462);
  });
});
