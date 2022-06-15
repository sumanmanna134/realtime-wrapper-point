class Config {
  constructor(port) {
    this.PORT = port || 8000;
  }

  load() {
    if (process.env.PORT) {
      this.PORT = process.env.PORT;
    }
  }

  get port() {
    return this.PORT;
  }
}

module.exports = Config;
