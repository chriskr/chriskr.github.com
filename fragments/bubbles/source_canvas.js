class SourceCanvas {
  static get MAX_RADIUS() {
    return 25;
  }

  static get WIDTH() {
    return 5000;
  }

  static get DELTA() {
    return 2 * this.MAX_RADIUS;
  }

  constructor() {
    this.x_ = 0;
    this.y_ = 0;
    this.backupCanvas_ = document.createElement('canvas');
    this.backupCtx_ = this.backupCanvas_.getContext('2d');
    this.backupCanvas_.width = SourceCanvas.WIDTH;
    this.canvas_ = document.createElement('canvas');
    this.ctx_ = this.canvas_.getContext('2d');
    this.canvas_.width = SourceCanvas.WIDTH;
    this.canvas_.height = SourceCanvas.WIDTH;
  }

  get canvas() {
    return this.canvas_;
  }

  get ctx() {
    return this.ctx_;
  }

  getArea() {
    const area = {
      x: this.x_,
      y: this.y_,
      width: SourceCanvas.DELTA,
      height: SourceCanvas.DELTA
    };
    this.x_ += SourceCanvas.DELTA;
    if (this.x_ + SourceCanvas.DELTA > SourceCanvas.WIDTH) {
      this.x_ = 0;
      this.y_ += SourceCanvas.DELTA;
      if (this.y_ + SourceCanvas.DELTA > this.canvas_.height) {
        this.backupCanvas_.height = this.canvas_.height;
        this.backupCtx_.clearRect(
            0, 0, SourceCanvas.WIDTH, this.canvas_.height);
        this.backupCtx_.drawImage(this.canvas_, 0, 0);
        this.canvas_.height += SourceCanvas.WIDTH;
        this.ctx_.clearRect(0, 0, SourceCanvas.WIDTH, this.canvas_.height);
        this.ctx_.drawImage(this.backupCanvas_, 0, 0);
      }
    }
    return area;
  }
}
