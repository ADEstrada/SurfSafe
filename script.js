
function setRole(role, element) {
    document.getElementById('roleInput').value = role;

    document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');

    const signupCard = document.querySelector('.signup-card');
    const trainerFields = document.getElementById('trainerFields');
    const trainerConsent = document.getElementById('trainerConsentText');
    // BAT INALIS 'TONG DALAWA?
    // const termsCheck = document.getElementById('termsCheck'); 
    // const fileInputs = trainerFields.querySelectorAll('input[type="file"]');

    if (role === 'Trainer') {
        signupCard.classList.add('trainer-expanded');
        trainerFields.style.display = 'block';

        // BAT INALIS 'TO:
        // fileInputs.forEach(input => input.required = true);
        trainerConsent.style.display = 'block';
    } else {
        signupCard.classList.remove('trainer-expanded');
        trainerFields.style.display = 'none';

        // BAT INALIS 'TO:
        // fileInputs.forEach(input => input.required = false);
        // termsCheck.required = false; 
        // termsCheck.checked = false;  

        trainerConsent.style.display = 'none';
    }
}

// 7-DAY FORECAST - index.html and marine_data.html
function generateForecastCards() {

    const container = document.getElementById('forecastContainer');
    const template = document.getElementById('forecastCardTemplate');

    if (!container || !template) return;

    const days = ['SUN', 'MON', 'TUE', 'WED', 'THURS', 'FRI', 'SAT'];
    const today = new Date().getDay();

    container.innerHTML = '';

    for (let i = 0; i < 7; i++) {
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector('.forecast-card');

        const dayIndex = (today + i) % 7;

        card.setAttribute('data-day', dayIndex);
        card.querySelector('.day-name').innerText = days[dayIndex];

        const lowerDay = days[dayIndex].toLowerCase();
        card.querySelector('.wave-val').id = `wave-${lowerDay}`;
        card.querySelector('.wind-val').id = `wind-${lowerDay}`;
        card.querySelector('.tide-val').id = `tide-${lowerDay}`;

        if (dayIndex === today) {
            card.classList.add('active');
        }

        container.appendChild(clone);
    }
}

// TIDE HEIGHT IN FORECAST CARD
function updateForecastCardsWithTide() {
    if (!globalTideData.length) return;

    const cards = document.querySelectorAll('.forecast-card');

    cards.forEach((card) => {
        const tideEl = card.querySelector('.tide-val');
        if (!tideEl) return;

        const cardDay = card.getAttribute('data-day');

        const tideForDay = globalTideData.find(entry => {
            const tideDate = new Date(entry.time);
            return tideDate.getDay().toString() === cardDay;
        });

        if (tideForDay && tideForDay.height !== undefined) {
            tideEl.innerText = `${tideForDay.height.toFixed(1)}m`;
        } else {
            tideEl.innerText = "--";
        }
    });
}

// FORECAST CARD DATA - WEEKLY
function updateForecastCards(marineDaily, weatherDaily) {
    if (!marineDaily || !weatherDaily) return;

    marineDaily.time.forEach((dateStr, index) => {
        const date = new Date(dateStr);
        const dayIndex = date.getDay();

        const card = document.querySelector(`.forecast-card[data-day="${dayIndex}"]`);

        if (card) {
            const waveEl = card.querySelector('.wave-val');
            const windEl = card.querySelector('.wind-val');

            if (waveEl) {
                const waveHeight = marineDaily.wave_height_max[index];
                waveEl.innerText = waveHeight !== undefined && waveHeight !== null ? waveHeight.toFixed(1) : "0.0";
            }

            if (windEl) {
                const wind = weatherDaily.wind_speed_10m_max?.[index];
                windEl.innerText = wind !== undefined && wind !== null ? wind.toFixed(1) : "--";
            }
        }
    });
}

// SURF WIND CONDITION
// INAYOS NA SURF CONDITION INDEX LOOKUP
function updateSurfCondition(hourlyData) {
    const targetEl = document.getElementById('surf-condition');
    if (!targetEl) return;

    const now = new Date();
    
    // Itinama ang index alignment para sa kasalukuyang oras ng kasalukuyang araw
    const currentIndex = hourlyData.time.findIndex(t => {
        const d = new Date(t);
        return d.getDate() === now.getDate() && 
               d.getMonth() === now.getMonth() && 
               d.getFullYear() === now.getFullYear() && 
               d.getHours() === now.getHours();
    });

    const indexToUse = currentIndex !== -1 ? currentIndex : 0;

    const wave = hourlyData.wave_height[indexToUse];
    const wind = hourlyData.wind_speed_10m[indexToUse];

    let condition = "POOR";

    if (wave >= 1.5 && wind <= 15) {
        condition = "GOOD";
    } else if (wave >= 1.0 && wind <= 25) {
        condition = "FAIR";
    }

    targetEl.innerText = condition;

    if (condition === "GOOD") {
        targetEl.style.color = "#198754"; 
    } else if (condition === "FAIR") {
        targetEl.style.color = "#ffc107"; 
    } else {
        targetEl.style.color = "#dc3545"; 
    }
}

// HOURLY WAVE HEIGHT GRAPH - marine_data.html 
let myWaveChart;

