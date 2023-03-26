import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
const _ = require('lodash');
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const userInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfoBox = document.querySelector('.country-info');

// Якщо бекенд повернув від 2-х до 10-и країн, під тестовим полем відображається список знайдених країн. Кожен елемент має прапор та назву країни.

userInput.addEventListener(
  'input',
  _.debounce(ev => {
    const inputValue = ev.target.value;

    if (inputValue.trim() !== '') {
      fetchCountries(inputValue).then(data => {
        const countriesArrayLength = data.length;

        if (countriesArrayLength > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          return;
        } else if (countriesArrayLength >= 2 && countriesArrayLength <= 10) {
          const countryListTemplate = data.map(country => {
            return `<li class="country-list__item">
            <img src="${country.flags.svg}" alt="${country.flags.alt}" width="30" height="24">
            <p>${country.name.official}</p>
            </li>`;
          });
          countryList.innerHTML = countryListTemplate.join('');
        } else {
          let languageObj = data[0].languages;
          let languageArr = Object.values(languageObj);

          const countryInfoTemplate = data.map(country => {
            return `<img src="${country.flags.svg}" alt="${
              country.flags.alt
            }" width="30" height="24">
                <h1 class="country-info__name">${country.name.official}</h1>
                <p class="country-info__capital">Capital: <span class="text">${country.capital.join(
                  ','
                )}</span></p>
                <p class="country-info__population">Population: <span class="text">${
                  country.population
                }</span></p>
                <p class="country-info__languages">Languages: <span class="text">${languageArr.join(
                  ', '
                )}</span></p>`;
          });
          countryInfoBox.innerHTML = countryInfoTemplate.join('');
        }
      });
    } else {
      countryList.innerHTML = '';
      countryInfoBox.innerHTML = '';
    }
  }, DEBOUNCE_DELAY)
);
