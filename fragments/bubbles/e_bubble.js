class EBubble extends Bubble {
  constructor(timer, canvasWidth, canvasHeight) {
    super(timer, canvasWidth, canvasHeight);
    const bubble = document.body.insertBefore(
        document.createElement('div'), document.body.firstChild);
    bubble.className = 'bubble';
    bubble.style.padding = `${this.radius_}px`;
    bubble.style.borderRadius = `${this.radius_}px`;
    bubble.style.backgroundColor = this.color_;
    this.style_ = bubble.style;
  }

  strategy() {
    this.style_.left =
        `${this.splineX_.at(this.current_) - this.radius_ | 0}px`;
    this.style_.top = `${- this.splineY_.at(this.current_) | 0}px`;
  }
}
