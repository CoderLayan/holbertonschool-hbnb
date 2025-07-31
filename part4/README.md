# 🧩 HBNB - Part 4: Simple Web Client

> Front-end interface for interacting with the HBNB back-end API.  
> Built using **HTML5**, **CSS3**, and **JavaScript (ES6)**.

---

## 📌 Overview

This part of the HBNB project focuses on building a dynamic web client that communicates with the previously developed API. The goal is to create an interactive, user-friendly experience for browsing places and submitting reviews.

---

## 📚 Learning Objectives

- Apply **HTML5**, **CSS3**, and **JavaScript ES6** in a real-world project.
- Use the **Fetch API** to make AJAX requests to a Flask API.
- Implement **JWT-based authentication** using cookies.
- Enhance user experience using **client-side scripting** without full page reloads.
- Design pages following given specifications and responsive principles.

---

## 🧩 Pages & Features

### 1. `login.html`
- Login form with **email** and **password** fields.
- On successful login:
  - Stores JWT token in a cookie.
  - Redirects to `index.html`.
- On failure: shows error alert.

### 2. `index.html`
- Displays a list of places as **cards**.
- Implements **client-side filtering** by price.
- Redirects to login if user is not authenticated.
- Dynamic visibility of login/logout link based on auth status.

### 3. `place.html`
- Displays **detailed info** about a selected place:
  - Name, price, host, description, amenities, reviews.
- Shows **"Add Review"** section only if user is authenticated.

### 4. `add_review.html`
- Form to add a **review** for a specific place.
- Accessible **only** to authenticated users.
- Submits review to API using Fetch with `Bearer` token.
- Displays success or error alerts based on submission status.

---

## 🔐 Authentication

- JWT token is stored as a cookie (`token`).
- All protected API routes are accessed using the token via:

Authorization: Bearer <token>

---

## 🛠️ Tech Stack

| Front-End     | API Integration | Authentication |
|---------------|-----------------|----------------|
| HTML5         | Fetch API       | JWT (via cookies) |
| CSS3          | CORS enabled    | Authorization Header |
| JavaScript ES6| Flask back-end  | Session Check |


---

## 🚦 How to Run

1. Ensure your **back-end API is running** (Flask app on `http://127.0.0.1:5001`).
2. Open `login.html` in a browser.
3. Log in with a valid user.
4. Navigate through:
   - Places list (`index.html`)
   - Place details (`place.html?place_id=XYZ`)
   - Add a review (`add_review.html?place_id=XYZ`)

---

## 🔧 Notes

- Make sure your Flask API is **CORS-enabled** to allow cross-origin requests from your front-end.
- All pages should pass [W3C HTML Validator](https://validator.w3.org/).
- Price filter values: `10`, `50`, `100`, `All`.

---

## ✅ Requirements Checklist

| Feature                             | Status     |
|------------------------------------|------------|
| Semantic HTML structure            | ✅ Done     |
| Responsive CSS3 design             | ✅ Done     |
| Login & JWT session handling       | ✅ Done     |
| List of places with filtering      | ✅ Done     |
| Place detail view                  | ✅ Done     |
| Review submission (auth protected) | ✅ Done     |
| Error/success message handling     | ✅ Done     |

---

## 📦 Repository

**GitHub Repo:**  
[https://github.com/CoderLayan/holbertonschool-hbnb](https://github.com/CoderLayan/holbertonschool-hbnb)  
**Project Directory:** `part4/`

---

## 🧑‍💻 Author

**Shouq Alosaimi,**
**Layan Aljunayh,**
**Razan Alabdulhadi**

---
