
'use strict';

// select existing html elements
const hakuForm = document.querySelector('#haku-form');

// haku
hakuForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = new FormData(hakuForm);
  const haku = new URLSearchParams(data);
  console.log(haku);
  

const response = await fetch(url + '/haku?' + haku);
  const cats = await response.json();
  console.log('login response', cats);
  if (cats.error) {
    alert(cats.error.message);
  } else {
    createCatCards(cats, ul, user);
  }

});
