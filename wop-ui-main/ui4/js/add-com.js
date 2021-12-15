/*use strict';
const url = 'http://localhost:3000'; // change url when uploading to server

// select existing html elements
const addcomForm = document.querySelector('#commentForm');

// submit add com form
addcomForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const cfd = new FormData(addcomForm);

  const fetchOptions = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: cfd,
  };
  for (let [key,value] of Object.entries(fetchOptions)) {
    console.log(key,value);
    
  }

  const response = await fetch(url + '/com', fetchOptions);
  const json = await response.json();
  alert(json.message);
  location.href = 'front.html';
});
*/