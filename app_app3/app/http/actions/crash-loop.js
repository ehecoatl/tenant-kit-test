'use strict';

module.exports = {
  index() {
    // Intentional debug crash path: blocks the isolated app process CPU forever.
    for (;;) {
      Math.sqrt(Date.now());
    }
  }
};

Object.freeze(module.exports);
