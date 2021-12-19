'use strict';
const url = 'https://10.114.34.18/app'; // change url when uploading to server

// get query parameter
const getQParam = (param) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
};

// get id from address
const cat_id = getQParam('id');

// select existing html elements
const modForm = document.querySelector('#modCatForm');
const userList = document.querySelector('.add-owner');

// get user data for admin check
const user = JSON.parse(sessionStorage.getItem('user'));

/*
// if user is not admin delete owner selection
if (user.Oikeus> 0) userList.remove();
*/

// add existing cat data to form

const getCat = async (id) => {
  const fetchOptions = {
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('token'),
    },
  };
  const response = await fetch(url + '/cat/' + id, fetchOptions);
  const cat = await response.json();
  const inputs = modForm.querySelectorAll('input');
  inputs[0].value = cat.Kuvaus;
  inputs[1].value = cat.Tyyppi;
  if (user.Oikeus === 0) modForm.querySelector('select').value = cat.Postaaja;
};

/*
// create user options to <select>
const createUserOptions = (users) => {
  // clear user list
  userList.innerHTML = '';
  users.forEach((user) => {
    // create options with DOM methods
    const option = document.createElement('option');
    option.value = user.user_id;
    option.innerHTML = user.name;
    option.classList.add('light-border');
    userList.appendChild(option);
  });
  // load cat data after users
  getCat(cat_id);
};

// get users to make options
const getUsers = async () => {
  try {
    const options = {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/user', options);
    const users = await response.json();
    createUserOptions(users);
  } catch (e) {
    console.log(e.message);
  }
};
*/
// submit modify form
modForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(modForm);
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
    body: JSON.stringify(data),
  };

  console.log(fetchOptions);
  const response = await fetch(url + '/cat/' + cat_id, fetchOptions);
  const json = await response.json();
  if (json.error) {
    alert(json.error.message);
  } else {
    alert(json.message);
  }
  location.href = 'front.html';
});

// start filling the form
if (user.role === 0) {
  getUsers(); // if admin
} else {
  getCat(cat_id); // if regular user
}
