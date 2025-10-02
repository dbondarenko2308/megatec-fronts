export const initContactMaps = () => {

  const contactCards = document.querySelectorAll('.js-contacts-card-item');

  if (!contactCards.length) {
    return;
  }

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

  ymaps.ready(() => {
    contactCards.forEach((card) => {
      const mapContainer = card.querySelector('.js-contacts-card-map');
      const addressElement = card.querySelector('.js-map-address-value');

      if (!mapContainer || !addressElement || !addressElement.dataset.address) {
        if (mapContainer) mapContainer.innerHTML = '<div style="padding: 15px; color: #888;">Адрес не указан.</div>';
        return;
      }

      const address = addressElement.dataset.address;

      ymaps.geocode(address, { results: 1 })
        .then((res) => {
          const firstGeoObject = res.geoObjects.get(0);
          const coords = firstGeoObject.geometry.getCoordinates();
          const preciseAddress = firstGeoObject.getAddressLine();

          const myMap = new ymaps.Map(mapContainer, {
            center: coords,
            zoom: 16,
            controls: ['zoomControl', 'fullscreenControl']
          });

          myMap.behaviors.disable('scrollZoom');

          const iconOptions = getIconOptions(card);

          const myPlacemark = new ymaps.Placemark(coords, {
            balloonContentHeader: card.querySelector('.u-text-h3').textContent || 'Наш адрес',
            balloonContentBody: preciseAddress,
          }, iconOptions);

          myMap.geoObjects.add(myPlacemark);
        })
        .catch((err) => {
          console.error('Ошибка геокодирования:', err);
          mapContainer.innerHTML = `<div style="color: red; text-align: center; padding: 15px;">Не удалось найти адрес: "${address}"</div>`;
        });
    });
  });
};