// =================================================================================
// ВСПОМОГАТЕЛЬНЫЙ КОД
// =================================================================================



let smoother;

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

window.addEventListener('resize', debounce(() => {
  ScrollTrigger.refresh();
}, 200));

const initHomeSlider = () => {
  let homeSlider = new Swiper('.js-home-slider', {
    modules: [SwiperModules.Pagination, SwiperModules.Navigation, SwiperModules.EffectFade, SwiperModules.Autoplay],
    slideClass: "item",
    autoHeight: false,
    slidesPerView: 1,
    setWrapperSize: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    longSwipesMs: 500,
    longSwipesRatio: 0.3,
    pagination: {
      el: '.home__slider-pagination',
      modifierClass: 'pagination__',
      bulletClass: 'pagination__bullet',
      bulletActiveClass: 'is-active',
      clickable: true,
    },
    navigation: {
      prevEl: '.home__slider-navigation--prev',
      nextEl: '.home__slider-navigation--next',
    },
    autoplay: {
      delay: 7000,
    },
  });
};

/**
 * ===================================================================
 * ИНИЦИАЛИЗАЦИЯ КОМПОНЕНТА КОРЗИНЫ В КАРТОЧКЕ ТОВАРА
 * (Счетчик + кнопка "В корзину")
 * ===================================================================
 */
const initCatalogItemBasket = () => {
  const catalogItems = document.querySelectorAll('.catalog__elements-item');

  if (!catalogItems.length) {
    return;
  }

  catalogItems.forEach(item => {
    const button = item.querySelector('.js-basket-button');
    const quantityStepper = item.querySelector('.js-basket-quantity');
    const input = item.querySelector('.basket__quantity-val');
    const btnMinus = item.querySelector('.js-quantity-minus');
    const btnPlus = item.querySelector('.js-quantity-plus');
    
    if (!button || !quantityStepper || !input || !btnMinus || !btnPlus) {
      return;
    }

    const buttonText = button.querySelector('span');
    const buttonIcon = button.querySelector('.icon-basket');

    const switchToActiveState = () => {
      quantityStepper.classList.add('is-active');
      buttonText.textContent = 'Оформить заказ';
      buttonIcon.classList.add('is-hidden');
      button.removeEventListener('click', handleFirstClick);
    };

    const switchToInitialState = () => {
      quantityStepper.classList.remove('is-active');
      buttonText.textContent = 'В корзину';
      buttonIcon.classList.remove('is-hidden');
      button.addEventListener('click', handleFirstClick);
    };

    const handleFirstClick = (event) => {
      event.preventDefault();
      input.value = 1;
      switchToActiveState();
    };

    btnPlus.addEventListener('click', () => {
      input.value = parseInt(input.value, 10) + 1;
    });

    btnMinus.addEventListener('click', () => {
      let currentValue = parseInt(input.value, 10);
      const minValue = parseInt(input.min, 10);

      if (currentValue > minValue) {
        input.value = currentValue - 1;
        if (currentValue - 1 === 0) {
          switchToInitialState();
        }
      }
    });

    button.addEventListener('click', handleFirstClick);
  });
};




let initProductSlider = () => {
  const thumbsEl = document.querySelector('.js-home-thumbs');
  const mainEl = document.querySelector('.js-home-slider');

  if (!thumbsEl || !mainEl) return; 

  const thumbsSlider = new Swiper(thumbsEl, {
    modules: [SwiperModules.Thumbs, SwiperModules.FreeMode],
    slidesPerView: 5,
    spaceBetween: 10,
    freeMode: true,
    watchSlidesProgress: true,
    direction: "vertical",
  });

  const homeSlider = new Swiper(mainEl, {
    modules: [SwiperModules.Pagination, SwiperModules.Navigation, SwiperModules.EffectFade, SwiperModules.Autoplay, SwiperModules.Thumbs],
    slidesPerView: 1,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    thumbs: {
      swiper: thumbsSlider
    }
  });
};


