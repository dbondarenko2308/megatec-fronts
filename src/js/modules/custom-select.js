const CLASS_NAME_SELECT = 'select';
const CLASS_NAME_ACTIVE = 'select-show';
const CLASS_NAME_SELECTED = 'select-option-selected';
const SELECTOR_ACTIVE = '.select-show';
const SELECTOR_DATA = '[data-select]';
const SELECTOR_DATA_TOGGLE = '[data-select="toggle"]';
const SELECTOR_OPTION_SELECTED = '.select-option-selected';
class CustomSelect {
  constructor(target, params) {
    this._elRoot = typeof target === 'string' ? document.querySelector(target) : target;
    this._params = params || {};
    if (this._params['options']) {
      this._elRoot.classList.add(CLASS_NAME_SELECT);
      this._elRoot.innerHTML = CustomSelect.template(this._params);
    }
    this._elToggle = this._elRoot.querySelector(SELECTOR_DATA_TOGGLE);
    this._elRoot.addEventListener('click', this._onClick.bind(this));
  }
  _onClick(e) {
    const target = e.target;

    let selectorDataItem = target.closest(SELECTOR_DATA);
    if (!selectorDataItem) {
        return;
    }

    const type = selectorDataItem.dataset.select;
    switch (type) {
      case 'toggle':
        this.toggle();
        break;
      case 'option':
        this._changeValue(target);
        break;
    }
  }
  _update(option) {
    const selected = this._elRoot.querySelector(SELECTOR_OPTION_SELECTED);
    if (selected) {
      selected.classList.remove(CLASS_NAME_SELECTED);
    }
    //при изменении начинки при помощи js
    if(!this._elRoot.contains(this._elToggle)) {
      this._elToggle = this._elRoot.querySelector(SELECTOR_DATA_TOGGLE);
    }
    option.classList.add(CLASS_NAME_SELECTED);
    this._elToggle.textContent = option.textContent;
    this._elToggle.value = option.dataset['value'];
    this._elToggle.dataset.index = option.dataset['index'];
    this._elRoot.dispatchEvent(new CustomEvent('select.change'));
    this._params.onSelected ? this._params.onSelected(this, option) : null;
    return option.dataset['value'];
  }
  _reset() {
    const selected = this._elRoot.querySelector(SELECTOR_OPTION_SELECTED);
    if (selected) {
      selected.classList.remove(CLASS_NAME_SELECTED);
    }
    this._elToggle.textContent = 'Выберите из списка';
    this._elToggle.value = '';
    this._elToggle.dataset.index = -1;
    this._elRoot.dispatchEvent(new CustomEvent('select.change'));
    this._params.onSelected ? this._params.onSelected(this, null) : null;
    return '';
  }
  _changeValue(option) {
    if (option.classList.contains(CLASS_NAME_SELECTED)) {
      this.hide();
    }
    this._update(option);
    this.hide();
  }
  show() {
    document.querySelectorAll(SELECTOR_ACTIVE).forEach(select => {
      select.classList.remove(CLASS_NAME_ACTIVE);
    });
    this._elRoot.classList.add(CLASS_NAME_ACTIVE);
  }
  hide() {
    this._elRoot.classList.remove(CLASS_NAME_ACTIVE);
  }
  toggle() {
    if (this._elRoot.classList.contains(CLASS_NAME_ACTIVE)) {
      this.hide();
    } else {
      this.show();
    }
  }
  dispose() {
    this._elRoot.removeEventListener('click', this._onClick);
  }
  get value() {
    return this._elToggle.value;
  }
  set value(value) {
    let isExists = false;
    this._elRoot.querySelectorAll('.select-option').forEach((option) => {
      if (option.dataset['value'] === value) {
        isExists = true;
        return this._update(option);
      }
    });
    if (!isExists) {
      return this._reset();
    }
  }
  get selectedIndex() {
    return this._elToggle.dataset['index'];
  }
  set selectedIndex(index) {
    const option = this._elRoot.querySelector(`.select-option[data-index="${index}"]`);
    if (option) {
      return this._update(option);
    }
    return this._reset();
  }
}
CustomSelect.template = params => {
  const name = params['name'];
  const options = params['options'];
  const targetValue = params['targetValue'];
  const errorText = params['errorBlock'];
  let items = [];
  let selectedIndex = -1;
  let selectedValue = '';
  let selectedContent = 'Выберите из списка';
  options.forEach((option, index) => {
    let selectedClass = '';
    if (option[0] === targetValue) {
      selectedClass = ' select-option-selected';
      selectedIndex = index;
      selectedValue = option[0];
      selectedContent = option[1];
    }
    items.push(`<li class="select-option${selectedClass}" data-select="option" data-value="${option[0]}" data-index="${index}">${option[1]}</li>`);
  });
  return `<div class="invalid-message">${errorText}</div>
  <div class="select-toggle" name="${name}" value="${selectedValue}" data-select="toggle" data-index="${selectedIndex}">${selectedContent}</div> 
  <div class="select-dropdown">
    <ul class="select-options">${items.join('')}</ul>
  </div>`;
};
document.addEventListener('click', (e) => {
  if (!e.target.closest('.select')) {
    document.querySelectorAll(SELECTOR_ACTIVE).forEach(select => {
      select.classList.remove(CLASS_NAME_ACTIVE);
    });
  }
});

