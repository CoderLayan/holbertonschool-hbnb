// Authentication Service
const API_BASE_URL = 'http://localhost:5000/api'; // Update with your API URL

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorElement = document.getElementById('error-message');
            const submitButton = loginForm.querySelector('button[type="submit"]');
            
            try {
                // Show loading state
                submitButton.disabled = true;
                submitButton.textContent = 'Logging in...';
                
                // Clear previous errors
                if (errorElement) {
                    errorElement.textContent = '';
                    errorElement.style.display = 'none';
                }
                
                // Make API request
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password })
                });
                
                // Handle response
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Login failed. Please check your credentials.');
                }
                
                // Store token and redirect
                const { access_token } = await response.json();
                setAuthCookie(access_token);
                window.location.href = '/index.html';
                
            } catch (error) {
                console.error('Login error:', error);
                
                // Display error to user
                if (errorElement) {
                    errorElement.textContent = error.message;
                    errorElement.style.display = 'block';
                }
                
                // Reset button state
                submitButton.disabled = false;
                submitButton.textContent = 'Login';
            }
        });
    }
});

/**
 * Sets authentication cookie with JWT token
 * @param {string} token - JWT token
 */
function setAuthCookie(token) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1); // 1 day expiration
    
    document.cookie = `access_token=${token}; expires=${expirationDate.toUTCString()}; path=/; Secure; SameSite=Strict`;
}