function setupWaveChart() {

    const ctx = document.getElementById('waveChart').getContext('2d');

    myWaveChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Wave Height (m)',
                data: [],
                backgroundColor: '#0077b6',
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    grid: { color: '#f0f0f0' },
                    ticks: { callback: (value) => value + 'm' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

// OPEN METEO
let globalTideData = [];
async function fetchMarineData() {
    // BAGASBAS BEACH
    const lat = 14.1369;
    const lon = 122.9813;

    const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height,wave_direction,wave_period,wind_wave_height,wind_speed_10m,wind_direction_10m&daily=wave_height_max,wind_speed_10m_max&timezone=auto`;
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=relative_humidity_2m,visibility,uv_index,wind_speed_10m,wind_direction_10m&daily=wind_speed_10m_max&timezone=auto`;

    console.log("Fetching Bagasbas Marine Data...");

    try {
        const [marineRes, weatherRes] = await Promise.all([
            fetch(marineUrl),
            fetch(weatherUrl)
        ]);

        const marineData = await marineRes.json();
        const weatherData = await weatherRes.json();

        console.log("Marine and Weather data synced.");

        updateWaveChart(marineData.hourly);
        calculateBestSurfWindow(marineData.hourly);
        updateWeatherDetails(weatherData.hourly, marineData.hourly);
        updateForecastCards(marineData.daily, weatherData.daily);
        updateSurfCondition(marineData.hourly);

        fetchTideData();

        console.log("FULL DAILY DATA:", marineData.daily);
        console.log("WIND ARRAY:", marineData.daily.wind_speed_10m_max);
        console.log("Weather Hourly:", weatherData.hourly);


        fetch('backend/check_weather_and_cancel.php')
            .then(res => res.json())
            .then(autoResult => {
                if (autoResult.success && autoResult.cancelled_count > 0) {
                    console.log(`SurfSafe Automation: ${autoResult.cancelled_count} booking slots automatically cancelled due to wave height warnings.`);
                    
                    if (typeof renderLiveTouristBookings === 'function') renderLiveTouristBookings();
                    if (typeof renderBookings === 'function') renderBookings();
                } else {
                    console.log("SurfSafe Automation: " + autoResult.message);
                }
            })
            .catch(err => console.warn("Background automation safety cycle deferred: ", err));

    } catch (error) {
        console.error("Architect Error: API could not be reached.", error);
    }
}

// INAYOS NA HOURLY CHART RENDERING (Kasalukuyang 24 Oras mula ngayon)
function updateWaveChart(hourlyData) {
    if (!myWaveChart || !hourlyData) return;

    const now = new Date();
    
    // Hinahanap ang index ng kasalukuyang oras para doon magsimula ang 24-hour graph block
    const startIndex = hourlyData.time.findIndex(t => {
        const d = new Date(t);
        return d.getDate() === now.getDate() && 
               d.getMonth() === now.getMonth() && 
               d.getHours() === now.getHours();
    });

    const indexToUse = startIndex !== -1 ? startIndex : 0;

    // Imbis na laging slice(0, 24) na fixed sa madaling araw, mag-si-slice tayo mula sa kasalukuyang oras pataas para laging abante ang graph
    const labels = hourlyData.time.slice(indexToUse, indexToUse + 24).map(t => {
        const date = new Date(t);
        return date.toLocaleTimeString([], {
           hour: 'numeric',
           hour12: true
        });
    });

    myWaveChart.data.labels = labels;
    myWaveChart.data.datasets[0].data = hourlyData.wave_height.slice(indexToUse, indexToUse + 24);
    myWaveChart.update();
}

// TIDE INFO
function updateTideInfo(tideData) {
    const now = new Date();

    const nextHigh = tideData.find(t => t.type === "high" && new Date(t.time) > now);
    const nextLow = tideData.find(t => t.type === "low" && new Date(t.time) > now);

    const nextHighTimeEl = document.getElementById('next-high-time');
    const nextLowTimeEl = document.getElementById('next-low-time');
    const localTimeEl = document.getElementById('local-time');

    if (nextHigh && nextHighTimeEl) {
        const highDate = new Date(nextHigh.time);
        nextHighTimeEl.innerText = highDate.toLocaleTimeString();

        const diff = (highDate - now) / 1000;
        const hh = document.getElementById('high-h');
        const hm = document.getElementById('high-m');
        const hs = document.getElementById('high-s');
        if (hh) hh.innerText = Math.floor(diff / 3600);
        if (hm) hm.innerText = Math.floor((diff % 3600) / 60);
        if (hs) hs.innerText = Math.floor(diff % 60);
    }

    if (nextLow && nextLowTimeEl) {
        const lowDate = new Date(nextLow.time);
        nextLowTimeEl.innerText = lowDate.toLocaleTimeString();

        const diff = (lowDate - now) / 1000;
        const lh = document.getElementById('low-h');
        const lm = document.getElementById('low-m');
        const ls = document.getElementById('low-s');
        if (lh) lh.innerText = Math.floor(diff / 3600);
        if (lm) lm.innerText = Math.floor((diff % 3600) / 60);
        if (ls) ls.innerText = Math.floor(diff % 60);
    }

    if (localTimeEl) localTimeEl.innerText = now.toLocaleTimeString();
}


// BEST SURFING WINDOW
function calculateBestSurfWindow(hourlyData) {
    if (!hourlyData || !hourlyData.time || !hourlyData.wave_height) return;

    const targetEl = document.getElementById('best-time-window');
    if (!targetEl) return;

    let bestIndex = -1;
    let bestScore = -Infinity;

    const now = new Date();
    const todayDateStr = now.toDateString(); 

    for (let i = 0; i < hourlyData.time.length; i++) {
        const entryTime = new Date(hourlyData.time[i]);
        
        if (entryTime.toDateString() !== todayDateStr || entryTime < now) {
            continue;
        }

        if (entryTime.getHours() >= 19) {
            continue;
        }

        const wave = hourlyData.wave_height[i];
        const wind = hourlyData.wind_speed_10m[i];
        const period = hourlyData.wave_period ? hourlyData.wave_period[i] : 8;

        if (wave === undefined || wind === undefined) continue;

        const surfScore = (wave * 3) + (period * 1.5) - (wind * 0.2);

        if (surfScore > bestScore) {
            bestScore = surfScore;
            bestIndex = i;
        }
    }

    if (bestIndex === -1) {
        targetEl.innerText = "Closed (Check Tomorrow)";
        return;
    }

    const bestTimeDate = new Date(hourlyData.time[bestIndex]);
    const formattedTime = bestTimeDate.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    targetEl.innerText = formattedTime;
}

let myTideChart;

// TIDE CHART - marine_data.html 
function setupTideChart() {
    const ctxTide = document.getElementById('tideChart').getContext('2d');

    myTideChart = new Chart(ctxTide, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Tide Height',
                    data: [],
                    borderColor: '#007bff', 
                    backgroundColor: 'rgba(0, 123, 255, 0.2)', 
                    tension: 0.4,
                fill: true, 
                pointBackgroundColor: '#007bff',
                pointRadius: 4,
                spanGaps: true 
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false } 
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: { color: '#f0f0f0' },
                    title: { display: true, text: 'Height (m)' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

// TIDE CHART DATA
function updateTideChart(tideData) {
    if (!myTideChart || !tideData || !tideData.length) return;

    const labels = [];
    const combinedData = [];

    tideData.forEach(entry => {
        const date = new Date(entry.time);
        const formattedLabel = date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
                               " " + 
                               date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

        labels.push(formattedLabel);

        combinedData.push(entry.height);
    });

    myTideChart.data.labels = labels;
    myTideChart.data.datasets[0].data = combinedData;

    myTideChart.update();
}

// FETCHING FROM STORM GLASS
async function fetchTideData() {
    const lat = 14.1369;
    const lon = 122.9813;

    const url = `https://api.stormglass.io/v2/tide/extremes/point?lat=${lat}&lng=${lon}`;

    try {
        const res = await fetch(url, {

            // CHANGE - JUST MESSAGE
            headers: {
                'Authorization': '23a98d10-446d-11f1-be04-0242ac120004-23a98eaa-446d-11f1-be04-0242ac120004'
            }
        });

        const data = await res.json();

        globalTideData = data.data;
        updateTideChart(data.data);
        updateTideInfo(data.data);
        updateForecastCardsWithTide();
        updateTideSummary();

    } catch (err) {
        console.error("Tide API error:", err);
    }
}

// TIDE SUMMARY
function updateTideSummary() {
    if (!globalTideData.length) return;

    const now = new Date();

    let nextHigh = null;
    let nextLow = null;

    globalTideData.forEach(entry => {
        const time = new Date(entry.time);

        if (time > now) {
            if (entry.type === "high" && !nextHigh) nextHigh = entry;
            if (entry.type === "low" && !nextLow) nextLow = entry;
        }
    });

    function updateCountdown(target, prefix) {
        if (!target) return;

        const hEl = document.getElementById(`${prefix}-h`);
        const mEl = document.getElementById(`${prefix}-m`);
        const sEl = document.getElementById(`${prefix}-s`);

        if (!hEl || !mEl || !sEl) return;

        const diff = new Date(target.time) - new Date();
        hEl.innerText = Math.floor(diff / (1000 * 60 * 60));
        mEl.innerText = Math.floor((diff / (1000 * 60)) % 60);
        sEl.innerText = Math.floor((diff / 1000) % 60);
    }

    const nextHighTimeEl = document.getElementById("next-high-time");
    const nextLowTimeEl = document.getElementById("next-low-time");

    if (nextHigh && nextHighTimeEl) {
        nextHighTimeEl.innerText = new Date(nextHigh.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    if (nextLow && nextLowTimeEl) {
        nextLowTimeEl.innerText = new Date(nextLow.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    updateCountdown(nextHigh, "high");
    updateCountdown(nextLow, "low");

    const localTimeEl = document.getElementById("local-time");
    if (localTimeEl) {
        setInterval(() => {
            const currentNow = new Date();
            localTimeEl.innerText = currentNow.toLocaleTimeString();
            updateCountdown(nextHigh, "high");
            updateCountdown(nextLow, "low");
        }, 1000);
    }
}

// BOTTOM WEATHER DETAILS
function updateWeatherDetails(weatherHourly, marineHourly) {
    const now = new Date();
    
    const currentIndex = weatherHourly.time.findIndex(t => {
        const d = new Date(t);
        return d.getDate() === now.getDate() && 
               d.getMonth() === now.getMonth() && 
               d.getFullYear() === now.getFullYear() && 
               d.getHours() === now.getHours();
    });

    if (currentIndex === -1) return;

    const humidity = weatherHourly.relative_humidity_2m[currentIndex];
    const uv = weatherHourly.uv_index[currentIndex];
    const visibility = (weatherHourly.visibility[currentIndex] / 1000).toFixed(1);

    const windDir = weatherHourly.wind_direction_10m[currentIndex];
    const windSpd = weatherHourly.wind_speed_10m[currentIndex];
    const windKph = windSpd.toFixed(1);

    const windSpeedEl = document.getElementById('current-wind-speed');
    const windDirEl = document.getElementById('current-wind-dir');
    const humidityEl = document.getElementById('detail-humidity');
    const uvEl = document.getElementById('detail-uv');
    const visibilityEl = document.getElementById('detail-visibility');
    const detailWindDirEl = document.getElementById('detail-wind-dir');

    if (windSpeedEl) windSpeedEl.innerText = windKph;
    if (windDirEl) windDirEl.innerText = getCardinalDirection(windDir);
    if (humidityEl) humidityEl.innerText = `${humidity}%`;
    if (uvEl) uvEl.innerText = uv;
    if (visibilityEl) visibilityEl.innerText = `${visibility} km`;
    if (detailWindDirEl) detailWindDirEl.innerText = `${windDir}° ${getCardinalDirection(windDir)}`;
}

// CONVERT DEGREES TO NSEW
function getCardinalDirection(angle) {
    if (angle === null || angle === undefined || isNaN(angle)) return "--";

    const directions = ['↑ N', '↗ NE', '→ E', '↘ SE', '↓ S', '↙ SW', '← W', '↖ NW'];
    return directions[Math.round(angle / 45) % 8];
}

// LIVE DATE - marine_data.html
function displayLiveDate() {
    const dateElement = document.getElementById('live-date');
    if (!dateElement) return;

    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    dateElement.innerText = now.toLocaleDateString('en-US', options);
}

// CREDITS - FOR PHOTOS
document.addEventListener('DOMContentLoaded', function () {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
});

// REPORTS - report.html
function renderReports() {
    const container = document.getElementById('reports-list');
    if (!container) return; 
    
    // FETCHES THE APPROVED REPORTS
    fetch('backend/get_active_hazards.php')
        .then(res => res.json())
        .then(data => {
           
            if (!data.success || !data.hazards || data.hazards.length === 0) {
                container.innerHTML = `
                    <div class="no-reports-container text-center py-5">
                        <i class="bi bi-shield-check no-reports-icon text-success fs-1"></i>
                        <h4 style="color: var(--surf-navy); font-weight: 700;" class="mt-3">All Clear!</h4>
                        <p class="text-muted">There are no hazards reported at Bagasbas Beach today.</p>
                    </div>
                `;
                return; 
            }
            
            const reportsData = data.hazards;
            
            container.innerHTML = reportsData.map(report => {
                const currentStatus = report.status ? report.status.toLowerCase() : 'safe';
                
                let accentColor = '#198754';
                let badgeClass = 'bg-success text-white';
                
                if (currentStatus === 'dangerous') {
                    accentColor = '#ff311f'; 
                    badgeClass = 'bg-danger text-white';
                } else if (currentStatus === 'warning') {
                    accentColor = '#ffc107'; 
                    badgeClass = 'bg-warning text-dark';
                }

                return `
                    <div class="report-entry shadow-sm">
                        <div class="status-indicator" style="background-color: ${accentColor}"></div>
                        <div class="entry-body">
                            <div class="row g-0 align-items-start">
                                
                                <div class="col-md-8 pe-3">
                                    <span class="badge rounded-pill status-badge ${badgeClass} d-inline-block">
                                        ${currentStatus.toUpperCase()}
                                    </span>
                                    <p class="entry-description">${report.description}</p>
                                    <div class="location-text">
                                        <i class="bi bi-geo-alt-fill me-1"></i>${report.reported_at}
                                    </div>
                                </div>

                                <div class="col-md-4 data-box mt-3 mt-md-0">
                                    <div class="row g-2">
                                        <div class="col-6 col-md-12 data-item">
                                            <label>Hazard Type</label>
                                            <span>${report.hazard_type}</span>
                                        </div>
                                        <div class="col-6 col-md-12 data-item">
                                            <label>Coordinates</label>
                                            <span>${report.latitude}, ${report.longitude}</span>
                                        </div>
                                        <div class="col-12 data-item">
                                            <label>Reported By</label>
                                            <span>${report.reporter}</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        })
        .catch(error => {
            console.error("Error updating public approved hazard reports logging layout:", error);
            container.innerHTML = `<div class="text-danger small p-3 text-center">Failed to load public safety feed layer.</div>`;
        });
}

// my_bookings FOR TRAINERS
function renderBookings() {
    const statuses = ['upcoming', 'completed', 'cancelled'];

    if (!document.getElementById('upcoming-list')) return;

    fetch('backend/get_trainer_bookings.php')
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                console.error("Failed to retrieve live trainer bookings from database.");
                return;
            }

            const activeBookings = data.bookings;

            statuses.forEach(status => {
                const listContainer = document.getElementById(`${status}-list`);
                if (!listContainer) return;

                const filtered = activeBookings.filter(b => b.status.toLowerCase() === status.toLowerCase());
                listContainer.innerHTML = '';

                if (filtered.length === 0) {
                    listContainer.innerHTML = `
                        <div class="text-center py-5">
                            <i class="bi bi-calendar-x fs-1 text-muted"></i>
                            <p class="text-muted mt-2">No ${status} bookings yet.</p>
                        </div>`;
                    return;
                }

                
                let currentMonth = "";
                
                const cardsHTML = filtered.map(booking => {
                    let monthHeaderHTML = "";
                    let displayMonth = "SCHEDULE";

                    if (booking.date_display && booking.date_display.includes(', ')) {
                        const parts = booking.date_display.split(', ');
                        if (parts[1]) {
                            displayMonth = parts[1].split(' ')[0].toUpperCase(); 
                        } 
                    }
                    
                    if (displayMonth !== currentMonth) {
                        currentMonth = displayMonth;
                        monthHeaderHTML = `<h6 class="text-muted text-uppercase small fw-bold mb-3 mt-4">${currentMonth}</h6>`;
                    }

                    let displayNum = "##";
                    let displayDay = "DAY";
                    
                    if (booking.date_display) {
                        const parsedDate = new Date(booking.date_display);
                        if (!isNaN(parsedDate)) {
                            displayNum = String(parsedDate.getDate()).padStart(2, '0'); 
                            displayDay = parsedDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(); 
                        }
                    }
                  
                    const displayTime = booking.selected_time || "Not Specified";

                    return `
                        ${monthHeaderHTML}
                    <div class="booking-card d-flex align-items-center bg-white border rounded shadow-sm mb-3 p-0 overflow-hidden">
                            <div class="date-badge text-center py-3 px-4 border-end d-flex flex-column justify-content-center" style="min-width: 110px; background-color: #f8fbff;">
                                <span class="text-uppercase fw-bold small text-muted">${displayDay}</span>
                                <span class="fs-2 fw-bold lh-1" style="color: #002266;">${displayNum}</span>
                        </div>

                            <div class="flex-grow-1 ps-4">
                                <h5 class="fw-bold mb-1">${booking.tourist_name}</h5>
                                <p class="text-muted small mb-0"><i class="bi bi-clock me-2"></i>${displayTime}</p>
                        </div>

                        <div class="pe-4">
                                <button class="btn btn-view-details rounded-pill px-4" onclick="showDetails('${booking.id}')">
                                View Details
                            </button>
                        </div>
                    </div>
                    `;
                }).join(''); 

                listContainer.innerHTML = cardsHTML;
            });
        })
        .catch(error => console.error("Error synchronizing trainer booking live cycles:", error));
}


// VIEW DETAILS PART
function showDetails(id) {

    // FETCHES THE DETAILS FROM THE DATABASE
    fetch('backend/get_trainer_bookings.php')
        .then(res => res.json())
        .then(data => {
            if(!data.success) return;
            const booking = data.bookings.find(b => b.id === id); // string/number match validation layer
            
            if (booking) {
                const bookingsModalWrapper = document.querySelector('#detailsModal .modal-dialog');
                if (bookingsModalWrapper) {
                    bookingsModalWrapper.classList.add('modal-lg');
                }

                document.getElementById('detail-name').innerText = booking.tourist_name;
                document.getElementById('detail-email').innerText = booking.email || "No Email Provided";
                
                const liveDate = booking.date_display || "No Date Assigned";
                const liveTime = booking.custom_time || booking.selected_time || "No Time Assigned";
                
                const dateTimeElement = document.getElementById('detail-datetime');
                if (dateTimeElement) {
                    dateTimeElement.innerText = `${liveDate} | ${liveTime}`;
                }
                document.getElementById('detail-location').innerText = booking.location || "Not Specified";

                const notesElement = document.getElementById('detail-notes');
                if (notesElement) {
                    notesElement.innerText = booking.notes || "No structural requests specified.";
                }

                const btnContainer = document.getElementById('complete-btn-container');
                if (booking.status.toLowerCase() === 'upcoming') {
                    btnContainer.innerHTML = `
                        <button class="btn btn-success w-100 rounded-pill" onclick="completeBooking('${booking.id}')">
                            <i class="bi bi-check-circle me-2"></i>Mark as Completed
                        </button>
                    `;
                } else {
                    btnContainer.innerHTML = '';
                }

                const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
                detailsModal.show();
            }
        })
        .catch(error => console.error("Error loading modal data framework:", error));
}

document.addEventListener("DOMContentLoaded", () => {
    renderBookings();
});

// FOR COMPLETE BOOKING
function completeBooking(id) {
    if (!confirm("Are you sure you want to mark this surf lesson as completed?")) {
        return;
    }

    const payload = new FormData();
    payload.append('booking_id', id);

    fetch('backend/complete_booking.php', {
        method: 'POST',
        body: payload
    })
    .then(res => {
        if (!res.ok) throw new Error("HTTP Status validation breakdown: " + res.status);
        return res.json();
    })
    .then(result => {
        if (result.success) {
            alert(result.message);
            
            const modalElement = document.getElementById('detailsModal');
            if (modalElement) {
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) modalInstance.hide();
            }
            
            if (typeof renderBookings === 'function') {
                renderBookings(); 
            }
            if (typeof renderLiveTouristBookings === 'function') {
                renderLiveTouristBookings(); 
            }
        } else {
            alert("Process Failure: " + result.message);
        }
    })
    .catch(error => {
        console.error("Error executing system booking lifecycle completion update:", error);
        alert("Network processing error. Verify connection layout framework.");
    });
}

// TRAINERS LIST - trainer.php

let currentTrainerIndex = 0;
let trainersData = []; 
let trainerModal;

document.addEventListener("DOMContentLoaded", () => {
    const modalElement = document.getElementById('trainerModal');
    if (modalElement) {
        trainerModal = new bootstrap.Modal(modalElement);
    }
    if (document.getElementById('trainers-list')) {
        renderTrainers();
    }
});

function getWeeklyStatus(dayAbbreviation, activeDays) {
    const daysMap = { 'SU': 0, 'M': 1, 'T': 2, 'W': 3, 'TH': 4, 'F': 5, 'S': 6 };
    const today = new Date().getDay();
    const targetDay = daysMap[dayAbbreviation];

    if (targetDay < today) return 'past';
    return activeDays.includes(dayAbbreviation) ? 'active' : 'inactive';
}

function renderTrainers() {
    const list = document.getElementById('trainers-list');
    if (!list) return;

    const placeholder = "https://placehold.co/400x500/00167A/FFFFFF?text=SurfSafe+Trainer";

    fetch('backend/get_public_shifts.php')
        .then(res => {
            if (!res.ok) throw new Error("HTTP error " + res.status);
            return res.json();
        })
        .then(data => {
            if (!data.success || data.shifts.length === 0) {
                list.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <i class="bi bi-calendar-x text-muted" style="font-size: 3rem;"></i>
                        <h4 class="fw-bold mt-3 text-dark">No Shifts Available</h4>
                        <p class="text-muted small">No active coaching shifts allocated for this week yet.</p>
                    </div>`;
                return;
            }

            const trainersMap = {};
            data.shifts.forEach(shift => {
                const trainerId = shift.user_id;
                if (!trainersMap[trainerId]) {
                    
                    let rawExpertise = [];
                    if (shift.specialization) {
                        rawExpertise = shift.specialization.includes(',') 
                            ? shift.specialization.split(',').map(s => s.trim()) 
                            : [shift.specialization];
                    } else {
                        rawExpertise = ["Surfing Instruction"];
                    }

                    trainersMap[trainerId] = {
                        id: trainerId,
                        name: shift.trainer_name,
                        image: shift.image || placeholder,
                        specialization: shift.specialization || "Surfing Instructor",
                        expertise: rawExpertise,
                        bio: shift.bio && shift.bio.trim() !== "" ? shift.bio : 'Accredited local surf instructor ready to catch waves!',
                        rate: 1300, 
                        experience: shift.experience || shift.experience_years || 5,
                        all_shifts: []
                    };
                }
                trainersMap[trainerId].all_shifts.push(shift);
            });

            trainersData = Object.values(trainersMap);

            list.innerHTML = trainersData.map((trainer, index) => {
                const weekDays = ['M', 'T', 'W', 'TH', 'F', 'S', 'SU'];
                const dayAbbrMap = { 'Monday': 'M', 'Tuesday': 'T', 'Wednesday': 'W', 'Thursday': 'TH', 'Friday': 'F', 'Saturday': 'S', 'Sunday': 'SU' };
                const activeDays = trainer.all_shifts.map(s => dayAbbrMap[s.day_name]);

                return `
                    <div class="col-12 col-md-4 mb-4">
                        <div class="trainer-card-fixed shadow-sm" onclick="openTrainerDetails(${index})" style="cursor: pointer;">
                            <div class="trainer-img-container">
                                <img src="${trainer.image}" class="trainer-img-top" alt="${trainer.name}">
                            </div>
                            <div class="p-3 text-center">
                                <h5 class="trainer-name-text">${trainer.name}</h5>
                                <div class="availability-row my-2">
                                    ${weekDays.map(day => {
                                        const isActive = activeDays.includes(day);
                                        return `<span class="day-dot ${isActive ? 'active' : 'inactive'}">${day}</span>`;
                                    }).join('')}
                                </div>
                                <div class="d-flex justify-content-between align-items-center mt-3 px-2">
                                    <span class="trainer-rate">Php ${trainer.rate.toLocaleString()}</span>

                                   <button class="btn btn-navy py-2 fw-bold px-3 btn-sm" onclick="event.stopPropagation(); startBooking(${index})">Book</button>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        })
        .catch(error => console.error("Error executing dynamic backend integration:", error));
}

// SHOWS THE TRAINER'S DETAILS
function openTrainerDetails(index) {
    currentTrainerIndex = index;
    const trainer = trainersData[index];
    const detailsContainer = document.getElementById('modal-trainer-details');
    if (!detailsContainer) return;

    const dialogWrapper = document.querySelector('#trainerModal .modal-dialog');
    if (dialogWrapper) {
        dialogWrapper.className = "modal-dialog modal-dialog-centered modal-lg";
    }

    document.querySelectorAll('.nav-arrow').forEach(btn => btn.classList.remove('d-none'));

    const expertiseChips = trainer.expertise.map(skill => `<span class="expertise-chip">${skill}</span>`).join('');
    const weekDays = ['M', 'T', 'W', 'TH', 'F', 'S', 'SU'];
    const dayAbbrMap = { 'Monday': 'M', 'Tuesday': 'T', 'Wednesday': 'W', 'Thursday': 'TH', 'Friday': 'F', 'Saturday': 'S', 'Sunday': 'SU' };
    const activeDays = trainer.all_shifts.map(s => dayAbbrMap[s.day_name]);

    detailsContainer.innerHTML = `
        <div class="row g-0">
            <div class="col-md-5">
                <img src="${trainer.image}" class="img-fluid h-100 object-fit-cover" style="border-radius: 20px 0 0 20px; min-height: 400px;">
            </div>
            <div class="col-md-7 p-4">
                <h2 class="fw-bold text-navy mb-3">${trainer.name.toUpperCase()}</h2>
                <div class="row mb-4">
                    <div class="col-6">
                        <small class="text-muted d-block fw-bold">EXPERIENCE</small>
                        <span class="fw-bold">${trainer.experience}+ Years</span>
                    </div>
                    <div class="col-6">
                        <small class="text-muted d-block fw-bold">RATE</small>
                        <span class="text-navy fw-bold">${trainer.rate.toLocaleString()} Php</span>
                    </div>
                </div>
                <div class="mb-3">
                    <p class="small fw-bold mb-2"><i class="bi bi-info-circle-fill text-navy me-2"></i>About Trainer</p>
                    <p class="text-muted small">${trainer.bio}</p>
                </div>
                <div class="mb-4">
                    <p class="small fw-bold mb-2">Areas of Expertise</p>
                    <div class="d-flex flex-wrap gap-2">${expertiseChips}</div>
                </div>
                <div class="mb-4">
                    <p class="small fw-bold mb-2"><i class="bi bi-clock-fill text-navy me-2"></i>Weekly Availability</p>
                    <div class="d-flex gap-2">
                        ${weekDays.map(day => {
                            const isActive = activeDays.includes(day);
                            return `<span class="fw-bold ${isActive ? 'text-success' : 'text-danger'}">${day}</span>`;
                        }).join('')}
                    </div>
                </div>
                <button class="btn btn-navy w-100 py-2 fw-bold mt-2" onclick="startBooking(${index})">Book</button>
            </div>
        </div>
    `;

    const modalElement = document.getElementById('trainerModal');
    if (modalElement) {
        const instance = bootstrap.Modal.getOrCreateInstance(modalElement);
        instance.show();
    }
}

// SHOWS THE BOOKING FORM
function startBooking(index) {
    currentTrainerIndex = index;
    const trainer = trainersData[index];
    const detailsContainer = document.getElementById('modal-trainer-details');
    if (!detailsContainer) return;

    const dialogWrapper = document.querySelector('#trainerModal .modal-dialog');
    if (dialogWrapper) {
        dialogWrapper.className = "modal-dialog modal-dialog-centered modal-lg";
    }

    document.querySelectorAll('.nav-arrow').forEach(btn => btn.classList.add('d-none'));

    const dateOptionsHTML = trainer.all_shifts.map((shift, i) => {
        return `<option value="${i}">${shift.date_display} (${shift.day_name})</option>`;
    }).join('');

    detailsContainer.innerHTML = `
        <div class="p-4">
            <div class="d-flex align-items-center mb-4">
                <button class="btn btn-sm btn-outline-secondary me-3" onclick="openTrainerDetails(${index})">
                    <i class="bi bi-arrow-left"></i>
                </button>
                <h4 class="fw-bold text-navy mb-0">Booking for ${trainer.name}</h4>
            </div>

            <div class="mb-3">
                <label class="form-label small fw-bold text-secondary">Choose Available Date</label>
                <select class="form-select" id="bookingShiftSelector" required>
                    ${dateOptionsHTML}
                </select>
            </div>

            <div id="selectedShiftInfoBox"></div>

            <form id="publicBookingSubmissionForm">

                <div class="row g-3 mb-3">
                    <div class="col-6">
                        <label class="form-label small fw-bold text-secondary">Your Start Time</label>
                        <input type="time" class="form-control" id="bookingStartTime" required>
                    </div>
                    <div class="col-6">
                        <label class="form-label small fw-bold text-secondary">Your End Time</label>
                        <input type="time" class="form-control" id="bookingEndTime" required>
                    </div>
                    <div class="col-12">
                        <span class="text-muted" style="font-size: 0.75rem; display: block; mt-1;" id="overlapValidationMessage">
                            Select a date above to display allowed hours.
                        </span>
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label small fw-bold text-secondary">Select Meet-up Location</label>
                    <select class="form-select" id="bookingMeetupLocation" required>
                        <option value="" selected disabled>Choose meeting area...</option>
                        <option value="Bagasbas Lighthouse">Bagasbas Lighthouse</option>
                        <option value="SurfSafe HQ Office">SurfSafe HQ Office</option>
                        <option value="Main Lifeguard Station Tower 1">Main Lifeguard Station Tower 1</option>
                    </select>
                </div>

                <div class="mb-4">
                    <label class="form-label small fw-bold text-secondary">Additional Notes / Requests (Optional)</label>
                    <textarea class="form-control" id="bookingNotes" rows="2" placeholder="e.g., I want to book 1pm to 2pm only..."></textarea>
                </div>

                <button type="submit" class="btn btn-navy w-100 py-2 fw-bold" id="bookingSubmitBtn">Confirm Booking</button>
            </form>
        </div>
    `;

    const shiftSelector = document.getElementById('bookingShiftSelector');
    const startInput = document.getElementById('bookingStartTime');
    const endInput = document.getElementById('bookingEndTime');
    const validationMsg = document.getElementById('overlapValidationMessage');
    const submitBtn = document.getElementById('bookingSubmitBtn');

    let globalReservedSlots = [];
    let currentAdminTimeRange = "";

    const toMins = (t) => {
        const [h, m] = t.split(':');
        return parseInt(h, 10) * 60 + parseInt(m, 10);
    };

    const parse12ToMins = (t12) => {
        const [time, modifier] = t12.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') hours = '00';
        if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
        return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
    };

    function checkLiveOverlap() {
        if (!startInput.value || !endInput.value) return;

        const currentStart = toMins(startInput.value);
        const currentEnd = toMins(endInput.value);

        const activeShift = trainer.all_shifts[shiftSelector.value];
        const adminStartMins = parse12ToMins(activeShift.start_time);
        const adminEndMins = parse12ToMins(activeShift.end_time);

        if (currentStart < adminStartMins || currentEnd > adminEndMins) {
            applyConflictStyles(`<strong><i class="bi bi-exclamation-triangle-fill"></i> Outside Availability! Allowed hours: ${currentAdminTimeRange}</strong>`);
            return;
        }

        if (currentStart >= currentEnd) {
            applyConflictStyles(`<strong><i class="bi bi-exclamation-triangle-fill"></i> End Time must be later than Start Time!</strong>`);
            return;
        }

        let conflictFound = false;
        for (let slot of globalReservedSlots) {
            const [sStr, eStr] = slot.split(' - ');
            const slotStart = parse12ToMins(sStr);
            const slotEnd = parse12ToMins(eStr);

            if (currentStart < slotEnd && currentEnd > slotStart) {
                conflictFound = true;
                break;
            }
        }

        if (conflictFound) {
            applyConflictStyles(`<strong><i class="bi bi-x-circle-fill"></i> Time range overlaps with an existing reservation!</strong>`);
        } else {
            clearConflictStyles();
        }
    }

    function applyConflictStyles(message) {
        startInput.style.borderColor = "#dc3545";
        endInput.style.borderColor = "#dc3545";
        startInput.style.backgroundColor = "#fff5f5";
        endInput.style.backgroundColor = "#fff5f5";
        validationMsg.className = "text-danger small d-block mt-1";
        validationMsg.innerHTML = message;
        submitBtn.disabled = true;
    }

    function clearConflictStyles() {
        startInput.style.borderColor = "";
        endInput.style.borderColor = "";
        startInput.style.backgroundColor = "";
        endInput.style.backgroundColor = "";
        validationMsg.className = "text-muted small d-block mt-1";
        validationMsg.innerHTML = `*The selected time must fall within the range of <strong>${currentAdminTimeRange}</strong>.`;
        submitBtn.disabled = false;
    }

    function updateModalWithSelectedShift() {
        const selectedIndex = shiftSelector.value;
        const activeShift = trainer.all_shifts[selectedIndex];
        currentAdminTimeRange = `${activeShift.start_time} - ${activeShift.end_time}`;

        startInput.value = "";
        endInput.value = "";
        clearConflictStyles();

        fetch(`backend/get_booked_slots.php?shift_id=${activeShift.shift_id}`)
            .then(res => res.json())
            .then(data => {
                globalReservedSlots = data.success ? data.reserved : [];

                let takenSlotsHTML = "";
                if (globalReservedSlots.length > 0) {
                    takenSlotsHTML = `<div class="mt-2 text-danger small fw-bold">Already Reserved Slots: <br>` +
                        globalReservedSlots.map(slot => `• ${slot}`).join('<br>') + `</div>`;
                } else {
                    takenSlotsHTML = `<div class="mt-2 text-success small"><i class="bi bi-check-circle"></i> No existing bookings for this shift yet!</div>`;
                }

                document.getElementById('selectedShiftInfoBox').innerHTML = `
                    <div class="alert alert-info border-0 p-3 mb-4" style="background-color: #f0f7ff; border-radius: 12px;">
                        <h6 class="fw-bold text-dark mb-2" style="font-size: 0.9rem;"><i class="bi bi-clock-history text-primary me-1"></i> Coach Schedule Availability:</h6>
                        <div class="row g-2 small text-secondary">
                            <div class="col-6"><strong>Date Available:</strong> ${activeShift.date_display} (${activeShift.day_name})</div>
                            <div class="col-6"><strong>Time Allowed:</strong> ${currentAdminTimeRange}</div>
                        </div>
                        ${takenSlotsHTML}
                    </div>
                `;

                validationMsg.innerHTML = `*The selected time must fall within the range of <strong>${currentAdminTimeRange}</strong>.`;

                const form = document.getElementById('publicBookingSubmissionForm');
                form.onsubmit = function(event) {
                    executeShiftBookingSubmit(event, activeShift.shift_id, activeShift.start_time, activeShift.end_time, globalReservedSlots);
                };
            });
    }

    startInput.addEventListener('input', checkLiveOverlap);
    endInput.addEventListener('input', checkLiveOverlap);
    shiftSelector.addEventListener('change', updateModalWithSelectedShift);

    updateModalWithSelectedShift();

    const modalElement = document.getElementById('trainerModal');
    if (modalElement) {
        const instance = bootstrap.Modal.getOrCreateInstance(modalElement);
        instance.show();
    }
}

function executeShiftBookingSubmit(event, shiftId, adminStartStr, adminEndStr, reservedSlots) {
    event.preventDefault();

    const touristStart = document.getElementById('bookingStartTime').value;
    const touristEnd = document.getElementById('bookingEndTime').value;
    const location = document.getElementById('bookingMeetupLocation').value;
    const notes = document.getElementById('bookingNotes').value;

    const toMinutes = (timeStr) => {
        if (timeStr.includes('M')) {
            const [time, modifier] = timeStr.split(' ');
            let [hours, minutes] = time.split(':');
            if (hours === '12') hours = '00';
            if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
            return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
        }
        const [hours, minutes] = timeStr.split(':');
        return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
    };

    const tStart = toMinutes(touristStart);
    const tEnd = toMinutes(touristEnd);
    const aStart = toMinutes(adminStartStr);
    const aEnd = toMinutes(adminEndStr);

    if (tStart >= tEnd) {
        alert("Invalid selection! The 'End Time' must be later than the 'Start Time'.");
        return;
    }
    if (tStart < aStart || tEnd > aEnd) {
        alert(`We're sorry! Your selected time falls outside the Coach's scheduled availability (${adminStartStr} - ${adminEndStr}).`);
        return;
    }

    const format12Hour = (timeStr) => {
        if (timeStr.includes('M')) return timeStr;
        let [hours, minutes] = timeStr.split(':');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${ampm}`;
    };

    const finalCustomTimeRange = `${format12Hour(touristStart)} - ${format12Hour(touristEnd)}`;

    const payload = new FormData();
    payload.append('shift_id', shiftId);
    payload.append('meetup_location', location);
    payload.append('additional_notes', notes);
    payload.append('custom_time', finalCustomTimeRange);

    fetch('backend/save_tourist_booking.php', {
        method: 'POST',
        body: payload
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            alert("Lesson booked successfully! Your selected time slot has been reserved.");
            if (trainerModal) trainerModal.hide();
            if (typeof renderLiveTouristBookings === 'function') renderLiveTouristBookings();
        } else {
            alert(result.message);
        }
    })
    .catch(error => console.error("Booking transmission error:", error));
}

function nextTrainer() {
    if (currentTrainerIndex < trainersData.length - 1) {
        openTrainerDetails(currentTrainerIndex + 1);
    }
}

function prevTrainer() {
    if (currentTrainerIndex > 0) {
        openTrainerDetails(currentTrainerIndex - 1);
    }
}

// TOURIST USER VIEW - profile.html

function renderTouristBookings() {
    const listContainer = document.getElementById('tourist-bookings-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    touristActivityData.forEach(booking => {
        const isUpcoming = booking.status === 'upcoming';

        let statusColor = 'text-muted';
        if (booking.status === 'completed') statusColor = 'text-success';
        if (booking.status === 'cancelled') statusColor = 'text-danger';

        const activityHTML = `
            <div class="booking-item p-3 mb-3 border rounded shadow-sm bg-white">
                <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                    <div class="flex-grow-1 w-100">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <h6 class="fw-bold mb-0">${booking.trainerName}</h6>
                            <div class="d-block d-sm-none">
                                ${isUpcoming ? '' : `<span class="fw-bold small text-uppercase ${statusColor}">${booking.status}</span>`}
                            </div>
                        </div>

                        <div class="mb-2">
                            <p class="text-muted mb-0 small text-break"><i class="bi bi-envelope me-2"></i>${booking.trainerEmail}</p>
                            <p class="text-muted mb-0 small"><i class="bi bi-telephone me-2"></i>${booking.trainerPhone}</p>
                        </div>

                        <div class="row g-0">
                            <div class="col-12 mb-1">
                                <p class="text-muted mb-0 small"><i class="bi bi-calendar3 me-2"></i>${booking.date}</p>
                            </div>
                            <div class="col-12 mb-1">
                                <p class="text-muted mb-0 small"><i class="bi bi-clock me-2"></i>${booking.time}</p>
                            </div>
                            <div class="col-12">
                                <p class="text-muted mb-0 small"><i class="bi bi-geo-alt me-2"></i>${booking.location}</p>
                            </div>
                        </div>
                    </div>

                    <div class="booking-action-container mt-3 mt-sm-0 ms-sm-3 text-sm-end border-sm-0">
                        ${isUpcoming ? `
                            <button class="btn btn-sm btn-outline-danger px-4 rounded-pill btn-cancel-responsive"
                                    onclick="cancelBookingAction('${booking.id}')">
                                <i class="bi bi-x-circle me-2"></i>Cancel
                            </button>
                        ` : `
                            <div class="d-none d-sm-block">
                                <span class="fw-bold small text-uppercase ${statusColor}">${booking.status}</span>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;
        listContainer.innerHTML += activityHTML;
    });
}

function cancelBookingAction(bookingId) {
    const confirmCancel = confirm(`Are you sure you want to cancel booking session reference #${bookingId}?`);

    if (confirmCancel) {
        const payload = new FormData();
        payload.append('booking_id', bookingId);

        fetch('backend/cancel_booking.php', {
            method: 'POST',
            body: payload
        })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                alert(result.message);
                
                const index = touristActivityData.findIndex(b => b.id === bookingId);
                if (index !== -1) touristActivityData[index].status = 'cancelled';
                renderTouristBookings();
            } else {
                alert("Cancellation Failure: " + result.message);
            }
        })
        .catch(error => console.error("Network communication failure:", error));
    }
}

let reportMap;
let reportMarker;

// FOR SUBMIT LIVE REPORTS - report.html
function handleReportSubmission() {

    fetch('backend/get_profile_data.php')
        .then(response => response.json())
        .then(data => {
            const userIsAuthenticated = data.success === true;

            if (userIsAuthenticated) {
                const reportModalEl = document.getElementById('reportFormModal');
                const reportModal = new bootstrap.Modal(reportModalEl);
                reportModal.show();

                reportModalEl.addEventListener('shown.bs.modal', function () {
                    if (!reportMap) {
                        reportMap = L.map('map-picker').setView([14.1332, 122.9861], 15);

                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: '© OpenStreetMap'
                        }).addTo(reportMap);

                        reportMap.on('click', function (e) {
                            const lat = e.latlng.lat;
                            const lng = e.latlng.lng;

                            if (reportMarker) {
                                reportMarker.setLatLng([lat, lng]);
                            } else {
                                reportMarker = L.marker([lat, lng], { draggable: true }).addTo(reportMap);
                                reportMarker.on('dragend', function (event) {
                                    const position = reportMarker.getLatLng();
                                    document.getElementById('lat').value = position.lat.toFixed(6);
                                    document.getElementById('lng').value = position.lng.toFixed(6);
                                });
                            }
                            document.getElementById('lat').value = lat.toFixed(6);
                            document.getElementById('lng').value = lng.toFixed(6);
                        });
                    }
                    reportMap.invalidateSize();
                }, { once: true });

            } else {
                const authModal = new bootstrap.Modal(document.getElementById('authNudgeModal'));
                authModal.show();
            }
        })
        .catch(error => {
            console.error("Error validating secure report submission gatekeeper:", error);
            const authModal = new bootstrap.Modal(document.getElementById('authNudgeModal'));
            authModal.show();
        });
}

// FOR SUBMITTING REPORT
function submitReport(event) {
    event.preventDefault();
    
    const form = event.target;
    const payload = new FormData(form);

    fetch('backend/save_report.php', {
        method: 'POST',
        body: payload
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            alert(result.message);
            const reportModalEl = document.getElementById('reportFormModal');
            if (reportModalEl) {
                const modalInstance = bootstrap.Modal.getInstance(reportModalEl);
                if (modalInstance) modalInstance.hide();
            }
            form.reset();
            if (typeof renderMyReports === 'function') renderMyReports();
        } else {
            alert("Submission Failure: " + result.message);
        }
    })
    .catch(error => console.error("Error processing asynchronous hazard dispatch payload:", error));
}

// profile.php - LIST OF OWN REPORTS
function renderMyReports() {
    const container = document.getElementById('my-reports-list');
    if (!container) return;

    fetch('backend/get_my_reports.php')
        .then(res => res.json())
        .then(data => {
            if (!data.success || !data.reports || data.reports.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-5 border rounded bg-light">
                        <i class="bi bi-clipboard-x text-muted" style="font-size: 2.5rem;"></i>
                        <p class="text-muted mt-2">No reports submitted yet.</p>
                    </div>`;
                return;
            }

            const myReportsData = data.reports;

            container.innerHTML = myReportsData.map(report => {
                const verifyStatus = report.verification_status ? report.verification_status.toLowerCase() : 'pending';
                const hazardStatus = report.status ? report.status.toLowerCase() : 'safe';
                
                // 1. Logic para sa Verification Status Badge
                let verifyBadgeClass = 'bg-warning text-dark'; // Pending
                if (verifyStatus === 'approved') verifyBadgeClass = 'bg-success text-white';
                if (verifyStatus === 'rejected') verifyBadgeClass = 'bg-danger text-white';
                if (verifyStatus === 'resolved') verifyBadgeClass = 'bg-secondary text-white';

                // 2. Logic para sa Hazard Severity Status Badge (Dangerous/Warning/Safe)
                let hazardBadgeHTML = '';
                if (verifyStatus === 'approved' || verifyStatus === 'resolved') {
                    let hazardClass = 'bg-success text-white'; // Safe
                    if (hazardStatus === 'dangerous') hazardClass = 'bg-danger text-white';
                    if (hazardStatus === 'warning') hazardClass = 'bg-warning text-dark';
                    
                    // Gagawa tayo ng pangalawang badge sa tabi ng una
                    hazardBadgeHTML = `
                        <span class="badge ${hazardClass} rounded-pill px-3 py-1 mb-2 ms-1" style="font-size: 0.7rem; letter-spacing: 0.5px;">
                            ${hazardStatus.toUpperCase()}
                        </span>`;
                }

                return `
                    <div class="report-item p-3 mb-3 border rounded shadow-sm bg-white" id="my-report-card-${report.id}">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <span class="badge ${verifyBadgeClass} rounded-pill px-3 py-1 mb-2" style="font-size: 0.7rem; letter-spacing: 0.5px;">
                                    ${verifyStatus.toUpperCase()}
                                </span>
                                ${hazardBadgeHTML}
                                
                                <h6 class="fw-bold mb-1 mt-1">${report.hazard_type}</h6>
                            </div>
                            <small class="text-muted" style="font-size: 0.75rem;">${report.reported_at}</small>
                        </div>

                        <p class="text-muted mb-3 small">${report.description}</p>

                        <div class="d-flex align-items-center justify-content-between border-top pt-2 mt-2">
                            <div class="small text-muted">
                                <i class="bi bi-geo-alt-fill text-danger me-1"></i>
                                ${report.latitude}, ${report.longitude}
                            </div>
                            <button class="btn btn-sm text-danger p-0" onclick="deleteReport('${report.id}')">
                                <i class="bi bi-trash3"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        })
        .catch(error => {
            console.error("Error structural fetching personal database hazard logging layers:", error);
            container.innerHTML = `<div class="text-danger text-center small py-3">Error fetching personal safety logs matrix.</div>`;
        });
}

// UPDATED THIS PART TO RENDER REAL REPORTS FROM THE DATABASE - LYZETTE
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfileData();

    // INAYOS DITO: Binalot natin ang Marine Data sa Page Guard check para tumakbo lang kung nasaan ang mga Charts/Forecasts
    if (document.getElementById('forecastContainer') || document.getElementById('waveChart') || document.getElementById('tideChart')) {
        generateForecastCards();
        displayLiveDate();
        if (document.getElementById('waveChart')) setupWaveChart();
        if (document.getElementById('tideChart')) setupTideChart();
        fetchMarineData(); // Ligtas na itong patakbuhin dito boi
    }

    if (typeof L !== 'undefined') {
        if (document.getElementById('hazard-map-api')) initHomepageMapPreview();
        if (document.getElementById('map')) initLiveHazardMap();
    } else {
        console.warn("Leaflet Map framework integration is still loading... Retrying in a short window.");
        setTimeout(() => {
            if (typeof L !== 'undefined') {
                if (document.getElementById('hazard-map-api')) initHomepageMapPreview();
                if (document.getElementById('map')) initLiveHazardMap();
            }
        }, 500);
    }

    const termsModal = document.getElementById('termsModal');
    if (termsModal) {
        termsModal.addEventListener('shown.bs.modal', function (event) {
            const triggerElement = event.relatedTarget;
            const targetTabId = (triggerElement && triggerElement.hasAttribute('data-privacy')) ? 'privacy-tab' : 'terms-tab';
            setTimeout(() => {
                const tabTrigger = document.getElementById(targetTabId);
                if (tabTrigger) bootstrap.Tab.getOrCreateInstance(tabTrigger).show();
            }, 10);
        });
    }

    // FOR REPORTS
    const reportForm = document.getElementById('hazardForm');
    if (reportForm) {
        reportForm.addEventListener('submit', submitReport);
    }

    // TARGETS ALL COHORT TRAINER REDIRECTION BUTTONS ON THE HOMEPAGE - LYZETTE
    const gatekeeperButtons = document.querySelectorAll('.btn-gatekeeper');
    gatekeeperButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const navProfileText = document.querySelector('#profileDropdown span');
            const hasUserFirstName = navProfileText && navProfileText.innerText.trim() !== "Profile";

            const authControls = document.getElementById('auth-controls');
            const authButtonsAreHidden = authControls && authControls.classList.contains('d-none');

            const userIsAuthenticated = hasUserFirstName || authButtonsAreHidden;

            if (!userIsAuthenticated) {
                const authModalEl = document.getElementById('authNudgeModal');
                if (authModalEl) {
                    const authModal = bootstrap.Modal.getOrCreateInstance(authModalEl);
                    authModal.show();
                }
            } else {
                window.location.href = 'trainers.php';
            }
        });
    });

    if (document.getElementById('reports-list')) renderReports();
    if (document.getElementById('upcoming-list')) renderBookings();
    if (document.getElementById('my-reports-list')) renderMyReports();
    if (document.getElementById('tourist-bookings-list')) renderLiveTouristBookings();

    const modalEl = document.getElementById('trainerModal');
    if (modalEl) {
        trainerModal = new bootstrap.Modal(modalEl);
    }

    if (document.getElementById('trainers-list')) renderTrainers();

    if (document.getElementById('sideCardTitle')) {
        setupProfileEditorActions();
    }
    
    const avatarInput = document.getElementById('inputAvatar');
    if (avatarInput) {
        avatarInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const avatarPreview = document.getElementById('profileAvatar');
                    if (avatarPreview) avatarPreview.src = e.target.result;
                }
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
});

