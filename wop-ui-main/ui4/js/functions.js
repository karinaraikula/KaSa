'use strict'
const moro = async (id) => {
    try {
        const fetchOptions = {
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        const response = await fetch(url + '/com/' + id, fetchOptions);
        const comments = await response.json();
        return comments;
    } catch (e) {
        console.log(e.message);
    }
};

const createCatCards = (cats, ul, user, refresh) => {

    // clear ul
    ul.innerHTML = '';
    cats.forEach(async (cat) => {
        // create li with DOM methods
        const img = document.createElement('img');
        img.src = url + '/' + cat.Filename;
        img.classList.add('resp');

        const figure = document.createElement('figure').appendChild(img);
        figure.setAttribute("id", "postkuva");

        const h2 = document.createElement('h2');
        h2.innerHTML = `${cat.Kayttajanimi}`;

        const p1 = document.createElement('p');
        p1.innerHTML = `${cat.Aikaleima}`;
        p1.setAttribute("id", "pvm");

        const mortti = document.createElement('div');
        mortti.classList.add('morttidiv');

        const p3 = document.createElement('p');
        p3.setAttribute("id", "p3");
        p3.innerHTML = "<img src=\'KUVAT/kysymysidea.png\' Id=\'kuvaid\' >" + `${cat.Posttyyppi}`;


        const p2 = document.createElement('p');
        p2.innerHTML = `"${cat.Kuvaus}"`;
        p2.setAttribute("id", "kuvaus");



        const comForm = document.createElement('form');
        comForm.id = 'commentForm';
        const p4 = document.createElement('input');
        p4.setAttribute("type", "text");
        p4.setAttribute("placeholder", "kommentoi...");
        p4.name = 'Sisalto';
        p4.id = "kommenttiinput";
        const p5 = document.createElement('input');
        p5.setAttribute("type", "hidden");
        p5.name = 'PostID';
        p5.value = cat.PostID;
        const nappi = document.createElement('button');
        nappi.setAttribute("type", "submit")
        nappi.id = "kommenttinappi";
        nappi.innerHTML = '<img src=\'KUVAT/comnappi.png\'>';
        

        comForm.addEventListener('submit', async(evt) => {
            evt.preventDefault();
            const data = serializeJson(comForm);
            const fetchOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    
                    Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                
                },
                body: JSON.stringify(data),
            };

            const response = await fetch(url + '/com', fetchOptions);
            const json = await response.json();
            console.log('login response', json);

            // tähän alertti ja päivitä sivu location hfref jne
            refresh();
        });



        const pertti = document.createElement('div');
        pertti.classList.add('perttidiv');
        try {
            const fetchOptions = {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                },
            };
            const response = await fetch(url + '/com/' + cat.PostID, fetchOptions);
            if (response.ok) {

                const kommentit = await response.json();
                console.log(kommentit);
                kommentit.forEach((kommentti) => {
                    const kokokommentti = document.createElement('div');
                    kokokommentti.id = "kokokommentti";
                    const kappale = document.createElement('p');
                    kappale.innerHTML = `${kommentti.Kommentoija}: ${kommentti.Sisalto}`;
                    kappale.id = "kappale";
                    kokokommentti.appendChild(kappale);
                    console.log(kommentti.Kommentoija, user.UseriID);
                    if (kommentti.Kommentoija === user.Tunnus) {
                        const poistonappi = document.createElement('button');
                        kokokommentti.appendChild(poistonappi);
                        pertti.appendChild(kokokommentti);
                        poistonappi.innerHTML = '<img src=\'KUVAT/delete.png\'>';
                        poistonappi.id = "kommenttipoisto"
                        poistonappi.addEventListener('click', async () => {
                            //TÄHÄN LISÄSIN IF CONFIRM
                            if (confirm('Haluatko varmasti poistaa kommentin?')) {
                            const fetchOptions = {
                                method: 'DELETE',
                                headers: {
                                    Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                                },
                                
                            };
                            const response = await fetch(url + '/com/' + kommentti.KommenttiID, fetchOptions);
                            const json = await response.json();
                            console.log('delete response', json);
                            // tähän alertti ja päivitä sivu location hfref jne
                            refresh();
                        }
                        })
                    }
                });

            }

        } catch (e) {
            console.log('virhe', e.message);
        }

        const li = document.createElement('li');
        li.classList.add('kortti');

        li.appendChild(h2);
        li.appendChild(p1);
        li.appendChild(figure);
        li.appendChild(mortti);

        mortti.appendChild(p3);
        mortti.appendChild(p2);

        li.appendChild(pertti);
        li.appendChild(comForm);

        comForm.appendChild(p4);
        comForm.appendChild(p5);
        comForm.appendChild(nappi);
        ul.appendChild(li);

        /*if (user.Oikeus === 0 || user.UseriID === cat.Kayttajanimi) {
        const comdeleteButton = document.createElement('button');
            comdeleteButton.innerHTML = 'Delete';
            comdeleteButton.classList.add('deletebutton');
            comdeleteButton.addEventListener('click', async () => {
                if (confirm('Haluatko varmasti poistaa kommentin?')) {
                    const fetchOptions = {
                        method: 'DELETE',
                        headers: {
                            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                        },
                    };
                    try {
                        const response = await fetch(
                            url + '/com/' + cat.KommenttiID,
                            fetchOptions
                        );
                        const json = await response.json();
                        console.log('delete response', json);
                        getCom();
                    } catch (e) {
                        console.log(e.message);
                    }
                }
            })
            pertti.appendChild(comdeleteButton);
        };
        */


        if (user.Oikeus === 0 || user.UseriID === cat.Postaaja) {
            // link to modify form
            const modButton = document.createElement('a');
            modButton.innerHTML = '<img src=\'KUVAT/modify.png\' >';
            modButton.href = `modify-cat.html?id=${cat.PostID}`;
            modButton.classList.add('modbutton');

            // delete selected cat
            const delButton = document.createElement('button');
            delButton.innerHTML = '<img src=\'KUVAT/delete.png\'>';
            delButton.classList.add('deletebutton');
            delButton.addEventListener('click', async () => {
                if (confirm('Haluatko varmasti poistaa postauksen?')) {
                    const fetchOptions = {
                        method: 'DELETE',
                        headers: {
                            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                        },
                    };
                    try {
                        const response = await fetch(
                            url + '/cat/' + cat.PostID,
                            fetchOptions
                        );
                        const json = await response.json();
                        console.log('delete response', json);
                        getCat();
                    } catch (e) {
                        console.log(e.message);
                    }
                }
            });


            const buttondiv = document.createElement('div');
            buttondiv.classList.add('buttondiv');
            li.appendChild(buttondiv);
            buttondiv.appendChild(modButton);
            buttondiv.appendChild(delButton);


        }
    });
};



