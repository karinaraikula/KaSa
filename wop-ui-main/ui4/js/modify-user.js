'use strict';
const url = 'http://localhost:3000'; // change url when uploading to server

// select existing html elements
const modUserForm = document.querySelector('#modUserForm');

// submit add user form
modUserForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(modUserForm);
  // remove empty properties
  for (const [prop, value] of Object.entries(data)) {
    if (value === '') {
      delete data[prop];
    }
  }
  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  };

  const response = await fetch(url + '/user', fetchOptions);
  const json = await response.json();
  if (json.error) {
    alert(json.error.message);
  } else {
    alert(json.message);
  }
  location.href = 'front.html';
});
