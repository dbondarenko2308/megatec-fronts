import { Popup } from '../helpers/popup';

export class BurgerMenu extends Popup {
	constructor() {
		super();

		this.burgerButton = document.querySelector('.icon-menu');
	}

	/**
	 * Initialize the menu functionality.
	 */
	init() {
		if (this.burgerButton) {
			document.addEventListener('click', ({ target }) => {
				if (target.closest('.icon-menu')) {
					this.html.classList.toggle('is-active');
					this.toggleBodyLock(this.isMenuOpen);
				}
			});
		}
	}

	/**
	 * Open the menu.
	 */
	menuOpen() {
		this.toggleBodyLock(true);
		this.html.classList.add('is-active');
	}

	/**
	 * Close the menu.
	 */
	menuClose() {
		this.toggleBodyLock(false);
		this.html.classList.remove('is-active');
	}

	get isMenuOpen() {
		return this.html.classList.contains('menu-open');
	}
}
