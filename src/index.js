import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
const _ = require('lodash');
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const userInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfoBox = document.querySelector('.country-info');

userInput.addEventListener(
  'input',
  _.debounce(ev => {
    const inputValue = ev.target.value;

    if (inputValue.trim() !== '') {
      fetchCountries(inputValue)
        .then(data => {
          if (data.status === 404) {
            throw new Error('Oops, there is no country with that name');
          }

          const countriesArrayLength = data.length;

          if (countriesArrayLength > 10) {
            Notiflix.Notify.info(
              'Too many matches found. Please enter a more specific name.'
            );
            return;
          } else if (countriesArrayLength >= 2 && countriesArrayLength <= 10) {
            countryInfoBox.innerHTML = '';
            const countryListTemplate = data.map(country => {
              return `<li class="country-list__item">
            <img src="${country.flags.svg}" alt="${country.flags.alt}" width="30" height="24">
            <p>${country.name.official}</p>
            </li>`;
            });
            countryList.innerHTML = countryListTemplate.join('');
          } else {
            countryList.innerHTML = '';
            let languageObj = data[0].languages;
            let languageArr = Object.values(languageObj);

            const countryInfoTemplate = data.map(country => {
              return `<img src="${country.flags.svg}" alt="${
                country.flags.alt
              }" width="270" height="150">
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

            if (userInput.value.toLowerCase() === "armenia") {
                Notiflix.Notify.warning("Hello, my Dear <:3", {
                    timeout: 7000,
                })
            }
          }
        })
        .catch(error => {
          Notiflix.Notify.failure(error.message); 
        });
    } else {
      countryList.innerHTML = '';
      countryInfoBox.innerHTML = '';
    }
  }, DEBOUNCE_DELAY)
);
