'use strict';
const url = 'https://10.114.34.18/app'; // change url when uploading to server

// select existing html elements
const loginForm = document.querySelector('#login-form');
const addUserForm = document.querySelector('#add-user-form');

// login
loginForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(loginForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(url + '/auth/login', fetchOptions);
  const json = await response.json();
  console.log('login response', json);
  if (!json.user) {
    alert(json.message);
  } else {
    // save token
    sessionStorage.setItem('token', json.token);
    sessionStorage.setItem('user', JSON.stringify(json.user));
    location.href = 'front.html';
  }
});

// submit register form
addUserForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(addUserForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(url + '/auth/register', fetchOptions);
  const json = await response.json();
  alert(json.message);
});