// ===================================================================
// ИНИЦИАЛИЗАЦИЯ ВСЕГО СКРИПТА ПОСЛЕ ЗАГРУЗКИ DOM
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, ScrollSmoother);

  BaseHelpers.checkWebpSupport();
  BaseHelpers.calcScrollbarWidth();
  BaseHelpers.addTouchClass();
  BaseHelpers.addLoadedClass();

  smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.8,
    effects: true,
  });

  Fancybox.bind('[data-fancybox]', {

  });

  new BurgerMenu().init();

  initHomeSlider();
  initCatalogItemBasket();
  initProductSlider()

});

let swiperHowInstance = null;

const initSwiperHow = () => {
  if (window.innerWidth < 992) {
    if (!swiperHowInstance) {
      swiperHowInstance = new Swiper('.news-detal__slider', {
        modules: [SwiperModules.Pagination], 
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });
    }
  } else if (swiperHowInstance) {
    swiperHowInstance.destroy(true, true);
    swiperHowInstance = null;
  }
};

initSwiperHow();
window.addEventListener('resize', initSwiperHow);



let swiperNewsDetal = null;

const swiperDetal = () => {
  if (window.innerWidth < 992) {
    if (!swiperNewsDetal) {
      swiperNewsDetal = new Swiper('.news-detal__big', {
        modules: [SwiperModules.Pagination], 
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });
    }
  } else if (swiperNewsDetal) {
    swiperNewsDetal.destroy(true, true);
    swiperNewsDetal = null;
  }
};

swiperDetal();
window.addEventListener('resize', swiperDetal);


document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.basket__order--btn');
  const aside = document.querySelector('.basket__aside');
  const overlay = document.querySelector('.basket__overlay');
  const closeBtn = document.querySelector('.basket__aside--close');

  if (btn && aside && overlay) {
    const toggleBasket = () => {
      aside.classList.toggle('active');
      overlay.classList.toggle('active');
    }

    btn.addEventListener('click', toggleBasket);
    overlay.addEventListener('click', toggleBasket);

    if (closeBtn) {
      closeBtn.addEventListener('click', toggleBasket);
    }
  }
});

let pageVideoSwipers = [];

const initPageVideoSliders = () => {
  document.querySelectorAll('.page-video__slider').forEach((sliderEl, index) => {
    if (window.innerWidth < 992) {
      if (!pageVideoSwipers[index]) {
        pageVideoSwipers[index] = new Swiper(sliderEl, {
          modules: [SwiperModules.Pagination],
          slidesPerView: 1,
          spaceBetween: 20,
          loop: true,
          pagination: {
            el: sliderEl.querySelector('.swiper-pagination'),
            clickable: true,
          },
        });
      }
    } else {
      if (pageVideoSwipers[index]) {
        pageVideoSwipers[index].destroy(true, true);
        pageVideoSwipers[index] = null;
      }
    }
  });
};

initPageVideoSliders();
window.addEventListener('resize', initPageVideoSliders);



document.querySelectorAll(".detal-slider__container").forEach((sliderEl) => {
  new Swiper(sliderEl, {
    modules: [SwiperModules.Navigation, SwiperModules.Pagination],
    slidesPerView: 1,
    spaceBetween: 20,
    pagination: {
      el: sliderEl.querySelector(".swiper-pagination"),
      clickable: true,
    },
    navigation: {
      nextEl: sliderEl
        .closest(".detal-slider")
        .querySelector(".detal-slider__next"),
      prevEl: sliderEl
        .closest(".detal-slider")
        .querySelector(".detal-slider__prev"),
    },
    breakpoints: {
      768: { slidesPerView: 2, spaceBetween: 15 },
      1400: { slidesPerView: 3, spaceBetween: 20 },
    },
  });
});



