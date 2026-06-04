// タブ切り替え機能
function switchTab(dayId) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(dayId).classList.add('active');
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('load', () => {
    initRouteMap();
});

function initRouteMap() {
    const mapContainer = document.getElementById('route-map');
    if (!mapContainer || typeof L === 'undefined') {
        return;
    }

    const map = L.map(mapContainer, { scrollWheelZoom: false }).setView([38.6, 141.0], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
    }).addTo(map);

    const routePoints = [
        { name: '仙台駅', coords: [38.2605, 140.8810] },
        { name: '瑞鳳殿', coords: [38.2535, 140.8920] },
        { name: '多賀城Airbnb', coords: [38.3335, 140.9835] },
        { name: '三陸海岸', coords: [38.7411, 141.5682] },
        { name: '東家本店', coords: [39.7036, 141.1527] },
        { name: '花巻温泉', coords: [39.3963, 141.1311] },
        { name: '中尊寺', coords: [39.0088, 141.1253] },
        { name: '仙台駅', coords: [38.2605, 140.8810] }
    ];

    const latlngs = routePoints.map(point => point.coords);
    const polyline = L.polyline(latlngs, { color: '#2a5298', weight: 5, opacity: 0.8 }).addTo(map);

    routePoints.forEach((point, index) => {
        const markerIcon = L.divIcon({
            className: 'numbered-marker',
            html: `<div>${index + 1}</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
        });
        L.marker(point.coords, { icon: markerIcon })
            .addTo(map)
            .bindPopup(`${index + 1}. ${point.name}`);
    });

    map.fitBounds(polyline.getBounds(), { padding: [20, 20] });
    setTimeout(() => map.invalidateSize(), 200);
}

