# bless [![NPM version][npm-image]][npm-url] [![build status][travis-image]][travis-url] [![Dependencies][dependencies-image]][dependencies-url] [![Join the chat at https://gitter.im/BlessCSS/bless][gitter-image]][gitter-url]

Sometimes we can't get away from supporting Internet Explorer 9 and below. Unfortunately, this support can sometimes break our css due to [these limitations](http://blogs.msdn.com/b/ieinternals/archive/2011/05/14/10164546.aspx), and when it does break it is almost impossible to track down. How do you get around such a crippling limitation? Well, you can slap this `bless` on top of your css and you should be alright.

`bless` analyzes your css files' selector counts and splits them appropriately, bringing them under the Internet Explorer's selector limit.

## Installation

To use the cli tools:
```
npm install -g bless
```

To use the public api as part of your package:
```
npm install bless
```

## CLI Usage

```
Commands:
  count   checks an existing css file and fails if the selector count exceeds IE limits
  chunk   breaks up css file into multiple files if it exceeds IE selector limits

Examples:
  blessc count <file|directory>
  blessc count <file|directory> --no-color
  blessc chunk <file|directory>  (chunked files will reside next to input css files with the format *.##.css)
  blessc chunk <file|directory> --out-dir <output directory>
  blessc chunk <file|directory> --sourcemaps (write out sourcemaps for css files with the format *.##.css.map)
```

## API Usage

### `chunk(cssString, [options])`
Separate the cssString into chunks that can be used by IE.
```
options:
  source         the path to the file containing the provided css.
  sourceMaps     a boolean for whether or not to output sourcemaps. source must be provided (defaults to false)

returns:
  data                    An array of css strings for each css chunk
  maps                    An array of css sourcemap strings for each css chunk. This will be empty if source is not provided or sourcemaps is not enabled
  totalSelectorCount      The total number of selectors in the provided css

example:
  var parsedData = chunk(code, { source: './path/to/css.css' });
  parsedCss.data                  //An array of css strings for each css chunk
  parsedCss.maps                  //An array of css sourcemap strings for each css chunk. This is empty if source is empty or sourcemaps is false.
  parsedCss.totalSelectorCount    //The total number of selectors in the provided css file
```

### `chunkFile(filepath, options)`
Separates the provided file into chunks.
```
options:
  sourcemaps      A boolean for whether or not to output sourcemaps. (Defaults to false)

returns:
  A promise object resolving the chunked data with the same properties as chunk()

example:
  chunkfile('./path/to/css.css').then(function(parsedCss, { sourcemaps: true }) {
    parsedCss.data                  //An array of css strings for each css chunk
    parsedCss.maps                  //An array of css sourcemap strings for each css chunk. This will be empty if sourcemaps is false.
    parsedCss.totalSelectorCount    //The total number of selectors in the provided css file
  });
```

## License

See `LICENSE` file.

> Copyright (c) Paul Young

[npm-url]: https://npmjs.org/package/bless
[npm-image]: http://img.shields.io/npm/v/bless.svg

[travis-url]: https://travis-ci.org/BlessCSS/bless
[travis-image]: https://travis-ci.org/BlessCSS/bless.svg?branch=master

[dependencies-url]: https://david-dm.org/BlessCSS/bless
[dependencies-image]: https://david-dm.org/BlessCSS/bless.svg

[gitter-image]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/BlessCSS/bless
