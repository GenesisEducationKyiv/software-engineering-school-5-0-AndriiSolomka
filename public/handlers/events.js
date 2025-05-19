import {
  fetchWeather,
  subscribeToWeatherUpdates,
} from '../services/weatherApi.js';
import { validateEmail } from '../utils/validators.js';
import {
  showError,
  showElement,
  hideElement,
  resetButton,
} from '../utils/dom.js';

export function setupEventListeners() {
  const citySearchInput = document.getElementById('citySearch');
  const searchBtn = document.getElementById('searchBtn');
  const weatherResult = document.getElementById('weatherResult');
  const weatherError = document.getElementById('weatherError');
  const cityNameElement = document.getElementById('cityName');
  const temperatureElement = document.getElementById('temperature');
  const humidityElement = document.getElementById('humidity');
  const descriptionElement = document.getElementById('description');
  const cityInput = document.getElementById('city');

  const subscriptionForm = document.getElementById('subscriptionForm');
  const subscriptionSuccess = document.getElementById('subscriptionSuccess');
  const subscriptionError = document.getElementById('subscriptionError');

  searchBtn.addEventListener('click', async () => {
    const city = citySearchInput.value.trim();
    if (!city) return showError(weatherError, 'Please enter a city name');

    try {
      hideElement(weatherError);
      hideElement(weatherResult);
      searchBtn.textContent = 'Loading...';
      searchBtn.disabled = true;

      const data = await fetchWeather(city);

      cityNameElement.textContent = city;
      temperatureElement.textContent = `${data.temperature}°C`;
      humidityElement.textContent = `${data.humidity}%`;
      descriptionElement.textContent = data.description;

      showElement(weatherResult);
      cityInput.value = city;
    } catch (err) {
      showError(weatherError, err.message);
    } finally {
      resetButton(searchBtn, 'Search');
    }
  });

  citySearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBtn.click();
  });

  subscriptionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const city = cityInput.value.trim();
    const frequency = document.getElementById('frequency').value;
    const submitBtn = subscriptionForm.querySelector('button[type="submit"]');

    if (!validateEmail(email) || !city || !frequency) {
      return showError(subscriptionError, 'Please fill all fields correctly');
    }

    try {
      hideElement(subscriptionError);
      hideElement(subscriptionSuccess);
      submitBtn.textContent = 'Subscribing...';
      submitBtn.disabled = true;

      await subscribeToWeatherUpdates(email, city, frequency);
      showElement(subscriptionSuccess);
      subscriptionForm.reset();
    } catch (err) {
      showError(subscriptionError, err.message);
    } finally {
      resetButton(submitBtn, 'Subscribe');
    }
  });
}