// FETCH AND BIND LIVE DATABASE DATA FOR ACTIVE USER PROFILE - LYZETTE
function loadUserProfileData() {
    const currentFile = window.location.pathname.split("/").pop();

    if (currentFile === "login.html" || currentFile === "signup.html") {
        return;
    }

    fetch('backend/get_profile_data.php')
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                if (currentFile === "profile.php") {
                    window.location.href = 'login.html';
                }
                return;
            }


            // SAFE LOGOUT BINDING STABILIZATION - LYZETTE
            const logoutBtn = document.getElementById('logoutBtn');
            const navLogoutBtn = document.getElementById('navLogoutBtn');

            function executeLogoutSession() {
                fetch('backend/logout.php')
                    .then(res => {
                        if (!res.ok) throw new Error("HTTP Error " + res.status);
                        return res.json();
                    })
                    .then(logoutRes => {
                        if (logoutRes.success) {
                            window.location.href = 'index.php';
                        } else {
                            alert("Logout failed: " + logoutRes.message);
                        }
                    })
                    .catch(error => console.error("Error executing safe session destroy:", error));
            }

            if (logoutBtn) logoutBtn.addEventListener('click', executeLogoutSession);
            if (navLogoutBtn) navLogoutBtn.addEventListener('click', executeLogoutSession);

            const avatarEl = document.getElementById('profileAvatar');
            if (avatarEl) {
                if (data.profile_pix) {
                    avatarEl.src = `uploads/${data.profile_pix}`;
                } else {
                    avatarEl.src = 'assets/default-avatar.png';
                }
            }

            const fullName = `${data.first_name} ${data.last_name}`;
            const nameHeader = document.getElementById('trainerName');
            if (nameHeader) nameHeader.innerText = fullName.toUpperCase();

            const navProfileText = document.querySelector('#profileDropdown span');
            if (navProfileText) {
                navProfileText.innerText = data.first_name;
            }

            const emailText = document.getElementById('trainerEmail');
            if (emailText) emailText.innerText = data.email;

            const phoneText = document.getElementById('trainerPhone');
            if (phoneText) phoneText.innerText = data.phone || 'Not Filled';

            const activePageFile = window.location.pathname.split("/").pop();
            const isViewingHomepage = activePageFile === "index.php" || activePageFile === "index.html" || activePageFile === "";

            if (isViewingHomepage) {
                const profileIsUncomplete = data.profile_completed == 0 || data.profile_completed === false;

                if (profileIsUncomplete) {
                    const nudgeModalElement = document.getElementById('touristFirstTimeModal');
                    if (nudgeModalElement) {
                        const touristPopup = new bootstrap.Modal(nudgeModalElement);
                        touristPopup.show();
                    }
                }
            }

            const inEmail = document.getElementById('inputEmail');
            if (inEmail) inEmail.value = data.email;

            const inPhone = document.getElementById('inputPhone');
            if (inPhone) inPhone.value = data.phone || '';

            if (data.role === 'Trainer') {
                const expEl = document.getElementById('trainerExp');
                if (expEl) expEl.innerText = data.experience ? `${data.experience} Years Training` : 'Not Filled';

                const inExp = document.getElementById('inputExp');
                if (inExp) inExp.value = data.experience || '';

                const inSpec = document.getElementById('inputSpecialization');
                if (inSpec) inSpec.value = data.specialization || '';

                const certInput = document.getElementById('inputCertifications');
                if (certInput) certInput.value = 'Verified Signup Certificates (See Below)';

                const inBio = document.getElementById('inputBio');
                if (inBio) inBio.value = data.bio || '';

                const docsContainer = document.getElementById('trainer-documents-container');
                if (docsContainer && data.documents) {
                    docsContainer.innerHTML = '';
                    const docLabels = {
                        dot_cert: 'DOT Accreditation Certificate',
                        training_cert: 'Professional Training Certificate',
                        water_safety: 'Water Safety & First Aid Card',
                        nbi_clearance: 'Valid NBI Clearance',
                        drug_test: 'Negative Drug Test Result'
                    };

                    Object.keys(data.documents).forEach(key => {
                        const fileName = data.documents[key];
                        if (fileName) {
                            docsContainer.innerHTML += `
                                <div class="document-item d-flex align-items-center p-2 border rounded bg-light mb-2 shadow-sm">
                                    <i class="bi bi-file-earmark-pdf-fill fs-4 me-2 text-danger"></i>
                                    <div class="text-truncate" style="max-width: 80%;">
                                        <div class="fw-bold small text-dark" style="font-size: 0.85rem; line-height: 1.2;">${docLabels[key]}</div>
                                        <span class="text-muted small text-truncate d-block" style="font-size: 0.75rem;">${fileName}</span>
                                    </div>
                                    <i class="bi bi-patch-check-fill text-success ms-auto fs-5" title="Verified by Admin"></i>
                                </div>`;
                        }
                    });
                }

                if (typeof renderBookings === 'function') {
                    renderBookings();
                }

            } else {
                if (typeof renderLiveTouristBookings === 'function') renderLiveTouristBookings();
                if (typeof renderMyReports === 'function') renderMyReports();
            }
        })
        .catch(error => {
            console.error('Error compiling profile data:', error);
        });
}

