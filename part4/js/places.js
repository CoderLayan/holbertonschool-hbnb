// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const PLACES_ENDPOINT = ${API_BASE_URL}/places;

// DOM Elements
const placesContainer = document.getElementById('places-container');
const priceFilter = document.getElementById('price-filter');
const loginLink = document.getElementById('login-link');
const logoutLink = document.getElementById('logout-link');

// Global variable to store places data
let allPlaces = [];

/
 * Initialize the page
 */
document.addEventListener('DOMContentLoaded', async () => {
    checkAuthentication();
    await fetchPlaces();
    setupEventListeners();
});

/
 * Check authentication status
 */
function checkAuthentication() {
    const token = getCookie('access_token');
    
    if (token) {
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'block';
    } else {
        if (loginLink) loginLink.style.display = 'block';
        if (logoutLink) logoutLink.style.display = 'none';
        window.location.href = '/login.html';
    }
}

/
 * Fetch places from API
 */
async function fetchPlaces() {
    try {
        const token = getCookie('access_token');
        
        const response = await fetch(PLACES_ENDPOINT, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch places');
        }

        allPlaces = await response.json();
        renderPlaces(allPlaces);
    } catch (error) {
        console.error('Error fetching places:', error);
        placesContainer.innerHTML = `
            <div class="error-message">
                Failed to load places. Please try again later.
            </div>
        `;
    }
}

/
 * Render places to the DOM
 */
function renderPlaces(places) {
    if (places.length === 0) {
        placesContainer.innerHTML = '<div class="no-results">No places found</div>';
        return;
    }

    placesContainer.innerHTML = places.map(place => `
        <div class="place-card" data-price="${place.price}">
            <img src="${place.image_url  '/images/placeholder.jpg'}" alt="${place.title}" class="place-image">
            <div class="place-info">
                <h3>${place.title}</h3>
                <p class="place-description">${place.description  'No description available'}</p>
                <div class="place-meta">
                    <span class="price">$${place.price}/night</span>
                    <a href="/place.html?id=${place.id}" class="details-button">View Details</a>
                </div>
            </div>
        </div>
    `).join('');
}

/
 * Filter places by price
 */
function filterPlaces() {
    const maxPrice = priceFilter.value;
    
    if (maxPrice === 'all') {
        renderPlaces(allPlaces);
        return;
    }

    const filteredPlaces = allPlaces.filter(place => place.price <= parseInt(maxPrice));
    renderPlaces(filteredPlaces);
}

/
 * Setup event listeners
 */
function setupEventListeners() {
    priceFilter.addEventListener('change', filterPlaces);
    
    logoutLink?.addEventListener('click', (e) => {
        e.preventDefault();
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        window.location.href = '/login.html';
    });
}

/**
 * Helper function to get cookie value
 */
function getCookie(name) {
    const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${name}=`));
    
    return cookie ? cookie.split('=')[1] : null;
}
