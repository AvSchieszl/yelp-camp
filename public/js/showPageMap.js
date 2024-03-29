mapboxgl.accessToken = mapBoxToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 8 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

const marker1 = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 30 })
            .setHTML(
                `<h5>${campground.title}</h4>`
            )
    )
    .addTo(map);