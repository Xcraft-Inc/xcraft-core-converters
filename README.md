# 📘 Documentation du module xcraft-core-converters

## Aperçu

Le module `xcraft-core-converters` est une bibliothèque complète de conversion de données pour l'écosystème Xcraft. Il fournit un ensemble de convertisseurs spécialisés permettant de transformer des valeurs entre leur format canonique (interne), leur format d'affichage (pour l'UI) et leur format d'édition (saisie utilisateur). Cette bibliothèque est essentielle pour assurer la cohérence des données à travers l'application.

## Sommaire

- [Structure du module](#structure-du-module)
- [Fonctionnement global](#fonctionnement-global)
- [Exemples d'utilisation](#exemples-dutilisation)
- [Interactions avec d'autres modules](#interactions-avec-dautres-modules)
- [Configuration avancée](#configuration-avancée)
- [Détails des sources](#détails-des-sources)

## Structure du module

Le module est organisé en plusieurs convertisseurs spécialisés, chacun dédié à un type de données spécifique :

- **Types de base** : `bool`, `number`, `integer`, `double`, `percent`
- **Dates et temps** : `date`, `time`, `datetime`, `delay`, `calendar`
- **Mesures** : `price`, `weight`, `length`, `pixel`, `volume`
- **Périodes** : `month`, `dow` (jour de la semaine), `quarter`, `semester`, `year-week`, `year-month`, `year-quarter`, `year-semester`
- **Autres** : `color`, `reference`, `field-type-checker`

Chaque convertisseur expose généralement les fonctions suivantes :

- `check()` - Vérifie si une valeur est au format canonique valide
- `getDisplayed()` - Convertit une valeur canonique en format d'affichage
- `parseEdited()` - Analyse une valeur éditée et la convertit en format canonique

## Fonctionnement global

Le module fonctionne sur le principe de conversion bidirectionnelle entre trois formats principaux :

1. **Format canonique** : Le format interne utilisé pour stocker les données (ex: `2023-01-15` pour une date)
2. **Format d'affichage** : Le format lisible par l'utilisateur (ex: `15.01.2023` pour une date)
3. **Format d'édition** : Le format accepté lors de la saisie utilisateur (ex: `15 1 23` pour une date)

La fonction centrale `getConverter(type)` permet d'obtenir le convertisseur approprié pour un type donné.

## Exemples d'utilisation

### Conversion de date

```javascript
const DateConverters = require('xcraft-core-converters/lib/date.js');

// Vérifier si une valeur est une date canonique valide
DateConverters.check('2023-01-15'); // true

// Convertir une date canonique en format d'affichage
DateConverters.getDisplayed('2023-01-15'); // '15.01.2023'
DateConverters.getDisplayed('2023-01-15', 'dMy'); // '15 janvier 2023'

// Analyser une date éditée
const result = DateConverters.parseEdited('15 1 23');
console.log(result.value); // '2023-01-15'
console.log(result.error); // null

// Manipuler des dates
const nextMonth = DateConverters.addMonths('2023-01-15', 1); // '2023-02-15'
const lastWeek = DateConverters.addDays('2023-01-15', -7); // '2023-01-08'
```

### Conversion de prix

```javascript
const PriceConverters = require('xcraft-core-converters/lib/price.js');

// Convertir un prix canonique en format d'affichage
PriceConverters.getDisplayed('1234.5'); // "1 234.50"
PriceConverters.getDisplayed('1234567.89', 'p-1M'); // "1.23 M"

// Analyser un prix édité
const result = PriceConverters.parseEdited("1'234.5");
console.log(result.value); // '1234.5'
console.log(result.error); // null

// Incrémenter un prix édité
const incResult = PriceConverters.incEdited('54.1', 0, 1, 5, 0, 100);
console.log(incResult.edited); // '59.10'
```

### Conversion de couleur

```javascript
const ColorConverters = require('xcraft-core-converters/lib/color.js');

// Convertir une couleur en format RGB
ColorConverters.toRGB('HSL(120,100,100)'); // '#00FF00'
ColorConverters.toRGB('CMYK(100,0,100,0)'); // '#00FF00'

// Analyser une couleur éditée
const result = ColorConverters.parseEdited('rgb(0,128,255)');
console.log(result.value); // '#0080FF'

// Manipuler des couleurs
const darkRed = ColorConverters.changeColor('#FF0000', 0, 1, 0.5); // '#800000'
const blended = ColorConverters.slide('#224466', '#446688', 0.5); // '#335577'
```

### Utilisation du module calendar

```javascript
const CalendarConverters = require('xcraft-core-converters/lib/calendar.js');

// Convertir une date en format planner
const plannerDate = CalendarConverters.toPlannerDate('2023-01-15T12:00:00Z'); // '2023-01-15'

// Convertir une date avec fuseau horaire
const zonedDate = CalendarConverters.addTimezone(
  '2023-01-15T12:00:00',
  'Europe/Paris'
);
console.log(zonedDate); // '2023-01-15T12:00:00[Europe/Paris]'

// Obtenir la date actuelle avec fuseau horaire
const now = CalendarConverters.nowZonedDateTimeISO();
```

## Interactions avec d'autres modules

Ce module est utilisé par de nombreux composants de l'écosystème Xcraft, notamment :

- **[goblin-laboratory]** : Pour la conversion des données dans les widgets
- **[goblin-desktop]** : Pour l'affichage et l'édition des données dans l'interface utilisateur
- **[goblin-nabu]** : Pour l'internationalisation des valeurs affichées

## Configuration avancée

Le module ne nécessite pas de configuration particulière, mais certains convertisseurs acceptent des paramètres pour personnaliser leur comportement :

- Format d'affichage (par exemple, format court ou long pour les dates)
- Unités de mesure préférées (par exemple, kg ou g pour les poids)
- Valeurs minimales et maximales pour la validation

## Détails des sources

### `converters.js`

Ce fichier central expose la fonction `getConverter(type)` qui permet d'obtenir le convertisseur approprié pour un type donné. Il importe tous les convertisseurs spécifiques et les expose via un objet `typeConverters`.

```javascript
const {getConverter} = require('xcraft-core-converters/lib/converters.js');

// Obtenir un convertisseur spécifique
const dateConverter = getConverter('date');
const priceConverter = getConverter('price');
```

### `bool.js`

Convertisseur pour les valeurs booléennes.

**Fonctions principales :**

- `check(canonical)` : Vérifie si la valeur est un booléen
- `getDisplayed(canonicalBool, format)` : Convertit un booléen en "Oui"/"Non" ou "True"/"False" selon le format

```javascript
const BoolConverters = require('xcraft-core-converters/lib/bool.js');

BoolConverters.check(true); // true
BoolConverters.getDisplayed(true); // 'Oui'
BoolConverters.getDisplayed(true, 'brut'); // 'True'
BoolConverters.getDisplayed(false); // 'Non'
```

### `calendar.js`

Convertisseur pour la gestion avancée des dates avec fuseaux horaires, conforme aux standards ISO 8601 et supportant les fuseaux horaires nommés.

**Fonctions principales :**

- `toPlannerDate(dateOrDateTime)` - Convertit une date ou datetime en format date simple
- `parseZonedDateTime(dateOrDateTime)` - Analyse une date avec fuseau horaire
- `toJsDate(dateOrDateTime, isEndDate)` - Convertit en objet Date JavaScript
- `getTimezone(dateOrDateTime)` - Extrait le fuseau horaire
- `addTimezone(plainDateTime, timezone)` - Ajoute un fuseau horaire à une date
- `plainDateISO(date)` - Convertit une date JS en format ISO 8601 (date seulement)
- `plainTimeISO(date)` - Convertit une date JS en format ISO 8601 (heure seulement)
- `plainDateTimeISO(date)` - Convertit une date JS en format ISO 8601 (date et heure)
- `nowZonedDateTimeISO()` - Retourne la date et l'heure actuelles avec le fuseau horaire local

```javascript
const CalendarConverters = require('xcraft-core-converters/lib/calendar.js');

// Conversion de formats
const plainDate = CalendarConverters.plainDateISO(new Date()); // '2023-01-15'
const plainTime = CalendarConverters.plainTimeISO(new Date()); // '14:30:45.123'

// Gestion des fuseaux horaires
const zonedDateTime = CalendarConverters.addTimezone(
  '2023-01-15T14:30:00',
  'Europe/Paris'
); // '2023-01-15T14:30:00[Europe/Paris]'

// Analyse de dates avec fuseaux horaires
const parsed = CalendarConverters.parseZonedDateTime(
  '2023-01-15T14:30:00[Europe/Paris]'
);
// {datetime: '2023-01-15T14:30:00', date: '2023-01-15', time: '14:30:00', timezone: 'Europe/Paris'}
```

### `color.js`

Convertisseur pour les couleurs, supportant les formats RGB, CMYK, HSL et niveaux de gris.

**Fonctions principales :**

- `analysisFromCanonical(canonical)` - Analyse complète d'une couleur
- `analysisToCanonical(analysis)` - Convertit une analyse en valeur canonique
- `toRGB(canonical)` - Convertit n'importe quel format en RGB
- `slide(color1, color2, slider)` - Mélange deux couleurs
- `changeColor(color, hueShift, saturationFactor, lightFactor)` - Modifie une couleur
- `getLuminance(canonical)` - Calcule la luminance d'une couleur (entre 0 et 1)

```javascript
const ColorConverters = require('xcraft-core-converters/lib/color.js');

// Analyse complète d'une couleur
const color = '#FF0000';
const analysis = ColorConverters.analysisFromCanonical(color);
// {mode: 'RGB', r: 255, g: 0, b: 0, c: 0, m: 100, y: 100, k: 0, h: 0, s: 100, l: 100, n: 67}

// Calcul de luminance
const luminance = ColorConverters.getLuminance(color); // 0.2126

// Conversion entre formats
ColorConverters.toRGB('HSL(120,100,100)'); // '#00FF00'
ColorConverters.toRGB('CMYK(100,0,100,0)'); // '#00FF00'

// Manipulation de couleurs
const blended = ColorConverters.slide('#224466', '#446688', 0.5); // '#335577'
const modified = ColorConverters.changeColor('#FF0000', 60, 0.8, 0.7); // Décale la teinte de 60°, réduit la saturation et la luminosité
```

### `date.js`

Convertisseur pour les dates, avec de nombreuses fonctions de manipulation et d'affichage.

**Fonctions principales :**

- `addDays/addMonths/addYears` - Manipulation de dates
- `getDisplayed(canonicalDate, format, shift)` - Affichage formaté
- `parseEdited(editedDate, defaultCanonicalDate, minCanonicalDate, maxCanonicalDate, mode, shift)` - Analyse de saisie utilisateur
- `getPeriodDescription(fromDate, toDate, format, separator, shift)` - Description d'une période
- `changePeriod(fromDate, toDate, direction)` - Navigation entre périodes
- `getCalcDate(date, exps, direction)` - Calcule une date relative (ex: '-2d', '3m', '1y')
- `incEdited(edited, cursorPosition, direction, step, min, max)` - Incrémente une date éditée

```javascript
const DateConverters = require('xcraft-core-converters/lib/date.js');

// Manipulation de dates
const today = DateConverters.getNowCanonical();
const nextMonth = DateConverters.addMonths(today, 1);
const endOfMonth = DateConverters.moveAtEndingOfMonth(today);

// Affichage formaté
DateConverters.getDisplayed('2023-01-15', 'dMy'); // '15 janvier 2023'
DateConverters.getDisplayed('2023-01-15', 'W'); // 'Dimanche'

// Description de périodes
const periodDesc = DateConverters.getPeriodDescription(
  '2023-01-01',
  '2023-12-31'
); // '2023'

// Calculs relatifs
const calcDate = DateConverters.getCalcDate('2023-01-15', '1y/-1d', 1); // '2023-12-31'
```

### `datetime.js`

Convertisseur pour les dates et heures combinées, avec support des fuseaux horaires.

**Fonctions principales :**

- `jsToCanonical/canonicalToJs` - Conversion entre formats
- `getDisplayed/getLocaleDisplayed` - Affichage avec/sans fuseau horaire
- `getDisplayedDelta` - Affichage relatif entre deux dates
- `getPeriodDescription` - Description d'une période de temps
- `getMinutesBetweenTwoDatetimes` - Calcule les minutes entre deux dates
- `getDisplayedBetweenToDatetimes` - Affiche la durée entre deux dates

```javascript
const DateTimeConverters = require('xcraft-core-converters/lib/datetime.js');

// Conversion de formats
const now = DateTimeConverters.getNowCanonical();
const displayed = DateTimeConverters.getDisplayed(now); // ex: '15.01.2023 14:30'

// Affichage relatif
const delta = DateTimeConverters.getDisplayedDelta(
  '2023-01-15T12:00:00.000Z',
  now
); // ex: 'Il y a 2 heures'

// Calcul de durées
const minutes = DateTimeConverters.getMinutesBetweenTwoDatetimes(
  '2023-01-15T12:00:00.000Z',
  '2023-01-15T14:30:00.000Z'
); // 150
```

### `delay.js`

Convertisseur pour les délais au format cron (7 champs : secondes, minutes, heures, jour, mois, jour de la semaine, année).

**Fonctions principales :**

- `check(canonical)` - Vérifie si la valeur est un délai cron valide
- `getDisplayed(canonicalDelay)` - Convertit un délai cron en format lisible
- `parseEdited(editedDelay)` - Analyse un délai édité et le convertit en format cron

```javascript
const DelayConverters = require('xcraft-core-converters/lib/delay.js');

// Affichage d'un délai cron
const delay = '* * 4 * * * *';
const displayed = DelayConverters.getDisplayed(delay); // '4h'

// Analyse d'un délai édité
const parsed = DelayConverters.parseEdited('2j 3h 10min');
// parsed.value = '* 10 3 2 * * *'

const parsed2 = DelayConverters.parseEdited('1a');
// parsed2.value = '* * * * * * 1'
```

### `integer.js` et `number.js`

Convertisseurs pour les nombres entiers et à virgule flottante avec formatage et validation.

**Fonctions principales :**

- `check(canonical, strict)` - Vérifie si la valeur est un nombre valide
- `getDisplayed(canonicalNumber, decimals)` - Affiche un nombre formaté
- `parseEdited(editedNumber, minCanonical, maxCanonical)` - Analyse un nombre édité
- `incEdited(edited, cursorPosition, direction, step, min, max)` - Incrémente un nombre édité

```javascript
const NumberConverters = require('xcraft-core-converters/lib/number.js');
const IntegerConverters = require('xcraft-core-converters/lib/integer.js');

// Affichage formaté
const displayed = NumberConverters.getDisplayed(1234.567, 2); // "1'234.57"
const intDisplayed = IntegerConverters.getDisplayed(1234); // "1'234"

// Analyse avec validation
const parsed = NumberConverters.parseEdited("1'234.5", 0, 10000);
// parsed.value = 1234.5

// Incrémentation
const incResult = NumberConverters.incEdited('54.1', 0, 1, 5, 0, 100);
// incResult.edited = '59.1'
```

### `length.js`, `pixel.js`, `volume.js`, `weight.js`

Convertisseurs pour différentes unités de mesure avec conversion automatique.

**Fonctions principales pour les longueurs :**

- `convertLength(value, inputUnit, outputUnit, decimals)` - Convertit entre unités
- `getDisplayed(canonicalLength, displayedUnit)` - Affiche une longueur formatée
- `parseEdited(editedLength, editedUnit)` - Analyse une longueur éditée

**Fonctions principales pour les volumes :**

- `getDisplayed(canonicalVolume, displayedUnit)` - Affiche un volume formaté
- `getDisplayedIATA(canonicalVolume, cm3kg, displayedUnit, decimals)` - Calcule et affiche le poids dimensionnel
- `getCanonicalIATA(canonicalVolume, cm3kg)` - Calcule le poids dimensionnel en kg

**Fonctions principales pour les poids :**

- `convertWeight(value, inputUnit, outputUnit, decimals)` - Convertit entre unités
- `getSortable(weight)` - Génère une représentation triable d'un poids
- `getDisplayed(canonicalWeight, displayedUnit)` - Affiche un poids formaté

```javascript
const LengthConverters = require('xcraft-core-converters/lib/length.js');
const VolumeConverters = require('xcraft-core-converters/lib/volume.js');
const WeightConverters = require('xcraft-core-converters/lib/weight.js');

// Conversion de longueurs
const meters = LengthConverters.convertLength('120', 'cm', 'm'); // '1.2'
const displayed = LengthConverters.getDisplayed('1.2', 'cm'); // '120cm'

// Volumes et poids dimensionnel
const volume = VolumeConverters.getDisplayed('0.12 0.13 1.4', 'cm'); // '12 × 13 × 140 cm'
const iata = VolumeConverters.getDisplayedIATA('1 1 1', 5000, 'kg'); // '200kg'

// Poids
const sortableWeight = WeightConverters.getSortable(1234.56); // '00000012345600'
const weightDisplay = WeightConverters.getDisplayed('1.2', 'g'); // '1200g'
```

### `price.js`

Convertisseur spécialisé pour les prix avec support de différentes précisions et formats d'affichage.

**Fonctions principales :**

- `check(canonical, strict)` - Vérifie si la valeur est un prix valide
- `getSortable(price)` - Génère une représentation triable d'un prix
- `getDisplayed(canonicalPrice, format)` - Affiche un prix formaté
- `parseEdited(editedPrice, minCanonical, maxCanonical)` - Analyse un prix édité
- `incEdited(edited, cursorPosition, direction, step, min, max)` - Incrémente un prix édité

```javascript
const PriceConverters = require('xcraft-core-converters/lib/price.js');

// Affichage formaté
PriceConverters.getDisplayed('1234.5'); // "1 234.50"
PriceConverters.getDisplayed('1234567.89', 'p-1M'); // "1.23 M"
PriceConverters.getDisplayed('0.89', 'p-0.05'); // "0.90" (arrondi au 5 centimes)

// Tri
const sortable = PriceConverters.getSortable(1234.56); // '0000123456'

// Analyse avec validation
const parsed = PriceConverters.parseEdited("1'234.5", '0', '10000');
// parsed.value = '1234.5'
```

### `time.js`

Convertisseur pour les heures avec support de différents formats d'affichage et de manipulation.

**Fonctions principales :**

- `addHours/addMinutes/addSeconds` - Manipulation d'heures
- `getDisplayed(time, format)` - Affiche une heure formatée
- `parseEdited(editedTime, defaultCanonicalTime, minCanonicalTime, maxCanonicalTime, mode)` - Analyse une heure éditée
- `getPeriodDescription(fromTime, toTime, format)` - Description d'une période
- `getTimeFromMinutes/getTotalMinutes` - Conversion entre minutes et format hh:mm:ss
- `getCalcTime(time, exp)` - Calcule une heure relative (ex: '-2h', '10m')
- `incEdited(edited, cursorPosition, direction, step, min, max)` - Incrémente une heure éditée

```javascript
const TimeConverters = require('xcraft-core-converters/lib/time.js');

// Manipulation d'heures
const now = TimeConverters.getNowCanonical();
const later = TimeConverters.addHours(now, 2);

// Affichage formaté
TimeConverters.getDisplayed('14:30:45', 'duration'); // '14h30'
TimeConverters.getDisplayed('01:30:45', 'Hm'); // '1 heure 30'

// Description de périodes
const period = TimeConverters.getPeriodDescription('14:30:00', '16:30:00'); // '14:30 → 16:30'

// Calculs relatifs
const calcTime = TimeConverters.getCalcTime('14:30:00', '-2h'); // '12:30:00'

// Conversion minutes
const totalMinutes = TimeConverters.getTotalMinutes('14:30:00'); // 870
const timeFromMinutes = TimeConverters.getTimeFromMinutes(870); // '14:30:00'
```

### `percent.js`

Convertisseur pour les pourcentages avec support de différentes échelles.

**Fonctions principales :**

- `check(canonical)` - Vérifie si la valeur est un pourcentage valide
- `getDisplayed(canonical, decimals, scale)` - Affiche un pourcentage formaté
- `parseEdited(edited, minCanonical, maxCanonical, scale)` - Analyse un pourcentage édité
- `incEdited(edited, cursorPosition, direction, step, min, max, scale)` - Incrémente un pourcentage édité

```javascript
const PercentConverters = require('xcraft-core-converters/lib/percent.js');

// Affichage (échelle par défaut : 100)
PercentConverters.getDisplayed('0.12'); // '12%'
PercentConverters.getDisplayed('0.1234999', 2); // '12.35%'

// Affichage avec échelle 1
PercentConverters.getDisplayed('12%', undefined, 1); // '12%'

// Analyse
const parsed = PercentConverters.parseEdited('45%'); // {value: '0.45', error: null}
const parsed2 = PercentConverters.parseEdited('12%', undefined, undefined, 1); // {value: '12%', error: null}
```

### Convertisseurs de périodes temporelles

Le module inclut des convertisseurs pour les jours de la semaine, mois, trimestres, semestres et leurs combinaisons avec les années.

```javascript
// Mois
const MonthConverters = require('xcraft-core-converters/lib/month.js');
MonthConverters.getDisplayed(3, 'long'); // 'Mars'
MonthConverters.getDisplayed(3, 'short'); // 'Mars'
MonthConverters.getDisplayed(3, 'one-letter'); // 'M'

// Jours de la semaine
const DowConverters = require('xcraft-core-converters/lib/dow.js');
DowConverters.getDisplayed(1, 'long'); // 'Lundi'
DowConverters.getDisplayed(1, 'short'); // 'Lun'

// Trimestres
const QuarterConverters = require('xcraft-core-converters/lib/quarter.js');
QuarterConverters.getDisplayed(2); // 'Q2'

// Semestres
const SemesterConverters = require('xcraft-core-converters/lib/semester.js');
SemesterConverters.getDisplayed(1, 'long'); // 'Premier semestre'
SemesterConverters.getDisplayed(1, 'number'); // '1'

// Années-semaines
const YearWeekConverters = require('xcraft-core-converters/lib/year-week.js');
YearWeekConverters.getDisplayed('2023-15', 'short'); // '15.23'
YearWeekConverters.getDisplayed('2023-15', 'long'); // '15 - 2023'

// Années-mois
const YearMonthConverters = require('xcraft-core-converters/lib/year-month.js');
YearMonthConverters.getDisplayed('2023-03', 'short'); // '3.23'
YearMonthConverters.getDisplayed('2023-03', 'long'); // 'Mars - 2023'
```

### `reference.js`

Convertisseur pour les références au format client.année-mois.numéro.

**Fonctions principales :**

- `generate(clientNumber, date, number, subnumber)` - Génère une référence
- `getWithoutNumber(canonicalReference)` - Retire le numéro d'une référence
- `updateSubnumber(canonicalReference, subnumber)` - Met à jour le sous-numéro
- `getDisplayed(canonicalReference)` - Affiche une référence formatée

```javascript
const ReferenceConverters = require('xcraft-core-converters/lib/reference.js');

// Génération de référence
const ref = ReferenceConverters.generate('123', '2023-01-15', '1'); // '00123.2301.1'
const refWithSub = ReferenceConverters.generate('123', '2023-01-15', '1', '2'); // '00123.2301.1-2'

// Manipulation
const withoutNumber = ReferenceConverters.getWithoutNumber('00123.2301.1'); // '00123.2301'
const withSubnumber = ReferenceConverters.updateSubnumber('00123.2301.1', '5'); // '00123.2301.1-5'
```

### `field-type-checker.js`

Utilitaire pour valider les types de champs selon leur définition.

**Fonction principale :**

- `check(fieldName, fieldContent, typedef)` - Valide un champ selon sa définition de type

```javascript
const FieldTypeChecker = require('xcraft-core-converters/lib/field-type-checker.js');

// Validation d'un champ string
const result1 = FieldTypeChecker.check('name', 'John Doe', {type: 'string'});
// {ok: true, message: null, color: null, glyph: null}

// Validation d'un champ enum
const result2 = FieldTypeChecker.check('status', 'active', {
  type: 'enum',
  values: ['active', 'inactive'],
});
// {ok: true, message: null, color: null, glyph: null}

// Validation d'un champ entityId
const result3 = FieldTypeChecker.check('userId', 'user@123', {
  type: 'entityId',
  target: 'user',
});
// {ok: true, message: null, color: null, glyph: null}
```

_Cette documentation a été mise à jour automatiquement._

[goblin-laboratory]: https://github.com/Xcraft-Inc/goblin-laboratory
[goblin-desktop]: https://github.com/Xcraft-Inc/goblin-desktop
[goblin-nabu]: https://github.com/Xcraft-Inc/goblin-nabu