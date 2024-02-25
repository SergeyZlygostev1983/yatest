export default class SliderStages {
  constructor() {
    this.$slider = document.querySelector('[data-stages-slider].__active');
    this.$sliderItems = document.querySelectorAll('[data-stages-slider-item]');
    this.$sliderContainer = document.querySelector('[data-stages-slider-container]');
    this.$sliderPaginationBullets = document.querySelector('[data-stages-slider-pagination]');
    this.$sliderNavPrevBtn = document.querySelector('[data-stages-slider-prev]');
    this.$sliderNavNextBtn = document.querySelector('[data-stages-slider-next]');
    this.sliderNavPrev = '[data-stages-slider-prev]';
    this.sliderNavNext = '[data-stages-slider-next]';
    this.slideWidth = this.$slider.offsetWidth;
    this.sliderWidth = 0;
    this.slideCurrent = 1;
    this.touchStart = 0;
    this.touchEnd = 0;
    this.touchOffset = 0;
    this.perSlide = 2;
    this.offsetSlide = this.$sliderItems.length;
    this.sliderActive = document.querySelector('[data-stages-slider].__active');

    this.init();
  }

  init() {
    if (this.sliderActive) {
      this.calcSlideWidth();
      this.drowPaginationBullets();

      window.addEventListener('click', event => this.handlerClick(event));
      window.addEventListener('keydown', event => this.handlerClick(event));
      this.$slider.addEventListener('touchstart', event => this.slideStart(event));
      this.$slider.addEventListener('touchend', event => this.slideEnd(event));

      window.addEventListener('resize', () => this.calcSlideWidth());
    }
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
    }

    this.$sliderContainer.style.transition = 'transform 1s ease';
    this.disableBtns();
    this.setActiveBullet();
    this.moveSlides();
  }

  getPrevSlide() {
    if (this.slideCurrent > 1) {
      this.slideCurrent--;
    }

    this.$sliderContainer.style.transition = 'transform 1s ease';
    this.disableBtns();
    this.setActiveBullet();
    this.moveSlides();
  }

  moveSlides() {
    this.$sliderContainer.style.transform = `translateX(-${(this.slideCurrent - 1) * this.slideWidth}px)`;
  }

  eventType(event) {
    return event.type.search('touch') !== -1 ? event.touches[0] : event
  }

  drowPaginationBullets() {
    this.$sliderPaginationBullets.innerHTML = '';
    for (let i = 0; i < Math.ceil(this.offsetSlide / this.perSlide); i++) {
      const bullet = document.createElement('div');
      bullet.className = (i === 0) ? 'stages__slider-bullet __active' : 'stages__slider-bullet';
      this.$sliderPaginationBullets.insertAdjacentElement('beforeend', bullet);
    }
  }

  setActiveBullet() {
    document.querySelectorAll('.stages__slider-bullet').forEach((bullet, i) => {
        bullet.classList.remove('__active');
        if ((i+1) == this.slideCurrent) {
            bullet.classList.add('__active');
        }
    });
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
    if (window.innerWidth > 1024) {
      this.removeSlider();
    } else {
      if (window.innerWidth <= 730) {
        this.perSlide = 1;
      } else if (window.innerWidth > 730 && window.innerWidth <= 1024) {
        this.perSlide = 2;
      } else {
        return;
      }

      this.slideWidth = document.querySelector('[data-stages-slider].__active').offsetWidth;
      this.sliderWidth = this.slideWidth / this.perSlide;
      this.$sliderContainer.style.width = this.sliderWidth + 'px';
      this.$sliderItems.forEach(sliderItem => {
        sliderItem.style.width = this.sliderWidth + 'px';
      })

      this.$sliderContainer.style.transition = 'unset';

      this.disableBtns();
      this.drowPaginationBullets();
      this.moveSlides();
    }
  }

  disableBtns() {
    if (this.slideCurrent === Math.ceil(this.offsetSlide / this.perSlide)) {
      this.$sliderNavNextBtn.classList.add('__disabled');
    } else {
      this.$sliderNavNextBtn.classList.remove('__disabled');
    }
    if (this.slideCurrent === 1) {
      this.$sliderNavPrevBtn.classList.add('__disabled');
    } else {
      this.$sliderNavPrevBtn.classList.remove('__disabled');
    }
  }

  removeSlider() {
    this.$sliderContainer.style.width = '100%';
    this.$sliderContainer.style.transform = 'none';
    this.$sliderItems.forEach(sliderItem => {
      sliderItem.style.width = '100%';
    })
  }
}