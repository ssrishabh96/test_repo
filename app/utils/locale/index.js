import Mapper, { CurrencyMapper } from './mapper';

let language = null;
function defaultLanguage() {
  return 'en-us';
}

function currentLanguage() {
  return language || defaultLanguage();
}

function setLanguage(value) {
  if (value && language !== value.toLowerCase()) {
    language = value.toLowerCase();
  }
}

function translate(textKey, lang = currentLanguage(), defaultText) {
  return (
    (Mapper[lang] && Mapper[lang][textKey]) || defaultText || Mapper[defaultLanguage()][textKey]
  );
}

function formatCurrency(input, lang = currentLanguage()) {
  const amount = Number.parseFloat(input);
  if (isNaN(amount)) return '';
  return CurrencyMapper[lang](amount);
}

export default {
  setLanguage,
  currentLanguage,
  formatCurrency,
  translate,
};
