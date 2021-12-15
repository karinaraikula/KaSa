'use strict';
const url = 'http://localhost:3000'; // change url when uploading to server

// select existing html elements
const ul = document.querySelector('#list');

// get user data for admin check
const user = JSON.parse(sessionStorage.getItem('user'));

// create cat cards


/* Tykkäys, KESKEN
const likebutton = document.getElementsByClassName('likebutton');
likebutton.onclick = async (UseriID, PostID) => {
    try{
        const [rows] = await promisePool.execute(
            'INSERT INTO Tykätään (UseriID, PostID) VALUES (?, ?)',
            [req.user.UseriID, PostID]
        );
    return rows;
    } catch (e) {
        console.error('addLike error', e.message);
        next(httpError('Database errror', 505));
    }
};
*/



// AJAX call
const getCat = async () => {
  try {
    const fetchOptions = {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/cat', fetchOptions);
    const cats = await response.json();
    createCatCards(cats, ul, user, getCat);
  } catch (e) {
    console.log(e.message);
  }
};
getCat();



//Scroll-top nappi
const mybutton = document.getElementById("myBtn");
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0; 
  document.documentElement.scrollTop = 0;
}