const routeMaps = {};

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

    setTimeout(() => {
        const map = routeMaps[dayId];
        if (map) map.invalidateSize();
    }, 250);
}

function initRouteMaps() {
    if (typeof L === 'undefined') return;

    const routes = {
        day1: {
            color: '#4a6fa5',
            maxZoom: 12,
            points: [
                { name: '仙台駅 集合', coords: [38.2605, 140.8810], time: '11:00' },
                { name: '仙台牛タン ランチ', coords: [38.2605, 140.8798], time: '12:00' },
                { name: '瑞鳳殿', coords: [38.2535, 140.8669], time: '14:00' },
                { name: '仙台七夕まつり', coords: [38.2657, 140.8719], time: '17:00' },
                { name: '多賀城 Airbnb', coords: [38.2931, 140.9948], time: '21:00' }
            ]
        },
        day2: {
            color: '#e0694e',
            maxZoom: 8,
            points: [
                { name: '多賀城 出発', coords: [38.2931, 140.9948], time: '09:00' },
                { name: '気仙沼周辺', coords: [38.9080, 141.5700], time: '11:00' },
                { name: '三陸海岸ドライブ', coords: [39.0180, 141.6300], time: '13:00' },
                { name: '西行戻しの松公園', coords: [38.3719, 141.0724], time: '15:00' },
                { name: '東家本店', coords: [39.7036, 141.1527], time: '17:00' },
                { name: '花巻温泉', coords: [39.3963, 141.1311], time: '18:30' }
            ]
        },
        day3: {
            color: '#2f8f83',
            maxZoom: 8,
            points: [
                { name: '花巻温泉 出発', coords: [39.3963, 141.1311], time: '09:00' },
                { name: '中尊寺・金色堂', coords: [39.0088, 141.1253], time: '09:30' },
                { name: '平泉ランチ', coords: [38.9867, 141.1139], time: '10:30' },
                { name: '仙台駅 到着', coords: [38.2605, 140.8810], time: '15:00' }
            ]
        }
    };

    Object.entries(routes).forEach(([dayId, route]) => {
        const container = document.getElementById(`route-map-${dayId}`);
        if (!container) return;

        const map = L.map(container, {
            scrollWheelZoom: false,
            zoomControl: false
        });

        L.control.zoom({ position: 'bottomright' }).addTo(map);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 18,
        }).addTo(map);

        const latlngs = route.points.map(point => point.coords);
        const polyline = L.polyline(latlngs, {
            color: route.color,
            weight: 5,
            opacity: 0.82,
            lineCap: 'round',
            lineJoin: 'round'
        }).addTo(map);

        route.points.forEach((point, index) => {
            const markerIcon = L.divIcon({
                className: 'numbered-marker',
                html: `<div style="background-color: ${route.color};">${index + 1}</div>`,
                iconSize: [36, 36],
                iconAnchor: [18, 36],
                popupAnchor: [0, -34]
            });

            L.marker(point.coords, { icon: markerIcon })
                .addTo(map)
                .bindPopup(`<strong>${point.time}</strong><br>${point.name}`, {
                    maxWidth: 240,
                    className: 'route-popup'
                });
        });

        map.fitBounds(polyline.getBounds(), {
            padding: [34, 34],
            maxZoom: route.maxZoom
        });
        routeMaps[dayId] = map;
    });

    setTimeout(() => {
        Object.values(routeMaps).forEach(map => map.invalidateSize());
    }, 250);
}

function getShareUrl() {
    return window.location.href;
}

function getShareText() {
    return '宮城・岩手 2泊3日 夏旅しおり｜2026年8月8日〜10日';
}

function showCopyToast() {
    const toast = document.getElementById('copy-toast');
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

function copyUrl() {
    navigator.clipboard.writeText(getShareUrl()).then(showCopyToast).catch(() => {
        const input = document.createElement('input');
        input.value = getShareUrl();
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        showCopyToast();
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
    if (!window.QRCode) return;

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

function loadQRLibrary() {
    return new Promise((resolve, reject) => {
        if (window.QRCode) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/qrcode-generator@1.4.4/qrcode.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

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

    document.querySelectorAll('.day-header, .map-section, .expense-section, .share-section').forEach(el => {
        observer.observe(el);
    });
}

function initStickyTabs() {
    const sticky = document.getElementById('tabs-sticky');
    if (!sticky) return;
    const onScroll = () => {
        sticky.classList.toggle('shadow', sticky.getBoundingClientRect().top <= 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

window.switchTab = switchTab;
window.copyUrl = copyUrl;
window.toggleQR = toggleQR;

window.addEventListener('load', () => {
    initRouteMaps();
    initShareLinks();
    loadQRLibrary().catch(() => {});
    initScrollAnimations();
    initStickyTabs();
});
