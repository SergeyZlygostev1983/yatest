export default class SliderParticipants {
  constructor() {
    this.$slider = document.querySelector('[data-participants-slider]');
    this.$sliderItems = document.querySelectorAll('[data-participants-slider-item]');
    this.$sliderContainer = document.querySelector('[data-participants-slider-container]');
    this.$sliderNavPrevBtn = document.querySelector('[data-participants-slider-prev]');
    this.$sliderNavNextBtn = document.querySelector('[data-participants-slider-next]');
    this.sliderNavPrev = '[data-participants-slider-prev]';
    this.sliderNavNext = '[data-participants-slider-next]';
    this.slideWidth = this.$slider.offsetWidth;
    this.sliderWidth = 0;
    this.slideCurrent = 1;
    this.slideInterval = 4000;
    this.slideAutoPlay = setInterval(() => this.getNextSlide(), this.slideInterval);
    this.touchStart = 0;
    this.touchEnd = 0;
    this.touchOffset = 0;
    this.perSlide = 3;
    this.offsetSlide = this.$sliderItems.length;
    this.sliderCouter = document.querySelector('[data-participants-slider-counter]');

    this.init();
  }

  init() {
    this.calcSlideWidth();

    window.addEventListener('click', event => this.handlerClick(event));
    window.addEventListener('keydown', event => this.handlerClick(event));
    this.$slider.addEventListener('touchstart', event => this.slideStart(event));
    this.$slider.addEventListener('touchend', event => this.slideEnd(event));

    window.addEventListener('resize', () => this.calcSlideWidth());
  }

  handlerClick(event) {
    if (event.target.closest(this.sliderNavPrev)) {
      this.getPrevSlide();
    }
    if (event.target.closest(this.sliderNavNext)) {
      this.getNextSlide();
    }
    if (event.keyCode == 37) {
      this.getPrevSlide();
    }
    if (event.keyCode == 39) {
      this.getNextSlide();
    }
    this.$slider.removeEventListener('click', event => this.handlerClick(event));
  }

  getNextSlide() {
    if (this.slideCurrent < Math.ceil(this.offsetSlide / this.perSlide)) {
      this.slideCurrent++;
    } else {
      this.slideCurrent = 1;
    }

    const counterStart = this.slideCurrent * this.perSlide > this.offsetSlide ? this.offsetSlide : this.slideCurrent * this.perSlide;
    this.calcSliderCounter(counterStart, this.offsetSlide);

    this.$sliderContainer.style.transition = 'transform 1s ease';
    this.moveSlides();
    this.restartSlideAutoplay();
  }

  getPrevSlide() {
    if (this.slideCurrent > 1) {
      this.slideCurrent--;
    } else {
      this.slideCurrent = Math.ceil(this.offsetSlide / this.perSlide);
    }

    const counterStart = this.slideCurrent * this.perSlide > this.offsetSlide ? this.offsetSlide : this.slideCurrent * this.perSlide;
    this.calcSliderCounter(counterStart, this.offsetSlide);

    this.$sliderContainer.style.transition = 'transform 1s ease';
    this.moveSlides();
    this.restartSlideAutoplay();
  }

  moveSlides() {
    this.$sliderContainer.style.transform = `translateX(-${(this.slideCurrent - 1) * this.slideWidth}px)`;
  }

  eventType(event) {
    return event.type.search('touch') !== -1 ? event.touches[0] : event
  }

  restartSlideAutoplay() {
    clearInterval(this.slideAutoPlay);
    this.slideAutoPlay = setInterval(() => this.getNextSlide(), this.slideInterval);
  }

  slideStart(event) {
    this.touchStart = event.touches[0].clientX;
  }

  slideEnd(event) {
    this.touchEnd = event.changedTouches[0].clientX;
    this.touchOffset = this.touchEnd - this.touchStart;
    if (Math.abs(this.touchOffset) > 30) {
      if (this.touchOffset < 0) {
        this.getNextSlide();
      } else {
        this.getPrevSlide();
      }
    }
  }

  calcSlideWidth() {
    if (window.innerWidth <= 730) {
      this.perSlide = 1;
    } else if (window.innerWidth > 730 && window.innerWidth < 1024) {
      this.perSlide = 2;
    } else {
      this.perSlide = 3;
    }

    this.slideWidth = document.querySelector('[data-participants-slider]').offsetWidth;
    this.sliderWidth = this.slideWidth / this.perSlide;
    this.$sliderContainer.style.width = this.sliderWidth + 'px';
    this.$sliderItems.forEach(sliderItem => {
      sliderItem.style.width = this.sliderWidth + 'px';
    })

    this.$sliderContainer.style.transition = 'unset';

    this.calcSliderCounter(this.perSlide, this.offsetSlide);
    this.moveSlides();
  }

  calcSliderCounter(counertStart, counterEnd) {
    this.sliderCouter.innerHTML = `<span>${counertStart}</span><span class="counter-slash">/</span><span>${counterEnd}</span>`;
  }
}