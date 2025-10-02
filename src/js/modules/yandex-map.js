export const initYandexMap = () => {
  const mapContainer = document.querySelector('.js-map-init');
  if (!mapContainer) {
    return;
  }

  const addressItems = document.querySelectorAll('.js-map-switch-item');
  if (!addressItems.length) {
    mapContainer.innerHTML = '<div style="padding: 20px;">Нет адресов для отображения на карте.</div>';
    return;
  }

  ymaps.ready(() => {
    let myMap;
    let myPlacemark;

    const getIconOptions = (element) => {
      const path = element.dataset.iconPath;
      const size = element.dataset.iconSize;
      const offset = element.dataset.iconOffset;

      if (path && size && offset) {
        return {
          iconLayout: 'default#image',
          iconImageHref: path,
          iconImageSize: size.split(',').map(Number),
          iconImageOffset: offset.split(',').map(Number),
        };
      }
      return {
        preset: 'islands#redDotIconWithCaption'
      };
    };

    const updateMap = (address, iconOptions) => {
      if (!address) {
        console.warn('Передан пустой адрес, обновление карты отменено.');
        return;
      }
      ymaps.geocode(address, { results: 1 })
        .then((res) => {
          const firstGeoObject = res.geoObjects.get(0);
          const coords = firstGeoObject.geometry.getCoordinates();
          const preciseAddress = firstGeoObject.getAddressLine();

          if (!myMap) {
            myMap = new ymaps.Map(mapContainer, {
              center: coords,
              zoom: 15,
              controls: ['zoomControl', 'fullscreenControl']
            });
            myMap.behaviors.disable('scrollZoom');
            myPlacemark = new ymaps.Placemark(coords, {
              balloonContentHeader: 'Наш адрес',
              balloonContentBody: preciseAddress,
            }, iconOptions);
            myMap.geoObjects.add(myPlacemark);
          } else {
            myMap.panTo(coords, { flying: true, duration: 800 });
            myPlacemark.geometry.setCoordinates(coords);
            myPlacemark.properties.set('balloonContentBody', preciseAddress);
            myPlacemark.options.set(iconOptions);
          }
        })
        .catch((err) => {
          console.error('Ошибка геокодирования:', err);
          mapContainer.innerHTML = `<div style="color: red; text-align: center; padding: 20px;">Не удалось определить местоположение по адресу: ${address}</div>`;
        });
    };

    const firstValidItem = Array.from(addressItems).find(item => item.querySelector('.js-map-address-value[data-address]'));

    if (firstValidItem) {
      const firstAddressElement = firstValidItem.querySelector('.js-map-address-value');
      const firstAddress = firstAddressElement.dataset.address;
      const firstIconOptions = getIconOptions(firstValidItem);

      updateMap(firstAddress, firstIconOptions);
      firstValidItem.classList.add('is-active');
    } else {
      console.error('Не найдено ни одного валидного блока с data-address для инициализации карты.');
      mapContainer.innerHTML = '<div style="padding: 20px;">Нет адресов для отображения на карте.</div>';
      return;
    }

    if (addressItems.length > 1) {
      addressItems.forEach((item) => {
        item.addEventListener('click', (e) => {
          const currentItem = e.currentTarget;
          const addressValueElement = currentItem.querySelector('.js-map-address-value');

          if (!addressValueElement || !addressValueElement.dataset.address) {
            return;
          }

          addressItems.forEach(el => el.classList.remove('is-active'));
          currentItem.classList.add('is-active');

          const newAddress = addressValueElement.dataset.address;
          const newIconOptions = getIconOptions(currentItem);
          updateMap(newAddress, newIconOptions);
        });
      });
    } else if (firstValidItem) {
      firstValidItem.style.cursor = 'default';
    }
  });
};