const searchOpenBtn = document.querySelector(".header__search");
const searchCloseBtn = document.querySelector(".header-search__close");
const searchModal = document.querySelector(".header-search");
const searchInput = document.querySelector(".header-search input");

if (searchOpenBtn && searchCloseBtn && searchModal) {

  searchOpenBtn.addEventListener("click", (e) => {
    e.preventDefault(); 
    searchModal.classList.add("active");

    if (searchInput) {
      searchInput.focus(); 
    }
  });

  searchCloseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    searchModal.classList.remove("active");
  });

}


const openCallModalBtn = document.querySelector('.button.button-size-lg.button-color--red');

openCallModalBtn.addEventListener('click', (e) => {
  e.preventDefault();

  Fancybox.show([
    {
      src: "#js-nw-modal-call",
      type: "inline",
      focus: "#fullName" 
    }
  ]);
});

const langItems = document.querySelectorAll('.header__lang-item');

langItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault(); 

    langItems.forEach(i => i.classList.remove('is-active'));

    item.classList.add('is-active');
  });
});

document.addEventListener("DOMContentLoaded", () => {
	const searchInput = document.querySelector(".header-mobile__top input");
	const clearBtn = document.querySelector(".header-mobile__top--close");

	if (searchInput && clearBtn) {
		searchInput.addEventListener("input", () => {
			if (searchInput.value.trim() !== "") {
				clearBtn.style.display = "block";
			} else {
				clearBtn.style.display = "none";
			}
		});

		clearBtn.addEventListener("click", () => {
			searchInput.value = "";
			searchInput.focus();
			clearBtn.style.display = "none";
		});
	}
});



function initMenu() {
  const isMobile = window.innerWidth <= 991; 

  const dropdownItems = document.querySelectorAll('.header__menu-item.is-dropdown, .header__submenu li.is-dropdown');

  dropdownItems.forEach(item => {
    const submenu = item.querySelector('.header__submenu');
    const link = item.querySelector('a');

    if (!submenu) return;

    item.replaceWith(item.cloneNode(true));
  });

  if (!isMobile) {
    const dropdownItemsDesktop = document.querySelectorAll('.header__menu-item.is-dropdown, .header__submenu li.is-dropdown');
    dropdownItemsDesktop.forEach(item => {
      const submenu = item.querySelector('.header__submenu');
      const link = item.querySelector('a');

      item.addEventListener('mouseenter', () => {
        submenu.classList.add('show');
        item.classList.add('show');
      });

      item.addEventListener('mouseleave', () => {
        submenu.classList.remove('show');
        item.classList.remove('show');
      });
    });
  } else {
   const menuLinks = document.querySelectorAll('.header__menu-item.is-dropdown > a, .header__submenu li.is-dropdown > a');

    menuLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const submenu = this.nextElementSibling;
        if (!submenu) return;

        submenu.classList.toggle('show'); 
        this.classList.toggle('active');  
      });
    });

    const backButtons = document.querySelectorAll('.submenu-back ');

    backButtons.forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const submenu = this.closest('.header__submenu');
        submenu.classList.remove('show');
      });
    });
  }
}


window.addEventListener('load', initMenu);
window.addEventListener('resize', initMenu); 


document.addEventListener("DOMContentLoaded", () => {
	const burger = document.querySelector(".js-burger-menu");
	const mobileMenu = document.querySelector(".header__mobile");

	if (burger && mobileMenu) {
		burger.addEventListener("click", () => {
			mobileMenu.classList.toggle("is-active");
			burger.classList.toggle("is-active");
		});
	}
});

document.addEventListener("scroll", function () {
  const pageTop = window.scrollY; 
  const pageBottom = pageTop + window.innerHeight; 
  const tags = document.querySelectorAll(".fadein");

  tags.forEach(tag => {
    const tagTop = tag.getBoundingClientRect().top + window.scrollY; 

    if (tagTop < pageBottom) {
      tag.classList.add("visible");
    } else {
      tag.classList.remove("visible");
    }
  });
});