import axios from 'axios';
import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import SlimSelect from 'slim-select';
import '../node_modules/slim-select/dist/slimselect.css';
import Notiflix from 'notiflix';

Notiflix.Notify.init({
  position: 'right-top',
});

axios.defaults.headers.common['x-api-key'] =
  'live_ll4GIjvo9ClYsMVe1gwe9R5jiQQNgNMPwreF7lvehA0lqTrAYQERaVkPMedGtuFB';

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

breedSelect.addEventListener('change', selectCat);

error.style.display = 'none';

function fillCatList(breeds) {
  breeds.forEach(breed => {
    const option = document.createElement('option');
    option.value = breed.id;
    option.textContent = breed.name;
    breedSelect.appendChild(option);
  });
}

function selectCat(e) {
  const breedId = e.target.value;
  if (breedId) {
    loader.style.display = 'block';
    catInfo.style.display = 'none';
    fetchCat(breedId);
  } else {
    loader.style.display = 'none';
  }
}

function fetchCat(breedId) {
  fetchCatByBreed(breedId)
    .then(response => {
      const cat = response;
      showCat(cat);
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Upps! Coś poszło nie tak. Odśwież stronę jeszcze raz.'
      );
      return error;
    })
    .finally(() => {
      loader.style.display = 'none';
    });
}

function showCat(cat) {
  const { name, description, temperament } = cat[0].breeds[0];
  const { url } = cat[0];
  const catInfoHTML = `

    <img class="catImg" src="${url}" alt="">
    <div class="description">
      <h2>${name}</h2>
      <p> ${description}</p>
      <p><strong>Temperament:</strong> ${temperament}</p>
    

  `;
  catInfo.style.display = 'inline-flex';
  catInfo.innerHTML = catInfoHTML;
}

function initCatApp() {
  loader.style.display = 'block';
  fetchBreeds()
    .then(breeds => {
      fillCatList(breeds);
      var select = new SlimSelect({
        select: '.breed-select',
      });
      Notiflix.Notify.info(
        'Wybierz rasę z listy, aby wyświetlić więcej informacji.'
      );
    })
    .catch(error => {
      console.error(error);
    })
    .finally(() => {
      loader.style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
  initCatApp();
});