// есть событие DOMContentLoaded, где вызывается initializeSelectIn(document)
// const selects = document.querySelectorAll('.select');
// selects.forEach(el => {
//   new CustomSelect(el);
// })

// Object.prototype.triggerCustomEvent = function (eventName, parameters) {
//     let event; // The custom event that will be created
//     let element = this; // The custom event that will be created
//     if(document.createEvent){
//         // event = document.createEvent("HTMLEvents");
//         event = new CustomEvent(eventName, { detail: parameters });
//         event.initEvent(eventName, true, true);
//         event.eventName = eventName;
//         element.dispatchEvent(event);
//     } else {
//         event = document.createEventObject();
//         event.eventName = eventName;
//         event.eventType = eventName;
//         element.fireEvent("on" + event.eventType, event);
//     }
// };
function triggerCustomEvent(element, eventName, parameters) {
    let event;

    if (typeof CustomEvent === 'function' && typeof element.dispatchEvent === 'function') {
        event = new CustomEvent(eventName, { detail: parameters });
        event.initEvent(eventName, true, true);
        event.eventName = eventName;
        element.dispatchEvent(event);
    } else {
        event = document.createEventObject();
        event.eventName = eventName;
        event.eventType = eventName;
        element.fireEvent("on" + event.eventType, event);
    }
}

function _checkEventTarget(e, selector) {
    let target = null;
    try {
        if (e.target.matches(selector)) {
            target = e.target;
            throw true;
        }
        let parent = e.target.closest(selector);
        if (parent === null) {
            throw false;
        }
        target = parent;
    } catch (e) {
    }
    return target;
}

export function initializeSelectsIn(element)
{
    const customSelects = element.querySelectorAll('.select-custom');
    customSelects.forEach(el => {
        initializeSelect(el);
    })
}

function initializeSelect(wrapper)
{
    let select = wrapper.querySelector('select');
    if (!select) {
        return;
    }
    let selectClasses = select.getAttribute('class');
    let selectRequired = select.getAttribute('required');
    let validation = select.getAttribute('data-field-type-validation');
    let selectErrorMessage = wrapper.querySelector('.invalid-message');
    let selectedOption = select.querySelector('option[selected]');
    let selectedValue = selectedOption ? selectedOption.getAttribute('value') : '';
    let name = select.getAttribute('name');
    let options = [];
    select.querySelectorAll('option').forEach(function (option) {
        options.push([option.getAttribute('value'), option.innerHTML]);
    });
    let params = {
        name: name,
        targetValue: selectedOption ? selectedOption.getAttribute('value') : '',
        options: options,
        errorBlock: selectErrorMessage ? selectErrorMessage.innerText : '',
        onSelected: function (select, option) {
            let wrapper = select._elRoot;
            let input = wrapper.querySelector('input.hidden');
            input.setAttribute('value', option.dataset['value']);
            triggerCustomEvent(input, 'change');
        }
    };
    new CustomSelect(wrapper, params);
    let input = document.createElement('input');
    input.classList.add('hidden');
    if(selectRequired) {
        input.setAttribute('required', 'required');
    }
    if (selectClasses) {
        input.setAttribute('class', selectClasses);
    }
    if (validation) {
        input.setAttribute('data-field-type-validation', validation);
    }
    input.setAttribute('name', name);
    input.setAttribute('value', selectedValue);
    wrapper.prepend(input);
}