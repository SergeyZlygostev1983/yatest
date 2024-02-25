import '../css/style.scss';
import Main from './main';
import SliderParticipants from './slider_participants';
import SliderStages from './slider_stages';

function ready() {
  const commonScripts = new Main();
  const sliderParticipants = new SliderParticipants();

  calcScreenWidth();
}

function calcScreenWidth() {
  let sliderStages = {};

  if (window.innerWidth <= 1024) {
    document.querySelector('[data-stages-slider]').classList.add('__active');
    sliderStages.instance = new SliderStages();
  } else {
    sliderStages.instance = null;
    document.querySelector('[data-stages-slider]').classList.remove('__active');
  }
}

document.addEventListener("DOMContentLoaded", ready);
window.addEventListener('resize', () => calcScreenWidth());