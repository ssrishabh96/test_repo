import US_EN from './languages/us_en';
import ES_ES from './languages/es_es';
import FR_CA from './languages/fr_ca';
import currencyFormatter from 'currency-formatter';

export default {
  'en-us': US_EN,
  'es-es': ES_ES,
  'fr-ca': FR_CA,
};

export const CurrencyMapper = {
  'en-us': currency => currencyFormatter.format(currency, { locale: 'en-US' }),
  'es-es': currency => currencyFormatter.format(currency, { locale: 'es-ES' }),
  'fr-ca': currency => currencyFormatter.format(currency, { locale: 'fr-CA' }),
};

export const formatCurrency = value => currencyFormatter.format(value);
export const unformatCurrency = value => currencyFormatter.unformat(value);
