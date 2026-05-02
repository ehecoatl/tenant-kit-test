'use strict';

const v8 = require(`node:v8`);

const allocations = [];
const CHUNK_CHARS = 512 * 1024;
const YIELD_EVERY_CHUNKS = 4;

module.exports = {
  async index() {
    // Intentional debug crash path: grows JS heap beyond the V8 old-space limit.
    const targetHeapUsed = v8.getHeapStatistics().heap_size_limit;
    let chunkIndex = 0;
    while (process.memoryUsage().heapUsed < targetHeapUsed) {
      allocations.push(`${chunkIndex}:${`x`.repeat(CHUNK_CHARS)}`);
      chunkIndex += 1;
      if (chunkIndex % YIELD_EVERY_CHUNKS === 0) {
        await new Promise((resolve) => setImmediate(resolve));
      }
    }
    return { ok: false, reason: `v8_heap_limit_not_reached` };
  }
};

Object.freeze(module.exports);
