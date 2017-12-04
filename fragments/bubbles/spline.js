class Spline {
  constructor(path) {
    this.path_ = path;
    this.cache_ = [];
  }

  get path() {
    return this.path_;
  }

  at(x) {
    if (this.path_.length === 0) {
      return 0;
    }

    if (x > 100) {
      x = 100;
    }

    let source = this.path;
    for (let length = source.length - 1; length != 0; length--) {
      for (let i = 0; i < length; i++) {
        this.cache_[i] = source[i] + x / 100 * (source[i + 1] - source[i]);
      }
      if (source !== this.cache_) {
        source = this.cache_;
      }
    }

    return this.cache_[0];
  }
}