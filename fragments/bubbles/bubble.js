class Bubble extends Animation {
  static get MIN_RADIUS() {
    return 2;
  }

  constructor(timer, canvasWidth, canvasHeight, ctx = null, source = null) {
    super(timer);
    this.ctx_ = ctx;

    this.srcCanvas_ = null;
    this.sourceCtx_ = null;
    this.srcX_ = 0;
    this.srcY_ = 0;
    this.srcWidth_ = 0;
    this.srcHeight_ = 0;
    this.radius_ = this.getRandomRadius_(canvasWidth);
    this.canvasWidth_ = canvasWidth - 2 * this.radius_;
    this.amplitude_ = canvasHeight - 2 * this.radius_;
    this.color_ = this.getRandomColor_();
    this.splineX_ = new Spline([0, this.canvasWidth_ * Math.random()]);
    this.splineY_ = new Spline([0, 0, 0]);
    this.onfinish = this.start;
    this.createBubble_(source);
  }

  getRandomRadius_(canvasWidth) {
    const maxRadius = 5 +
            Math.pow(canvasWidth / window.screen.width, .5) *
                (SourceCanvas.MAX_RADIUS - 5) |
        0;
    const randRadius = (1 / Math.pow(5 - Math.random() * 4, 2)) *
        (maxRadius - Bubble.MIN_RADIUS);
    return Bubble.MIN_RADIUS + randRadius | 0;
  }

  getRandomColor_() {
    return `hsl(${Math.random() * 360 | 0}, 100%, 50%)`;
  }

  createBubble_(source) {
    if (source === null) {
      return;
    }
    this.srcCanvas_ = source.canvas;
    this.sourceCtx_ = source.ctx;
    const area = source.getArea();
    this.srcX_ = area.x;
    this.srcY_ = area.y;
    this.srcWidth_ = 2 * this.radius_;
    this.srcHeight_ = 2 * this.radius_;
    this.sourceCtx_.fillStyle = this.color_;
    this.sourceCtx_.beginPath();
    this.sourceCtx_.arc(
        area.x + this.radius_, area.y + this.radius_, this.radius_, 0,
        Math.PI * 2, true);
    this.sourceCtx_.fill();
  }

  strategy() {
    const x = this.splineX_.at(this.current_) | 0;
    const y = -(this.splineY_.at(this.current_) | 0);
    this.ctx_.drawImage(
        this.srcCanvas_, this.srcX_, this.srcY_, this.srcWidth_,
        this.srcHeight_, x, y, this.srcWidth_, this.srcHeight_);
  }

  start() {
    const height = this.amplitude_ * (2 / (Math.pow(5 - Math.random() * 4, 3)));
    this.timeDelta_ = .2 * Math.pow(this.amplitude_ / height, 0.5);
    this.splineX_.path[0] = this.splineX_.path[1];
    const x = this.splineX_.path[0];
    let delta = (height / (this.amplitude_ * 2)) *
            Math.max(x, this.canvasWidth_ - x) * Math.random() |
        0;
    delta *= Math.random() > .5 ? 1 : -1;
    if ((x + delta) <= 0 || (x + delta) >= this.canvasWidth_) {
      delta *= -1;
    }
    this.splineX_.path[1] = x + delta;
    this.splineY_.path[1] = -height;
    this.run();
  }
}