// TOGGLE THE INPUT FORMS AND CAMERA ICON IN EDIT MODE - LYZETTE
function setupProfileEditorActions() {
    const editBtn = document.getElementById('editToggleBtn');
    const saveBtn = document.getElementById('saveBtn');

    if (!editBtn) return;

    editBtn.addEventListener('click', function() {
        const isEditing = this.innerText === "Cancel";
        const displayFields = document.querySelectorAll('.display-field');
        const editFields = document.querySelectorAll('.edit-field');

        const mainInputs = document.querySelectorAll('.main-input, input.form-control, textarea.form-control, select.form-select');

        const cameraLabel = document.querySelector('label[for="inputAvatar"]');

        if (isEditing) {
            this.innerText = "Edit Profile";
            this.classList.replace('btn-secondary', 'btn-outline-primary');
            if (saveBtn) saveBtn.classList.add('d-none');

            displayFields.forEach(f => f.classList.remove('d-none'));
            editFields.forEach(f => f.classList.add('d-none'));
            mainInputs.forEach(i => i.disabled = true);

            if (cameraLabel) cameraLabel.classList.add('d-none');
        } else {
            this.setAttribute('data-old-text', this.innerText);
            this.innerText = "Cancel";
            this.classList.replace('btn-outline-primary', 'btn-secondary');
            if (saveBtn) saveBtn.classList.remove('d-none');

            displayFields.forEach(f => f.classList.remove('d-none'));
            editFields.forEach(f => f.classList.remove('d-none'));
            mainInputs.forEach(i => i.disabled = false);

            if (cameraLabel) cameraLabel.classList.remove('d-none');
        }
    });

    saveBtn?.addEventListener('click', saveProfileChanges);
}

