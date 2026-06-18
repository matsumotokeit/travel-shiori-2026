// タブ切り替え機能
function switchTab(dayId) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(dayId).classList.add('active');
    const dayIndex = ['day1', 'day2', 'day3'].indexOf(dayId);
    const btns = document.querySelectorAll('.tab-btn');
    if (dayIndex >= 0 && btns[dayIndex]) btns[dayIndex].classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

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

// 共有機能
function getShareUrl() {
    return window.location.href;
}

function getShareText() {
    return '宮城・岩手 2泊3日 夏旅しおり 2026年8月8日〜10日';
}

function copyUrl() {
    navigator.clipboard.writeText(getShareUrl()).then(() => {
        const toast = document.getElementById('copy-toast');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }).catch(() => {
        const input = document.createElement('input');
        input.value = getShareUrl();
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        const toast = document.getElementById('copy-toast');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    });
}

function initShareLinks() {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(getShareText());

    const lineBtn = document.getElementById('line-share');
    if (lineBtn) lineBtn.href = `https://social-plugins.line.me/lineit/share?url=${url}&text=${text}`;

    const xBtn = document.getElementById('x-share');
    if (xBtn) xBtn.href = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;

    const emailBtn = document.getElementById('email-share');
    if (emailBtn) emailBtn.href = `mailto:?subject=${text}&body=${url}`;
}

function toggleQR() {
    const container = document.getElementById('qr-container');
    const isVisible = container.classList.contains('visible');
    if (isVisible) {
        container.classList.remove('visible');
        return;
    }
    container.classList.add('visible');
    generateQR();
}

function generateQR() {
    const canvas = document.getElementById('qr-canvas');
    const url = getShareUrl();
    const size = 200;
    const modules = qrEncode(url);
    const cellSize = size / modules.length;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#2a5298';
    for (let row = 0; row < modules.length; row++) {
        for (let col = 0; col < modules[row].length; col++) {
            if (modules[row][col]) {
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }
    }
}

// Minimal QR code encoder (version 4, L correction, byte mode)
function qrEncode(data) {
    const qr = new QRCode(4, 'L');
    qr.addData(data);
    qr.make();
    const count = qr.getModuleCount();
    const modules = [];
    for (let r = 0; r < count; r++) {
        modules[r] = [];
        for (let c = 0; c < count; c++) {
            modules[r][c] = qr.isDark(r, c);
        }
    }
    return modules;
}

// Load QR code library dynamically
function loadQRLibrary() {
    return new Promise((resolve, reject) => {
        if (window.QRCode) { resolve(); return; }
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/qrcode-generator@1.4.4/qrcode.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

window.switchTab = switchTab;
window.copyUrl = copyUrl;
window.toggleQR = toggleQR;

// Scroll animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.timeline-item').forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.06}s`;
        observer.observe(el);
    });

    document.querySelectorAll('.map-section, .share-section').forEach(el => {
        observer.observe(el);
    });
}

// Sticky tab shadow
function initStickyTabs() {
    const sticky = document.getElementById('tabs-sticky');
    if (!sticky) return;
    const onScroll = () => {
        sticky.classList.toggle('shadow', sticky.getBoundingClientRect().top <= 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

window.addEventListener('load', () => {
    initRouteMap();
    initShareLinks();
    loadQRLibrary();
    initScrollAnimations();
    initStickyTabs();
});

