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

autodiscover.getEwsUrl('<email_address>', {username: '<username>', password: '<password>'}, function(err, ewsUrl) {
  if (err) {
    throw err;
  }
  console.log(ewsUrl);
});
```

## Limitations

* I only test in Exchange Online

* SCP lookup isn't available

* Doesn't query DNS for an SRV record

## License

See [license](LICENSE) (MIT License).
