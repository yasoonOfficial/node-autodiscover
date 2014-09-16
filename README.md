Node Autodiscover [![Build Status](https://travis-ci.org/teloo/node-autodiscover.svg?branch=master)](https://travis-ci.org/teloo/node-autodiscover)
=======

A Node.js wrapper for Microsoft Autodiscover

UNDER DEVELOPMENT

## Installation

```shell
$ npm install autodiscover
```

## Usage

```javascript
var autodiscover = require('autodiscover');

autodiscover.getUrl('<email_address>', '<password>', function(err, url) {
  if (err) {
    throw err;
  }
  console.log(url);
});
```

## License

See [license](LICENSE) (MIT License).
