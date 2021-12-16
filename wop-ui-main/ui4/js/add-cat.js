'use strict';
const url = 'https://10.114.34.18/app'; // change url when uploading to server

// select existing html elements
const addForm = document.querySelector('#addCatForm');

// submit add cat form
addForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const fd = new FormData(addForm);

  const fetchOptions = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: fd,
  };
  for (let [key,value] of Object.entries(fetchOptions)) {
    console.log(key,value);
    
  }

  const response = await fetch(url + '/app', fetchOptions);
  const json = await response.json();
  alert(json.message);
  location.href = 'front.html';
});