// VALIDATE MANDATORY FIELDS AND SEND UPDATES WITH PROFILE PICTURE - LYZETTE
function saveProfileChanges() {
    const updatedEmail = document.getElementById('inputEmail').value.trim();
    const updatedPhone = document.getElementById('inputPhone').value.trim();
    const updatedPassword = document.getElementById('inputPassword').value;

    const expInput = document.getElementById('inputExp');
    const specInput = document.getElementById('inputSpecialization');
    const bioInput = document.getElementById('inputBio');
    const avatarInput = document.getElementById('inputAvatar');

    if (!updatedPhone) { alert("Phone Number is mandatory!"); return; }
    if (expInput && !expInput.value.trim()) { alert("Experience Level is mandatory!"); return; }
    if (specInput && !specInput.value.trim()) { alert("Specialization is mandatory!"); return; }
    if (bioInput && !bioInput.value.trim()) { alert("Bio / About Me is mandatory!"); return; }

    const formData = new FormData();
    formData.append('email', updatedEmail);
    formData.append('phone', updatedPhone);

    if (updatedPassword.trim() !== '') {
        formData.append('password', updatedPassword);
    }

    if (expInput) formData.append('experience', expInput.value);
    if (specInput) formData.append('specialization', specInput.value);
    if (bioInput) formData.append('bio', bioInput.value);

    if (avatarInput && avatarInput.files[0]) {
        formData.append('profile_pix', avatarInput.files[0]);
    }

    fetch('backend/update_profile.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Server returned HTTP status " + response.status);
        }
        return response.json();
    })
    .then(result => {
        if (result.success) {
            alert("Profile synchronized successfully!");
            location.reload();
        } else {
            alert("Database Error: " + result.message);
        }
    })
    .catch(error => {
        console.error('Submission Error:', error);
        alert("Server validation error or network failure. Check console elements.");
    });
}

