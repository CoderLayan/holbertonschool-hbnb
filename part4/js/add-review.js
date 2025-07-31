const API_BASE_URL = 'http://localhost:5000/api';
const REVIEWS_ENDPOINT = `${API_BASE_URL}/reviews`;

// DOM Elements
const reviewForm = document.getElementById('review-form');
const messageBox = document.getElementById('message-container');
const placeIdInput = document.getElementById('place-id');
const logoutBtn = document.getElementById('logout-link');

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  validateAuthentication();
  fillPlaceIdFromURL();
  initEventListeners();
});

// Check user authentication
function validateAuthentication() {
  const token = getCookie('access_token');
  if (!token) {
    redirectToLogin();
  }
}

// Redirect to login page
function redirectToLogin() {
  window.location.href = '/index.html';
}

// Extract place ID from URL and set it in form
function fillPlaceIdFromURL() {
  const placeId = new URLSearchParams(window.location.search).get('id');
  if (!placeId) {
    showMessage('Invalid place ID', 'error');
    return;
  }
  placeIdInput.value = placeId;
}

// Attach event listeners
function initEventListeners() {
  if (reviewForm) {
    reviewForm.addEventListener('submit', handleReviewSubmit);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logoutUser();
    });
  }
}

// Handle review form submission
async function handleReviewSubmit(event) {
  event.preventDefault();

  const token = getCookie('access_token');
  if (!token) return redirectToLogin();

  const placeId = placeIdInput.value;
  const rating = parseInt(document.getElementById('rating').value);
  const text = document.getElementById('text').value;
  const submitBtn = reviewForm.querySelector('button[type="submit"]');

  try {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';

    const response = await fetch(REVIEWS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ place_id: placeId, rating, text }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit review');
    }

    showMessage('Review submitted successfully!', 'success');
    reviewForm.reset();
  } catch (err) {
    console.error('Submission error:', err);
    showMessage(err.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Review';
  }
}

// Read cookie by name
function getCookie(name) {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`));
  return cookieValue ? cookieValue.split('=')[1] : null;
}

// Logout user
function logoutUser() {
  document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  redirectToLogin();
}

// Display message box
function showMessage(message, type) {
  messageBox.innerHTML = `
    <div class="message ${type}">${message}</div>
  `;
  setTimeout(() => {
    messageBox.innerHTML = '';
  }, 5000);
}

