# Fixture Files [![Build Status](https://travis-ci.org/silas/node-fixturefiles.svg?branch=master)](https://travis-ci.org/silas/node-fixturefiles)

Simple Node.js module to load fixture files.

## Usage

``` console
$ npm install fixturefiles
$ mkdir -p ./test/fixtures
$ echo '{"hello":"world"}' > ./test/fixtures/hello.json
$ node -e 'console.log(require("fixturefiles").hello)'
{ hello: 'world' }
```

## License

This work is licensed under the MIT License (see the LICENSE file).