// FETCH AND BIND LIVE DATABASE DATA FOR TOURIST BOOKINGS VIEW FEED - LYZETTE
function renderLiveTouristBookings() {
    const listContainer = document.getElementById('tourist-bookings-list');
    if (!listContainer) return;

    fetch('backend/get_tourist_bookings.php')
        .then(res => res.json())
        .then(data => {
            if (!data.success || data.bookings.length === 0) {
                listContainer.innerHTML = `
                    <div class="text-center py-4 text-muted bg-white border rounded shadow-sm">
                        <i class="bi bi-calendar-x fs-2 text-secondary"></i>
                        <p class="small mb-0 mt-2">You haven't scheduled any surf lesson bookings yet.</p>
                    </div>`;
                return;
            }

            listContainer.innerHTML = data.bookings.map(booking => {
                const isUpcoming = booking.status.toLowerCase() === 'upcoming';

                let statusColor = 'text-muted';
                if (booking.status.toLowerCase() === 'completed') statusColor = 'text-success';
                if (booking.status.toLowerCase() === 'cancelled') statusColor = 'text-danger';

                return `
                    <div class="booking-item p-3 mb-3 border rounded shadow-sm bg-white">
                        <div class="d-flex justify-content-between align-items-center w-100 flex-wrap flex-sm-nowrap">

                            <div class="pe-2 flex-grow-1">
                                <h6 class="fw-bold mb-1 text-dark" style="font-size: 1.05rem;">${booking.trainer_name}</h6>

                                <div class="mb-2 info-contact-links">
                                    <p class="text-muted mb-0 small text-break"><i class="bi bi-envelope me-2"></i>${booking.trainer_email}</p>
                                    <p class="text-muted mb-0 small"><i class="bi bi-telephone me-2"></i>${booking.trainer_phone}</p>
                                </div>

                                <div class="row g-0 small text-secondary">
                                    <div class="col-12 mb-1"><i class="bi bi-calendar3 me-2"></i>${booking.date}</div>
                                    <div class="col-12 mb-1"><i class="bi bi-clock me-2"></i>${booking.selected_time}</div>
                                    <div class="col-12"><i class="bi bi-geo-alt me-2"></i>${booking.location}</div>
                                </div>
                            </div>

                            <div class="mt-2 mt-sm-0 text-end d-flex align-items-center justify-content-end text-nowrap" style="min-width: 120px;">
                                ${isUpcoming ? `
                                    <button class="btn btn-sm btn-outline-danger px-3 px-sm-4 rounded-pill d-flex align-items-center gap-1"
                                            style="border-color: #e5b2b2; color: #cc3737; padding-top: 5px; padding-bottom: 5px; font-weight: 500; font-size: 0.85rem;"
                                            onclick="cancelBookingAction('${booking.id}')">
                                        <i class="bi bi-x-circle"></i> Cancel
                                    </button>
                                ` : `
                                    <div class="d-flex align-items-center gap-2">
                                        <span class="fw-bold small text-uppercase ${statusColor} pe-2" style="font-size: 0.85rem; letter-spacing: 0.8px;">
                                            ${booking.status}
                                        </span>
                                        <button class="btn btn-sm text-danger p-1" title="Delete from history" onclick="deleteTouristBooking('${booking.id}')">
                                            <i class="bi bi-trash3-fill" style="font-size: 1.1rem;"></i>
                                        </button>
                                    </div>
                                `}
                            </div>

                        </div>
                    </div>
                `;
            }).join('');
        })
        .catch(error => console.error("Error executing profile bookings loader sync:", error));
}

