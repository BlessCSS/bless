# css-band-aid [![NPM version][npm-image]][npm-url] [![build status][travis-image]][travis-url] [![Dependencies][dependencies-image]][dependencies-url] [![Join the chat at https://gitter.im/css-band-aid/css-band-aid][gitter-image]][gitter-url]

This is a fork of [Bless](http://blesscss.com). 

Sometimes we can't get away from supporting Internet Explorer 9 and below. Unfortunately, this support can sometimes break our css due to [these limitations](http://blogs.msdn.com/b/ieinternals/archive/2011/05/14/10164546.aspx), and when it does break it is almost impossible to track down. How do you get around such a crippling limitation? Well, you can slap this `css-band-aid` on top of your css and you should be alright.

`css-band-aid` analyzes your css files' selector counts and splits them appropriately, bringing them under the Internet Explorer's selector limit.

## Installation

To use the cli tools:
```
npm install -g css-band-aid
```

To use the public api as part of your package:
```
npm install css-band-aid
```

## CLI Usage

```
Commands:
  count   checks an existing css file and fails if the selector count exceeds IE limits
  chunk   breaks up css file into multiple files if it exceeds IE selector limits

Examples:
  bandaid count <file|directory>
  bandaid count <file|directory> --no-color
  bandaid chunk <file|directory>  (chunked files will reside next to input css files with the format *.##.css)
  bandaid chunk <file|directory> --out-dir <output directory>
```

## API Usage

### `chunk(cssString, [options])`
Separate the cssString into chunks that can be used by IE.
```
options:
  souce   the path to the file containing the provided css.

returns:
  data                    An array of css strings for each css chunk
  totalSelectorCount      The total number of selectors in the provided css

example:
  var parsedData = chunk(code, { source: './path/to/css.css' });
  parsedCss.data                  //An array of css strings for each css chunk
  parsedCss.totalSelectorCount    //The total number of selectors in the provided css file
```

### `chunkFile(filepath)`
Separates the provided file into chunks.
```
returns:
  A promise object resolving the chunked data with the same properties as chunk()

example:
  chunkfile('./path/to/css.css').then(function(parsedCss) {
    parsedCss.data                  //An array of css strings for each css chunk
    parsedCss.totalSelectorCount    //The total number of selectors in the provided css file
  });
```

## License

See `LICENSE` file.

> Copyright (c) Paul Young

> Copyright (c) Css-Band-Aid

[npm-url]: https://npmjs.org/package/css-band-aid
[npm-image]: http://img.shields.io/npm/v/css-band-aid.svg

[travis-url]: https://travis-ci.org/css-band-aid/css-band-aid
[travis-image]: https://travis-ci.org/css-band-aid/css-band-aid.svg?branch=master

[dependencies-url]: https://david-dm.org/css-band-aid/css-band-aid
[dependencies-image]: https://david-dm.org/css-band-aid/css-band-aid.svg

[gitter-image]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/css-band-aid/css-band-aid
