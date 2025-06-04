import { API_BASE_URL } from '../constants/api.js';

export async function fetchWeather(city) {
  const response = await fetch(
    `${API_BASE_URL}/weather?city=${encodeURIComponent(city)}`,
  );

  if (!response.ok) {
    if (response.status === 404) {
      console.log(response);

      throw new Error(
        'City not found. Please check the spelling and try again.',
      );
    }
    throw new Error('Failed to fetch weather data. Please try again later.');
  }

  return await response.json();
}

export async function subscribeToWeatherUpdates(email, city, frequency) {
  const formData = new URLSearchParams({ email, city, frequency });

  const response = await fetch(`${API_BASE_URL}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
  });

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error('This email is already subscribed for this city.');
    }
    if (response.status === 400) {
      throw new Error('Invalid input. Please check your data.');
    }
    throw new Error('Failed to subscribe. Please try again later.');
  }
}