function renderLiveTouristReports() {
    const list = document.getElementById('my-reports-list');
    if (!list) return;
    list.innerHTML = `
        <div class="text-center py-4 text-muted bg-light border rounded">
            <i class="bi bi-shield-check fs-2 text-success"></i>
            <p class="small mb-0 mt-2">All submitted safety hazard logs verified active on Bagasbas Beach Map.</p>
        </div>`;
}

/*
// AUTOMATICALLY BIND PREVIEW HANDLER WHEN THE PAGE LOADS - LYZETTE
document.addEventListener('DOMContentLoaded', () => {
    const avatarInput = document.getElementById('inputAvatar');

    if (avatarInput) {
        avatarInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    const avatarPreview = document.getElementById('profileAvatar');
                    if (avatarPreview) {
                        avatarPreview.src = e.target.result;
                    }
                }

                reader.readAsDataURL(this.files[0]);
            }
        });
    }
}); */

// HOMEPAGE HAZARD MAP MINI PREVIEW - PLEASE PAAYOS TRINY KO KANINA KAYA BAKA MAY NABAGO PERO DI SIYA NASHOW

function initHomepageMapPreview() {
    const previewEl = document.getElementById('hazard-map-api');
    if (!previewEl) return;

    try {
        const mapPreview = L.map('hazard-map-api', {
            zoomControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            touchZoom: false
        }).setView([14.1369, 122.9813], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(mapPreview);

        setTimeout(() => {
            mapPreview.invalidateSize();
        }, 300);

        // FETCH LIVE HAZARD REPORTS
        fetch('backend/get_active_hazards.php')
            .then(res => {
                // Kung may error o PHP crash, huwag piliting mag-json() para iwas crash
                if (!res.ok) {
                    throw new Error("Server returned status " + res.status);
                }
                return res.text();
            })
            .then(text => {
               
                if (text.trim().startsWith('<')) {
                    console.error("Backend Error: 'get_active_hazards.php' outputted HTML error layout instead of clear JSON data.");
                    return;
                }
                
                const data = JSON.parse(text);
                if (!data.success || !data.hazards || data.hazards.length === 0) {
                    console.log("No active hazards found.");
                    return;
                }

                data.hazards.forEach(hazard => {
                    const lat = parseFloat(hazard.latitude);
                    const lng = parseFloat(hazard.longitude);
                    if (isNaN(lat) || isNaN(lng)) return;

                    const marker = L.marker([lat, lng]).addTo(mapPreview);
                    marker.bindPopup(`
                        <div style="min-width:200px;">
                            <h6 class="fw-bold mb-1">${hazard.hazard_type}</h6>
                            <p class="small text-muted mb-1">${hazard.description}</p>
                            <small><strong>Status:</strong> ${hazard.status}</small>
                        </div>
                    `);
                });
            })
            .catch(error => {
                console.error("Error loading homepage hazard map components safely:", error);
            });
    } catch (e) {
        console.error("Leaflet rendering context failure caught:", e);
    }
}

// FULL HAZARD MAP PAGE - LOAD APPROVED HAZARDS FROM DATABASE
function initLiveHazardMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    try {
        const map = L.map('map').setView([14.1369, 122.9813], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        setTimeout(() => {
            map.invalidateSize();
        }, 300);

        fetch('backend/get_active_hazards.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to reach endpoint safely");
                }
                return response.text(); 
            })
            .then(text => {
                if (text.trim().startsWith('<')) {
                    console.error("Hazard Map Database Script currently outputting invalid server frames.");
                    return;
                }
                
                const data = JSON.parse(text);
                console.log(data);

                if (!data.success || !data.hazards || data.hazards.length === 0) {
                    console.log("No approved hazards found.");
                    return;
                }

                data.hazards.forEach(hazard => {
                    const lat = parseFloat(hazard.latitude);
                    const lng = parseFloat(hazard.longitude);
                    if (isNaN(lat) || isNaN(lng)) return;

                    const marker = L.marker([lat, lng]).addTo(map);
                    let badgeColor = 'warning';

                    if (hazard.status && hazard.status.toLowerCase() === 'dangerous') {
                        badgeColor = 'danger';
                    }

                    marker.bindPopup(`
                        <div style="min-width:220px;">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <h6 class="fw-bold mb-0">${hazard.hazard_type}</h6>
                                <span class="badge bg-${badgeColor}">${hazard.status}</span>
                            </div>
                            <p class="small text-muted mb-2">${hazard.description}</p>
                            <hr>
                            <div class="small text-secondary">
                                <div><i class="bi bi-person"></i> ${hazard.reporter}</div>
                                <div><i class="bi bi-calendar"></i> ${hazard.reported_at}</div>
                            </div>
                        </div>
                    `);
                });
            })
            .catch(error => {
                console.error("Hazard map data loading error captured gracefully:", error);
            });
    } catch (err) {
        console.error("Leaflet full-screen contextual map processing blocked:", err);
    }
}

