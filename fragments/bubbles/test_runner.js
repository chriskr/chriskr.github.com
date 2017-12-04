class TestRunner {
  static get DELTA() {
    return 50;
  }

  static get TRAGET_FRAME_RATE() {
    return 50;
  }

  constructor() {
    this.counter_ = 0;
    this.canvasWidth_ = 0;
    this.canvasHeight_ = 0;
    this.canvas_ = null;
    this.ctx_ = null;
    this.animationsCount_ = 0;
    this.addAnimations_ = null;
    this.sourceCanvas_ = null;
    this.timer_ = new Timer();
    this.onFrame_ = this.onFrame_.bind(this);
    this.beforeFrame_ = this.beforeFrame_.bind(this);
    this.elements_ = new Map([
      '#framerate',
      '#object-count',
      '#type-canvas',
      'h1',
      'body',
      'h1',
      '#legend',
    ].map(selector => [selector, document.querySelector(selector)]));
  }

  start() {
    if (this.elements_.get('#type-canvas').checked) {
      this.setupCanavasTest_();
    } else {
      this.setupElementsTest_();
    }
    this.elements_.get('#legend').className = 'is-running';
  }

  pause() {
    this.timer_.pause();
  }

  continue() {
    this.timer_.start();
  }

  addAnimationsCanvas_(count) {
    this.animationsCount_ += count;
    for (let i = 0; i < count; i++) {
      new Bubble(
          this.timer_, this.canvasWidth_, this.canvasHeight_, this.ctx_,
          this.sourceCanvas_)
          .start();
    }
  }

  addAnimationsElement_(count) {
    this.animationsCount_ += count;
    for (let i = 0; i < count; i++) {
      new EBubble(this.timer_, this.canvasWidth_, this.canvasHeight_).start();
    }
  }

  onFrame_(framerate) {
    if (++this.counter_ > 100) {
      this.elements_.get('#framerate').textContent = framerate;
      this.counter_ = 0;
      if (framerate > TestRunner.TRAGET_FRAME_RATE) {
        this.addAnimations_(TestRunner.DELTA);
        this.elements_.get('#object-count').textContent = this.animationsCount_;
      }
    }
  }

  beforeFrame_() {
    this.ctx_.clearRect(0, 0, this.canvasWidth_, this.canvasHeight_);
  }

  setupCanavasTest_() {
    this.sourceCanvas_ = new SourceCanvas();
    this.elements_.get('h1').textContent += ' canvas';
    this.canvas_ = this.elements_.get('body').insertBefore(
        document.createElement('canvas'),
        this.elements_.get('body').firstChild);
    this.canvas_.width = this.canvasWidth_ = this.canvas_.offsetWidth;
    this.canvas_.height = this.canvasHeight_ = this.canvas_.offsetHeight;
    this.ctx_ = this.canvas_.getContext('2d');
    this.timer_.setBeforeFrame(this.beforeFrame_);
    this.timer_.setOnFrame(this.onFrame_);
    this.addAnimations_ = this.addAnimationsCanvas_;
    this.addAnimations_(TestRunner.DELTA);
  }

  setupElementsTest_() {
    this.elements_.get('h1').textContent += ' elements';
    this.canvasWidth_ = window.innerWidth;
    this.canvasHeight_ = window.innerHeight;
    this.addAnimations_ = this.addAnimationsElement_;
    this.addAnimations_(TestRunner.DELTA);
    this.timer_.setOnFrame(this.onFrame_);
  }
}

