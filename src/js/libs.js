// =================================================================================
// ИМПОРТ БИБЛИОТЕК И МОДУЛЕЙ
// =================================================================================

// --- GSAP ---
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin.js';
import { ScrollSmoother } from 'gsap/ScrollSmoother.js';

// --- Swiper ---
import Swiper from 'swiper';
import { Navigation, Pagination, EffectFade, FreeMode, Autoplay, Manipulation, Thumbs } from 'swiper/modules';

// --- Fancybox ---
import { Fancybox } from '@fancyapps/ui';

// --- IMask ---
import IMask from 'imask';

// --- Вспомогательные модули и классы ---
import { BaseHelpers } from './helpers/base-helpers';
import { BurgerMenu } from './modules/burger-menu';
import { initializeSelectsIn } from './modules/custom-select.js';

window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;
window.ScrollToPlugin = ScrollToPlugin;
window.ScrollSmoother = ScrollSmoother;
window.Swiper = Swiper;
window.SwiperModules = {
  Navigation,
  Pagination,
  EffectFade,
  FreeMode,
  Autoplay,
  Manipulation,
  Thumbs
};
window.Fancybox = Fancybox;
window.IMask = IMask;
window.BaseHelpers = BaseHelpers;
window.BurgerMenu = BurgerMenu;
window.initializeSelectsIn = initializeSelectsIn;