// FOR DELETING REPORTS
function deleteReport(id) {
    if (!confirm("Are you sure you want to permanently delete this safety report from your log history?")) {
        return;
    }

    fetch(`backend/delete_report.php?id=${id}`)
    .then(res => {
        if (!res.ok) throw new Error("HTTP validation breakdown.");
        return res.json();
    })
    .then(result => {
        if (result.success) {
            alert(result.message);
            if (typeof renderMyReports === 'function') renderMyReports();
        } else {
            alert("Error: " + result.message);
        }
    })
    .catch(error => {
        console.error("Error executing report deletion cycle:", error);
    });
}

// FOR DELETING BOOKINGS
function deleteTouristBooking(bookingId) {
    if (!confirm("Are you sure you want to remove and clear this booking record from your logs? This cannot be undone.")) {
        return;
    }

    const payload = new FormData();
    payload.append('booking_id', bookingId);

    fetch('backend/delete_tourist_booking.php', {
        method: 'POST',
        body: payload
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            alert(result.message);
            if (typeof renderLiveTouristBookings === 'function') renderLiveTouristBookings();
        } else {
            alert("Delete Operation Failure: " + result.message);
        }
    })
    .catch(error => {
        console.error("Error executing safe data destruction pipeline:", error);
        alert("Network communication timeout framework error.");
    });
}