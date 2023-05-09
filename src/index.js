import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const listEl = document.querySelector('.country-list');
const containerEl = document.querySelector('.country-info');
const inputEl = document.querySelector('#search-box');
const body = document.querySelector('body');

listEl.style.visibility = 'hidden';
containerEl.style.visibility = 'hidden';

inputEl.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(e) {
  e.preventDefault();

  const searchCountries = e.target.value.trim();

  if (!searchCountries) {
    listEl.style.visibility = 'hidden';
    containerEl.style.visibility = 'hidden';
    listEl.innerHTML = '';
    containerEl.innerHTML = '';
    return;
  }

  fetchCountries(searchCountries)
    .then(result => {
      if (result.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please, enter a more specific name.'
        );
        return;
      }
      renderedCountries(result);
    })
    .catch(error => {
      listEl.innerHTML = '';
      containerEl.innerHTML = '';
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function renderedCountries(result) {
  if (result.length === 1) {
    listEl.innerHTML = '';
    listEl.style.visibility = 'hidden';
    containerEl.style.visibility = 'visible';
    countryCardMarkup(result);
  }

  if (result.length > 1 && result.length <= 10) {
    containerEl.innerHTML = '';
    containerEl.style.visibility = 'hidden';
    listEl.style.visibility = 'visible';
    listElMarkup(result);
  }
}

function listElMarkup(result) {
  const listMarkup = result
    .map(({ name, flags }) => {
      return `<li>
                        <img src="${flags.svg}" alt="${name}" width="60" height="auto">
                        <span>${name.official}</span>
                </li>`;
    })
    .join('');
  listEl.innerHTML = listMarkup;
  return listMarkup;
}

function countryCardMarkup(result) {
  const cardMarkup = result
    .map(({ flags, name, capital, population, languages }) => {
      languages = Object.values(languages).join(', ');
      return `
            <img src="${flags.svg}" alt="${name}" width="320" height="auto">
            <p> ${name.official}</p>
            <p>Capital: <span> ${capital}</span></p>
            <p>Population: <span> ${population}</span></p>
            <p>Languages: <span> ${languages}</span></p>`;
    })
    .join('');
  containerEl.innerHTML = cardMarkup;
  return cardMarkup;
}
