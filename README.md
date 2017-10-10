Node Autodiscover [![Build Status](https://travis-ci.org/teloo/node-autodiscover.svg?branch=master)](https://travis-ci.org/teloo/node-autodiscover)
=======

A Node.js client for Microsoft's POX Autodiscover Service

## Installation

```shell
$ npm install autodiscover
```

## Usage

```javascript
var autodiscover = require('autodiscover');

autodiscover.getPOXAutodiscoverValues('<email_address>', {username: '<username>', password: '<password>'}, function(err, data) {
  if (err) {
    throw err;
  }
  console.log(data);
});
```

## Limitations

* I only test in Exchange Online

* SCP lookup isn't available

* Doesn't query DNS for an SRV record

## License

See [license](LICENSE) (MIT License).
