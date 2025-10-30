const Input = document.getElementById("Input");
const SearchButton = document.getElementById("SearchButton");
const Location = document.getElementById("Location");

const APIKey = "abf07235f31775d6474d4af2e08868ed";

const cityName = document.querySelector("#cityName");
const TemperatureAmount = document.querySelector("#TemperatureAmount");
const tempFeel = document.querySelector("#tempFeel");
const Humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#windSpeed");
const MiddleSVGweather = document.querySelector("#MiddleSVG-weather");
const CloudToText = document.querySelector("#CloudToText");
const fullDateShort = document.querySelector("#fullDateShort");
const CurrentTime = document.querySelector("#CurrentTime");
const dayName = document.querySelector("#dayName");

Input.addEventListener("keypress", (event) => {
    if (Input.value.trim() != "") {
        if (event.key == "Enter") {
            UpdateWeatherInfo(Input.value);
            
        }
    }
});
SearchButton.addEventListener("click", () => {
    if (Input.value.trim() != "") {
        UpdateWeatherInfo(Input.value);
        
    }
});

// Location button functionality
Location.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                
                // Get city name from coordinates
                getCityFromCoordinates(latitude, longitude);
                
            },
            (error) => {
                console.error("Error getting location:", error);
                alert("Unable to get your location. Please enter a city manually.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

const topleftWrapper = document.querySelector(".city-DDT-status");
const weatherInformationWrapper = document.querySelector(".weatherInformationWrapper");
const UpcomingPredictionsWrapper = document.querySelector(".UpcomingPredictionsWrapper");
const mainWrapper = document.querySelector(".mainWrapper");

// Store city timezone for accurate time calculations
let cityTimezoneOffset = 0; // in seconds from UTC
let currentWeatherId = null; // Store current weather ID for icon updates

//​​​​‍============================= VISIBILTY TOGGLE =============================

function visibiltyToggle() {
    if ((topleftWrapper.style.display = "none")) {
        topleftWrapper.style.display = "block";
    }
    if ((weatherInformationWrapper.style.visibility = "hidden")) {
        weatherInformationWrapper.style.visibility = "visible";
    }
    if ((UpcomingPredictionsWrapper.style.visibility = "hidden")) {
        UpcomingPredictionsWrapper.style.visibility = "visible";
    }
}

//​​​​‌=============================== IS DAY TIME ================================

function isDayTime() {
    // Get current UTC time and add city timezone offset
    const now = new Date();
    const cityTime = new Date(now.getTime() + (cityTimezoneOffset * 1000));
    const currentHour = cityTime.getUTCHours();
    return currentHour >= 6 && currentHour < 18; // 6 AM to 6 PM is considered day
}

//​​​​‌===================== UPDATE BACKGROUND BASED ON TIME ======================

function updateBackgroundBasedOnTime() {
    if (isDayTime()) {
        mainWrapper.style.backgroundImage = 'url("backgrounds/background-day.png")';
    } else {
        mainWrapper.style.backgroundImage = 'url("backgrounds/background-night.png")';
    }
}

//​​​​‌============================ FETCH WEATHER INFO ============================

async function FetchWeatherInfo(EndPoint, city) {
    const APIUrl = `https://api.openweathermap.org/data/2.5/${EndPoint}?q=${city}&appid=${APIKey}&units=metric`;
    const response = await fetch(APIUrl);
    return response.json();
}

//​​​​‌======================== GET CITY FROM COORDINATES =========================

async function getCityFromCoordinates(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}`);
        const data = await response.json();
        
        if (data.name) {
            // Put the city name in the input field
            Input.value = data.name;
            // Automatically fetch weather for this location
            UpdateWeatherInfo(data.name);
        } else {
            alert("Could not determine city name from your location.");
        }
    } catch (error) {
        console.error("Error getting city from coordinates:", error);
        alert("Error getting city information from your location.");
    }
}

//​​​​‌=========================== UPDATE WEATHER INFO ============================

async function UpdateWeatherInfo(city) {
    const weatherData = await FetchWeatherInfo("weather", city);
    console.log(weatherData);
    const {
        name: country,
        main: { feels_like, humidity, temp },
        wind: { speed },
        weather: [{ id, description }],
        timezone: timezoneOffset
    } = weatherData;

    // Store the city's timezone offset
    cityTimezoneOffset = timezoneOffset;
    
    // Store the current weather ID for later updates
    currentWeatherId = id;

    if (weatherData.cod != 200) {
        return;
    } else {
        cityName.textContent = country;
        TemperatureAmount.textContent = Math.round(temp);
        tempFeel.textContent = weatherData.main.feels_like;
        Humidity.textContent = weatherData.main.humidity;
        windSpeed.textContent = weatherData.wind.speed;
        MiddleSVGweather.src = `icons/${weatherIconUpdate(id)}`;
        CloudToText.textContent = description;
        dayName.textContent = getTodaysDay();
        CurrentTime.textContent = getFormattedTime();
        fullDateShort.textContent = getTodaysDate();

        // Update background based on current time
        updateBackgroundBasedOnTime();

        await updateForecastInfo(city);
    }
}

//​​​​‌=========================== WEATHER ICON UPDATE ============================

function weatherIconUpdate(id) {
    const isDay = isDayTime();
    const timeSuffix = isDay ? "d" : "n";
    
    if (id <= 232) return `11${timeSuffix}.svg`;
    if (id <= 321) return `09${timeSuffix}.svg`;
    if (id <= 504) return `10${timeSuffix}.svg`;
    if (id <= 511) return `13${timeSuffix}.svg`;
    if (id <= 531) return `09${timeSuffix}.svg`;
    if (id <= 622) return `13${timeSuffix}.svg`;
    if (id <= 781) return `50${timeSuffix}.svg`;
    if (id <= 800) return `01${timeSuffix}.svg`;
    if (id == 801) return `02${timeSuffix}.svg`;
    if (id == 802) return `03${timeSuffix}.svg`;
    if (id == 803) return `04${timeSuffix}.svg`;
    if (id == 804) return `04${timeSuffix}.svg`;
}

//​​​​‌======================= FORECAST WEATHER ICON UPDATE =======================

function forecastWeatherIconUpdate(id) {
    // For forecast items, always use day icons based on weather ID only
    if (id <= 232) return `11d.svg`;
    if (id <= 321) return `09d.svg`;
    if (id <= 504) return `10d.svg`;
    if (id <= 511) return `13d.svg`;
    if (id <= 531) return `09d.svg`;
    if (id <= 622) return `13d.svg`;
    if (id <= 781) return `50d.svg`;
    if (id <= 800) return `01d.svg`;
    if (id == 801) return `02d.svg`;
    if (id == 802) return `03d.svg`;
    if (id == 803) return `04d.svg`;
    if (id == 804) return `04d.svg`;
}

//​​​​‌============================== GET TODAYS DAY ==============================

function getTodaysDay() {
    const currentDATE = new Date();
    const currentDAY = currentDATE.toLocaleDateString("en-US", { weekday: "long" });
    return currentDAY;
}

//​​​​‌============================= GET TODAYS DATE ==============================

function getTodaysDate() {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString("en-US", { month: "long" });
    const year = today.getFullYear();
    return `${day} ${month} ${year}`;
}

//​​​​‌========================== GET UPCOMING DAY NAME ===========================

function getUpcomingDayName(dayOffset) {
    const today = new Date();
    const upcomingDate = new Date(today);
    upcomingDate.setDate(today.getDate() + dayOffset + 1); // +1 because we want next day onwards
    return upcomingDate.toLocaleDateString("en-US", { weekday: "long" });
}

//​​​​‌=========================== UPDATE FORECAST INFO ===========================

async function updateForecastInfo(city) {
    const forecastData = await FetchWeatherInfo("forecast", city);
    UpcomingPredictionsWrapper.innerHTML = "";
    visibiltyToggle();
    const Timetaken = "12:00:00";
    const todaysDate = new Date().toISOString().split("T")[0];
    let dayCounter = 0; // Track which upcoming day we're on
    forecastData.list.forEach((ForecastWeather) => {
        if (ForecastWeather.dt_txt.includes(Timetaken) && !ForecastWeather.dt_txt.includes(todaysDate)) {
            updateForecastItems(ForecastWeather, dayCounter);
            dayCounter++;
        }
    });
}

//​​​​‌========================== UPDATE FORECAST ITEMS ===========================

function updateForecastItems(weatherDATA, dayCounter) {
    const {
        main: { temp_min, temp_max },
        weather: [{ id, description }],
    } = weatherDATA;
    const upcomingDayName = getUpcomingDayName(dayCounter);
    const ForecastItem = `
            <div class="upcomingWeekPreditions"">
                <p class="upcomingday-Name">${upcomingDayName}</p>
                <img src="icons/${forecastWeatherIconUpdate(id)}" alt="" class="upcomingdays-svg">
                <p><span class="minimumTemp">${Math.round(temp_min)}</span>° -  <span class="maximumTemp">${Math.round(temp_max)}<span>°</p>
                <p class="upcomingday-cloudType">${description}</p>
            </div>
`;
    UpcomingPredictionsWrapper.insertAdjacentHTML("beforeend", ForecastItem);
}

//​​​​‌============================ GET FORMATTED TIME ============================

function getFormattedTime() {
    // Get current UTC time and add city timezone offset
    const now = new Date();
    const cityTime = new Date(now.getTime() + (cityTimezoneOffset * 1000));
    
    let hours = cityTime.getUTCHours();
    const minutes = cityTime.getUTCMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    // convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // handle 0 as 12
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${formattedMinutes} ${ampm}`;
}
setInterval(() => {
    getFormattedTime();
}, 1000);

// Initialize background on page load
updateBackgroundBasedOnTime();

// Check for time changes every minute to update background and icons
setInterval(() => {
    updateBackgroundBasedOnTime();
    // If weather data is already loaded, refresh the main weather icon with proper weather code
    if (currentWeatherId !== null) {
        MiddleSVGweather.src = `icons/${weatherIconUpdate(currentWeatherId)}`;
    }
}, 60000); // Check every minute

