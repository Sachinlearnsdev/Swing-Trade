class RateLimiter {
  constructor(callsPerMinute = 60) {
    this.callsPerMinute = callsPerMinute;
    this.delay = (60 * 1000) / callsPerMinute; // milliseconds between calls
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async execute(fn) {
    const result = await fn();
    await this.sleep(this.delay);
    return result;
  }

  async executeBatch(items, fn, batchSize = 10) {
    const results = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(items.length / batchSize)}`);
      
      const batchResults = await Promise.all(
        batch.map(item => this.execute(() => fn(item)))
      );
      
      results.push(...batchResults);
    }
    
    return results;
  }
}

module.exports = RateLimiter;