/* BACKEND AND LEAD ARCHITECT INSTRUCTION:
        THROUGHOUT THE SCRIPT, I HAVE COMMENTS FOR YOU. PLEASE READ AND MAKE SURE THAT THAT'S THE ONLY THING THAT WILL BE CHANGE/ADDED
        BECAUSE MOST OF THE SCRIPTS ARE RELATED TO UI AND ITS FUNCTIONALITY.

        *IF DONE, PLEASE REMOVE THE COMMENT I MADE FOR YOU.

        *IN ANY CASE, THAT SOME NEEDS TO BE CHANGED BUT I DON'T HAVE COMMENT FOR IT, PLEASE INFORM ME.

        *DONT REMOVE COMMENTS THAT ARE NOT FOR YOU.

        *SCRIPT FOR ADMIN IS IN admin-script.js AND CSS FOR ADMIN is in admin.css
*/

// ROLE SELECTION - signup.html
let selectedRole = 'Tourist'; // BACKEND DEVELOPER: REPLACE THIS WITH USER STATE FROM DATABASE

function setRole(role, btn) {
    selectedRole = role; 

    const buttons = document.querySelectorAll('.type-btn');
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const card = document.querySelector('.signup-card');
    const trainerFields = document.getElementById('trainerFields');
    const consentText = document.getElementById('trainerConsentText'); 
    const termsCheck = document.getElementById('termsCheck'); 
    const fileInputs = trainerFields.querySelectorAll('input[type="file"]');

    if (role === 'Trainer') {
        card.classList.add('trainer-expanded');
        consentText.style.display = 'block'; 
        fileInputs.forEach(input => input.required = true);
        termsCheck.required = true; 
    } else {
        card.classList.remove('trainer-expanded');
        consentText.style.display = 'none';
        fileInputs.forEach(input => input.required = false);
        termsCheck.required = false; 
        termsCheck.checked = false;  
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

//Tide height in Forecast Cards
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

//Forecast Cards data - weekly
function updateForecastCards(marineDaily, weatherDaily) {
    if (!marineDaily || !weatherDaily) return;

    const dayMap = ['sun', 'mon', 'tue', 'wed', 'thurs', 'fri', 'sat'];

    marineDaily.time.forEach((dateStr, index) => {
        const date = new Date(dateStr);
        const dayName = dayMap[date.getDay()];

        const waveEl = document.getElementById(`wave-${dayName}`);
        const windEl = document.getElementById(`wind-${dayName}`);

        if (waveEl) {
            waveEl.innerText = marineDaily.wave_height_max[index]?.toFixed(1) ?? "0.0";
        }

        if (windEl) {
            const wind = weatherDaily.wind_speed_10m_max?.[index];
            windEl.innerText = wind ? wind.toFixed(1) : "--";
        }
    });
}

//Surf/Wind Condition
function updateSurfCondition(hourlyData) {
    const wave = hourlyData.wave_height[0];
    const wind = hourlyData.wind_speed_10m[0];

    let condition = "POOR";

    if (wave >= 1.5 && wind <= 15) {
        condition = "GOOD";
    } else if (wave >= 1.0 && wind <= 25) {
        condition = "FAIR";
    }

    document.getElementById('surf-condition').innerText = condition;
}

// HOURLY WAVE HEIGHT GRAPH - marine_data.html (NEEDS API)
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
                    suggestedMin: -2,
                    suggestedMax: 2,
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

//API IntegRATION - OPEN METEO
let globalTideData = [];
async function fetchMarineData() {
    //Coordinates of Bagasbas Beach
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

    } catch (error) {
        console.error("Architect Error: API could not be reached.", error);
    }
}

//Wave chart hourly data
function updateWaveChart(hourlyData) {
    if (!myWaveChart || !hourlyData) return;

    const labels = hourlyData.time.slice(0, 24).map(t => {
        const date = new Date(t);
        return date.toLocaleTimeString([], {
           hour: 'numeric',
           hour12: true
        });
    });

    myWaveChart.data.labels = labels;
    myWaveChart.data.datasets[0].data = hourlyData.wave_height.slice(0, 24);
    myWaveChart.update();
}

//update tide info
function updateTideInfo(tideData) {
    const now = new Date();

    const nextHigh = tideData.find(t => t.type === "high" && new Date(t.time) > now);
    const nextLow = tideData.find(t => t.type === "low" && new Date(t.time) > now);

    if (nextHigh) {
        const highDate = new Date(nextHigh.time);
        document.getElementById('next-high-time').innerText = highDate.toLocaleTimeString();

        const diff = (highDate - now) / 1000;
        document.getElementById('high-h').innerText = Math.floor(diff / 3600);
        document.getElementById('high-m').innerText = Math.floor((diff % 3600) / 60);
        document.getElementById('high-s').innerText = Math.floor(diff % 60);
    }

    if (nextLow) {
        const lowDate = new Date(nextLow.time);
        document.getElementById('next-low-time').innerText = lowDate.toLocaleTimeString();

        const diff = (lowDate - now) / 1000;
        document.getElementById('low-h').innerText = Math.floor(diff / 3600);
        document.getElementById('low-m').innerText = Math.floor((diff % 3600) / 60);
        document.getElementById('low-s').innerText = Math.floor(diff % 60);
    }

    document.getElementById('local-time').innerText = now.toLocaleTimeString();
}


//Best Surfing Window
function calculateBestSurfWindow(hourlyData) {
    if (!hourlyData) return;

    let bestIndex = 0;
    let bestScore = -Infinity;

    for (let i = 0; i < hourlyData.wave_height.length; i++) {
        const wave = hourlyData.wave_height[i];
        const wind = hourlyData.wind_speed_10m[i];

        const score = wave - (wind * 0.1);

        if (score > bestScore) {
            bestScore = score;
            bestIndex = i;
        }
    }

    const bestTime = new Date(hourlyData.time[bestIndex]).getHours() + ":00";

    document.getElementById('best-time-window').innerText = bestTime;
}

// TIDE CHART - marine_data.html (NEEDS API)
let myTideChart;

function setupTideChart() {

    const ctxTide = document.getElementById('tideChart').getContext('2d');

    myTideChart = new Chart(ctxTide, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'High Tide',
                    data: [],
                    borderColor: '#ff0000',
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Low Tide',
                    data: [],
                    borderColor: '#0000ff',
                    backgroundColor: 'rgba(0, 0, 255, 0.1)',
                    tension: 0.4,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    grid: { color: '#f0f0f0' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

//Tide Chart with data
function updateTideChart(tideData) {
    if (!myTideChart || !tideData || !tideData.length) return;

    const labels = [];
    const highTide = [];
    const lowTide = [];

    tideData.forEach(entry => {
        const date = new Date(entry.time);

        const formattedLabel =
            date.toLocaleDateString([], {
                month: 'short',
                day: 'numeric'
            }) + " " +
            date.toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit'
            });

        labels.push(formattedLabel);

        if (entry.type === "high") {
            highTide.push(entry.height);
            lowTide.push(null);
        } else {
            highTide.push(null);
            lowTide.push(entry.height);
        }
    });

    myTideChart.data.labels = labels;

    myTideChart.data.datasets[0].data = highTide;
    myTideChart.data.datasets[1].data = lowTide;

    myTideChart.update();
}

//Fetch Tide Data from Stormglass API
async function fetchTideData() {
    const lat = 14.1369;
    const lon = 122.9813;

    const url = `https://api.stormglass.io/v2/tide/extremes/point?lat=${lat}&lng=${lon}`;

    try {
        const res = await fetch(url, {
            headers: {
                'Authorization': 'ca0d194a-4bc2-11f1-b099-0242ac120004-ca0d19b8-4bc2-11f1-b099-0242ac120004'
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

//Tide Summary
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

        const diff = new Date(target.time) - new Date();
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);

        document.getElementById(`${prefix}-h`).innerText = h;
        document.getElementById(`${prefix}-m`).innerText = m;
        document.getElementById(`${prefix}-s`).innerText = s;
    }

    if (nextHigh) {
        document.getElementById("next-high-time").innerText =
            new Date(nextHigh.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    if (nextLow) {
        document.getElementById("next-low-time").innerText =
            new Date(nextLow.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    updateCountdown(nextHigh, "high");
    updateCountdown(nextLow, "low");

    // LIVE CLOCK
    setInterval(() => {
        const now = new Date();
        document.getElementById("local-time").innerText =
            now.toLocaleTimeString();
        updateCountdown(nextHigh, "high");
        updateCountdown(nextLow, "low");
    }, 1000);
}

//Bottom weather details
function updateWeatherDetails(weatherHourly, marineHourly) {
    const now = new Date();
    const currentIndex = weatherHourly.time.findIndex(t => {
    const d = new Date(t);
        return d.getHours() === now.getHours() &&
            d.getDate() === now.getDate();
    });

    if (currentIndex === -1) return;

    const humidity = weatherHourly.relative_humidity_2m[currentIndex];
    const uv = weatherHourly.uv_index[currentIndex];
    const visibility = (weatherHourly.visibility[currentIndex] / 1000).toFixed(1);

    const windDir = weatherHourly.wind_direction_10m[currentIndex];
    const windSpd = weatherHourly.wind_speed_10m[currentIndex];

    const windKph = windSpd.toFixed(1);

    document.getElementById('current-wind-speed').innerText = windKph;
    document.getElementById('current-wind-dir').innerText = getCardinalDirection(windDir);

    if (document.getElementById('detail-humidity'))
        document.getElementById('detail-humidity').innerText = `${humidity}%`;
    if (document.getElementById('detail-uv'))
        document.getElementById('detail-uv').innerText = uv;
    if (document.getElementById('detail-visibility'))
        document.getElementById('detail-visibility').innerText = `${visibility} km`;

    const windDirEl = document.getElementById('detail-wind-dir');
    if (windDirEl) {
        windDirEl.innerText = `${windDir}° ${getCardinalDirection(windDir)}`;
    }

    console.log("Wind Dir Raw:", windDir);
    console.log("Wind Speed Raw:", windSpd);
}

//Convert degrees to NSEW
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

// FRONTEND LOGIC ONLY: HANDLES UI STATE FOR THE DEMO
// BACKEND DEVELOPER: REPLACE LOCALSTORAGE WITH BACKEND AUTHENTICATION
function updateNavbarBasedOnRole() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');

    const bookTrainerLink = document.getElementById('nav-book-trainer');
    const myBookingsLink = document.getElementById('nav-my-bookings');

    if (isLoggedIn) {
        if (userRole === 'Tourist' && bookTrainerLink) {
            bookTrainerLink.classList.remove('d-none');
        } else if (userRole === 'Trainer' && myBookingsLink) {
            myBookingsLink.classList.remove('d-none');
        }
    }
}
// END OF FRONTEND LOGIC FOR DEMO

document.addEventListener('DOMContentLoaded', () => {
    generateForecastCards();
    displayLiveDate();

    if (document.getElementById('waveChart')) setupWaveChart();
    if (document.getElementById('tideChart')) setupTideChart();


    fetchMarineData();

    updateNavbarBasedOnRole();

    // DATA PRIVACY ACT AND TERM AND CONDITION TAB SWITCHING
    const termsModal = document.getElementById('termsModal');
    if (termsModal) {
        termsModal.addEventListener('shown.bs.modal', function (event) {
            const triggerElement = event.relatedTarget;
            if (triggerElement && triggerElement.hasAttribute('data-privacy')) {
                setTimeout(() => {
                    const privacyTabTrigger = document.getElementById('privacy-tab');
                    if (privacyTabTrigger) bootstrap.Tab.getOrCreateInstance(privacyTabTrigger).show();
                }, 10);
            } else {
                setTimeout(() => {
                    const termsTabTrigger = document.getElementById('terms-tab');
                    if (termsTabTrigger) bootstrap.Tab.getOrCreateInstance(termsTabTrigger).show();
                }, 10);
            }
        });
    }

    // FOR THE SIGN UP REQUIRED POPUP
    const trainerButtons = document.querySelectorAll('.btn-trainer, .btn-see-trainers');

    // BACKEND DEVELOPER: REPLACE LOCALSTORAGE
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    trainerButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (!isLoggedIn) {
                e.preventDefault();

                const authModal = new bootstrap.Modal(document.getElementById('authNudgeModal'));
                authModal.show();
            }
        });
    });

    // FRONTEND LOGIC ONLY: HANDLES UI STATE FOR THE DEMO
    // BACKEND/LEAD ARCHITECT: REPLACE LOCALSTORAGE
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', selectedRole);
            window.location.href = "index.html";
        });
    }

});

