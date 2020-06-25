# Xcraft Converters

To run test:

- `npm test xcraft-core-converters`

To debug test:

- Open the file `xcraft-core-converters/lib/\*.js` or `xcraft-core-converters/test/\*.js` to debug
- Set a breakpoint
- Run "Test current file (mocha)"

# Canonical

**Canonical** values are used by the computer. It is they, for example, that are persisted in databases.

Wikipedia defines the term "canonical" :

_In computer science, canonicalization (sometimes standardization or normalization) is a process for converting data that has more than one possible representation into a "standard", "normal", or canonical form. This can be done to compare different representations for equivalence, to count the number of distinct data structures, to improve the efficiency of various algorithms by eliminating repeated calculations, or to make it possible to impose a meaningful sorting order._

Generally, canonical values are strings, except for `number` and `bool`, which use JS native types.
For each type, the string containing the canonical value respects a precise syntax (see tests in `lib\xcraft-core-converters\test` for documentation).

For example:

- **date** : `"2020-03-31"`
- **time** : `"11:30:00"`
- **datetime** : `"2019-01-18T23:59:59.000Z"`
- **price** : `"100"`, `"49.95"`
- **delay** : `"* * * 30 * * *"` _(30 days)_
- **color** : `"#FF000"` _(rgb)_, `"HSL(40,100,100)"`, `"CMYK(100,0,0,50)"`, `G(50)`

`number` and `bool` use JS native types:

- **number** : `50`, `0.02`
- **bool** : `true`, `false`

The function `parseEdited` parse a free text entered by the user. Some flexibility allows the user to enter data in various formats, possibly incomplete, with a minimum of intelligence.

For example:

- **date** : `"25"` → `parseEdited` → `"2020-03-25"` _(completed by current month and year)_
- **time** : `"12"` → `parseEdited` → `"12:00:00"` _(completed with zeros)_
- **delay** : `"20j"` → `parseEdited` → `"* * * 20 * * *"`
- **delay** : `"4h"` → `parseEdited` → `"* * 4 * * * *"`
- **color** : `"#12F"` → `parseEdited` → `"#1122FF"`

`parseEdited` return a map with `value` and `error`. If everything is ok, `error` is `null`. In the event of an `error`, the `value` comes as close as possible to something plausible.

# Displayed

**Displayed** values are for human users. A canonical value has several possible representations, more or less long (according to optionnal parameter `format`).

The function `getDisplayed` format a canonical value to a string for the human user.

For example:

- **date** : `"2020-03-31"` → `getDisplayed` → `"31.03.2020"`
- **date** : `"2020-03-31"` → `getDisplayed` → `"31 mars 2020"` _(if parameter `format` set to `"dMy"`)_

# Many types

There are many types, for all uses :

- **date** : A date with day, month and year.
- **time** : A time with hours, minutes and seconds.
- **datetime** : A date and time.
- **integer** : An integer, therefore without fractional part.
- **number** : A real number, therefore with a fractional part.
- **price** : A price in Swiss francs, with 2 decimal places for cents (accept big numbers).
- **percent** : A percentage.
- **delay** : Duration in minutes, hours, days, months or years.
- **length** : A length with different units ("km", "m", "cm", "mm", usw.). The canonical value is in meters.
- **weight** : A weight with different units ("t", "kg", "g", "mg"). The canonical value is in kilogram.
- **volume** : A volume defined by 3 length, or a number of liters, with different units ("m", "cm", "l", "dm3"). The function `getDisplayedIATA` format a dimensional weight.

# Common mistakes

To get today's canonical date, don't do this:

- `const canonicalNow = date.now()`

Instead, write this:

- `const canonicalNow = DateConverters.getNowCanonical()`

Or, to display the current date in plain text:

- `const displayedNow = DateConverters.getDisplayed(DateConverters.getNowCanonical())`
