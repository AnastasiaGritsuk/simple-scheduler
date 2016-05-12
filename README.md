simple-scheduler
=============

A library providing methods to schedule running of items, include ability to measure time of function execution and delay call.

## Installation

  npm install simple-scheduler

## Usage

  var scheduler = require('simple-scheduler');

  scheduler.scheduleSequence(items, progressFn, continueWith);
  scheduler.measure(fn, continueWith);
  scheduler.delay(period, fn);
 

## Tests

  npm test

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

* 0.0.1 Initial release