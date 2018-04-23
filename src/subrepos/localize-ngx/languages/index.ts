export interface ILanguageDesc {
  id: string;
  title: string;
  name: string;
  flagImg: string;
  flagTitle: string;
}

const languages: ILanguageDesc[] = [
  {
    id: 'en_US',
    title: 'English (US)',
    name: 'English (US)',
    flagImg: require('./flags/us.png'),
    flagTitle: 'United States'
  },
  {
    id: 'hu_HU',
    title: 'Hungarian',
    name: 'Magyar',
    flagImg: require('./flags/hu.png'),
    flagTitle: 'Hungary'
  },
  {
    id: 'fr_FR',
    title: 'French (France)',
    name: 'Français (France)',
    flagImg: require('./flags/fr.png'),
    flagTitle: 'France'
  },
  {
    id: 'de_DE',
    title: 'German',
    name: 'Deutsch',
    flagImg: require('./flags/de.png'),
    flagTitle: 'Germany'
  },
  {
    id: 'ca_ES',
    title: 'Catalan',
    name: 'Català',
    flagImg: require('./flags/catalonia.png'),
    flagTitle: 'Catalonia'
  },
  {
    id: 'cz_CZ',
    title: 'Czech',
    name: 'Čeština',
    flagImg: require('./flags/cz.png'),
    flagTitle: 'Czech Republic'
  },
  {
    id: 'dk_DK',
    title: 'Danish',
    name: 'Dansk',
    flagImg: require('./flags/dk.png'),
    flagTitle: 'Denmark'
  },
  {
    id: 'ee_EE',
    title: 'Estonian',
    name: 'Eesti',
    flagImg: require('./flags/ee.png'),
    flagTitle: 'Estonia'
  },
  {
    id: 'en_UK',
    title: 'English (UK)',
    name: 'English (UK)',
    flagImg: require('./flags/gb.png'),
    flagTitle: 'United Kingdom'
  },
  {
    id: 'es_ES',
    title: 'Spanish',
    name: 'Español',
    flagImg: require('./flags/es.png'),
    flagTitle: 'Spain'
  },
  {
    id: 'fr_CA',
    title: 'French (Canada)',
    name: 'Français (Canada)',
    flagImg: require('./flags/ca.png'),
    flagTitle: 'Canada'
  },
  {
    id: 'hr_HR',
    title: 'Latvian',
    name: 'Latviešu',
    flagImg: require('./flags/lv.png'),
    flagTitle: 'Latvia'
  },
  {
    id: 'lt_LT',
    title: 'Lithuanian',
    name: 'Lietuvių',
    flagImg: require('./flags/lt.png'),
    flagTitle: 'Lithuania'
  },
  {
    id: 'nl_NL',
    title: 'Dutch',
    name: 'Nederlands',
    flagImg: require('./flags/nl.png'),
    flagTitle: 'Netherlands'
  },
  {
    id: 'nl_BE',
    title: 'Dutch (Belgium)',
    name: 'Nederlands (België)',
    flagImg: require('./flags/be.png'),
    flagTitle: 'Belgium'
  },
  {
    id: 'no_NO',
    title: 'Norwegian (bokmal)',
    name: 'Norsk (bokmål)',
    flagImg: require('./flags/no.png'),
    flagTitle: 'Norway'
  },
  {
    id: 'ny_NO',
    title: 'Norwegian (nynorsk)',
    name: 'Norsk (nynorsk)',
    flagImg: require('./flags/no.png'),
    flagTitle: 'Norway'
  },
  {
    id: 'pl_PL',
    title: 'Polish',
    name: 'Polski',
    flagImg: require('./flags/pl.png'),
    flagTitle: 'Poland'
  },
  {
    id: 'pt_BR',
    title: 'Portuguese (Brazil)',
    name: 'Português (Brasil)',
    flagImg: require('./flags/br.png'),
    flagTitle: 'Brazil'
  },
  {
    id: 'pt_PT',
    title: 'Portuguese (Portugal)',
    name: 'Português (Portugal)',
    flagImg: require('./flags/pg.png'),
    flagTitle: 'Portugal'
  },
  {
    id: 'ro_RO',
    title: 'Romanian',
    name: 'Română',
    flagImg: require('./flags/ro.png'),
    flagTitle: 'Romania'
  },
  {
    id: 'sk_SK',
    title: 'Slovak',
    name: ' Slovenčina',
    flagImg: require('./flags/sk.png'),
    flagTitle: 'Slovakia'
  },
  {
    id: 'si_SI',
    title: 'Slovenian',
    name: 'Slovenščina',
    flagImg: require('./flags/si.png'),
    flagTitle: 'Slovenia'
  },
  {
    id: 'fi_FI',
    title: 'Finnish',
    name: 'Suomi',
    flagImg: require('./flags/fi.png'),
    flagTitle: 'Finland'
  },
  {
    id: 'se_SE',
    title: 'Swedish',
    name: 'Svenska',
    flagImg: require('./flags/se.png'),
    flagTitle: 'Sweden'
  },
  {
    id: 'tr_TR',
    title: 'Turkish',
    name: 'Türkçe',
    flagImg: require('./flags/tr.png'),
    flagTitle: 'Turkey'
  },
  {
    id: 'gr_GR',
    title: 'Greek',
    name: 'Ελληνικά',
    flagImg: require('./flags/gr.png'),
    flagTitle: 'Greece'
  },
  {
    id: 'bg_BG',
    title: 'Bulgarian',
    name: 'Български',
    flagImg: require('./flags/bg.png'),
    flagTitle: 'Bulgaria'
  },
  {
    id: 'ru_RU',
    title: 'Russian',
    name: 'Русский',
    flagImg: require('./flags/ru.png'),
    flagTitle: 'Russia'
  },
  {
    id: 'ua_UA',
    title: 'Ukrainian',
    name: 'Українська',
    flagImg: require('./flags/ua.png'),
    flagTitle: 'Ukraine'
  },
  {
    id: 'hi_IN',
    title: 'Hindi',
    name: 'हिन्दी',
    flagImg: require('./flags/in.png'),
    flagTitle: 'India'
  },
  {
    id: 'kr_KR',
    title: 'Korean',
    name: '한국어',
    flagImg: require('./flags/kr.png'),
    flagTitle: 'South Korea'
  },
  {
    id: 'cn_TW',
    title: 'Traditional Chinese (Taiwan)',
    name: '中文(台灣)',
    flagImg: require('./flags/tw.png'),
    flagTitle: 'Taiwan'
  },
  {
    id: 'cn_CN',
    title: 'Simplified Chinese (China)',
    name: '中文(简体)',
    flagImg: require('./flags/cn.png'),
    flagTitle: 'China'
  },
  {
    id: 'cn_HK',
    title: 'Traditional Chinese (Hong Kong)',
    name: '中文(香港)',
    flagImg: require('./flags/hk.png'),
    flagTitle: 'Hong Kong'
  },
  {
    id: 'jp_JP',
    title: 'Japanese',
    name: '日本語',
    flagImg: require('./flags/jp.png'),
    flagTitle: 'Japan'
  },
  {
    id: 'ka_JP',
    title: 'Japanese (Kansai)',
    name: '日本語(関西)',
    flagImg: require('./flags/jp.png'),
    flagTitle: 'Japan'
  }
];

export { languages as Languages };
