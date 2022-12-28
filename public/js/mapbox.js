export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibW9sYXljdWxlIiwiYSI6ImNsYXl2OG1sbzAybGQzdm4ycmtnbnJqbWoifQ.vasAxRjZseLvd9XE2mMcxA';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/molaycule/clb303gnv000b14p8o0yg7o2p',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // add popup
    new mapboxgl.Popup({
      offset: 30,
      focusAfterOpen: false,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // extends map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
