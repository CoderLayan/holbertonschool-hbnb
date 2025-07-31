// Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// DOM Elements
const placeDetailsSection = document.getElementById('place-details');
const reviewsList = document.getElementById('reviews-list');
const addReviewSection = document.getElementById('add-review-section');
const addReviewForm = document.getElementById('add-review-form');
const loginLink = document.getElementById('login-link');
const logoutLink = document.getElementById('logout-link');

// Global variables
let currentPlaceId = null;

/**
 * Initialize the page
 */
document.addEventListener('DOMContentLoaded', async () => {
    currentPlaceId = getPlaceIdFromURL();
    
    if (!currentPlaceId) {
        showError('Invalid place ID');
        return;
    }

    document.getElementById('place-id').value = currentPlaceId;
    checkAuthentication();
    await fetchPlaceDetails();
});

/**
 * Get place ID from URL query parameters
 */
function getPlaceIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

/**
 * Check authentication status
 */
function checkAuthentication() {
    const token = getCookie('access_token');
    
    if (token) {
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'block';
        if (addReviewSection) addReviewSection.style.display = 'block';
    } else {
        if (loginLink) loginLink.style.display = 'block';
        if (logoutLink) logoutLink.style.display = 'none';
        if (addReviewSection) addReviewSection.style.display = 'none';
    }
}

/**
 * Fetch place details from API
 */
async function fetchPlaceDetails() {
    try {
        const token = getCookie('access_token');
        
        const response = await fetch(`${API_BASE_URL}/places/${currentPlaceId}`, {
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch place details');
        }

        const place = await response.json();
        renderPlaceDetails(place);
    } catch (error) {
        console.error('Error fetching place details:', error);
        showError('Failed to load place details. Please try again later.');
    }
}

/**
 * Render place details to the DOM
 */
function renderPlaceDetails(place) {
    placeDetailsSection.innerHTML = `
        <div class="place-header">
            <h1>${place.title}</h1>
            <div class="place-meta">
                <span class="price">$${place.price}/night</span>
                <span class="location">${place.location || 'Location not specified'}</span>
            </div>
        </div>
        
        <div class="place-image-container">
            <img src="${place.image_url || '/images/placeholder.jpg'}" alt="${place.title}" class="place-main-image">
        </div>
        
        <div class="place-description">
            <h2>Description</h2>
            <p>${place.description || 'No description available.'}</p>
        </div>
        
        <div class="place-amenities">
            <h2>Amenities</h2>
            ${place.amenities && place.amenities.length > 0 
                ? `<ul>${place.amenities.map(amenity => `<li>${amenity.name}</li>`).join('')}</ul>`
                : '<p>No amenities listed.</p>'}
        </div>
    `;

    // Render reviews if available
    if (place.reviews && place.reviews.length > 0) {
        renderReviews(place.reviews);
    } else {
        reviewsList.innerHTML = '<p class="no-reviews">No reviews yet.</p>';
    }

    // Setup review form if authenticated
    if (addReviewForm) {
        addReviewForm.addEventListener('submit', handleReviewSubmit);
    }
}

/**
 * Render reviews list
 */
function renderReviews(reviews) {
    reviewsList.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <span class="review-author">${review.user_name || 'Anonymous'}</span>
                <span class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
            </div>
            <div class="review-date">${new Date(review.created_at).toLocaleDateString()}</div>
            <div class="review-text">${review.text}</div>
        </div>
    `).join('');
}

/**
 * Handle review form submission
 */
async function handleReviewSubmit(e) {
    e.preventDefault();
    
    const token = getCookie('access_token');
    if (!token) {
        showError('You must be logged in to submit a review');
        return;
    }

    const rating = document.getElementById('rating').value;
    const text = document.getElementById('text').value;
    const placeId = document.getElementById('place-id').value;

    try {
        const response = await fetch(`${API_BASE_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                place_id: placeId,
                rating: parseInt(rating),
                text
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to submit review');
        }

        // Refresh reviews after successful submission
        await fetchPlaceDetails();
        addReviewForm.reset();
        showSuccess('Review submitted successfully!');
    } catch (error) {
        console.error('Error submitting review:', error);
        showError(error.message);
    }
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

/**
 * Show error message
 */
function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    placeDetailsSection.prepend(errorElement);
    setTimeout(() => errorElement.remove(), 5000);
}

/**
 * Show success message
 */
function showSuccess(message) {
    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.textContent = message;
    placeDetailsSection.prepend(successElement);
    setTimeout(() => successElement.remove(), 5000);
}
