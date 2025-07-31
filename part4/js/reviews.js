// Get a cookie value by name
function getCookie(name) {
    const cookieArr = document.cookie.split(';');
    for (let cookie of cookieArr) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

// Check user authentication
function checkAuthentication() {
    const token = getCookie('token');
    if (!token) {
        window.location.href = 'index.html';
    }
    return token;
}

// Get place ID from URL
function getPlaceIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('place_id');
}

// Submit review to API
async function submitReview(token, placeId, reviewText, rating) {
    try {
        const response = await fetch('http://127.0.0.1:5001/api/v1/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                place_id: placeId,
                text: reviewText,
                rating: parseInt(rating)
            })
        });

        handleResponse(response);
    } catch (error) {
        alert('An error occurred while submitting your review.');
        console.error(error);
    }
}

// Handle response
async function handleResponse(response) {
    if (response.ok) {
        alert('Review submitted successfully!');
        document.getElementById('review-form').reset();
    } else {
        const data = await response.json();
        const message = data?.error || 'Failed to submit review.';
        alert(message);
    }
}

// On DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('review-form');
    const token = checkAuthentication();
    const placeId = getPlaceIdFromURL();

    if (!placeId) {
        alert('No place ID found in URL.');
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('place-id').value = placeId;

    if (reviewForm) {
        reviewForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const reviewText = document.getElementById('text').value.trim();
            const rating = document.getElementById('rating').value;

            if (!reviewText || !rating) {
                alert('Please fill in all required fields.');
                return;
            }

            submitReview(token, placeId, reviewText, rating);
        });
    }
});

