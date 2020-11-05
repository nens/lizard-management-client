import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import configureStore from "./configureStore";
import { 
  addLocaleData, 
  IntlProvider 
} from 'react-intl';
import { HashRouter as Router } from "react-router-dom";
import App from "./App";

import nl from "./translations/locales/nl.json";
import en from "./translations/locales/en.json";
// import nldata from "react-intl/locale-data/nl";

// import * as serviceWorker from './serviceWorker';
// import { getLocaleStringFromBrowserSetting } from './utils/detectLanguage';

import translations from './i18n/locales';

// In future this would be set by a control on the page
// if you want to test Netherlands or English just change this to nl or en
// if you want to test traditional Chinese then change to zh-TW
// const localeProp = getLocaleStringFromBrowserSetting();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();


//English and Spanish (add more langs here)
// addLocaleData(enLocaleData);
// addLocaleData(esLocaleData);

// Initialize Redux store
let store = configureStore();

// Add localisation data to translations
// addLocaleData([...nldata]);

// React-router basename (https://reacttraining.com/react-router/web/api/BrowserRouter/basename-string)
const basename = "/";

// Create multiple languages object
const localeData = {
  nl: nl,
  en: en
};

const preferredLocale =
  localStorage.getItem("lizard-preferred-language") || "en";
const messages = localeData[preferredLocale];

const Root = ({ store }) => (
  <IntlProvider locale={preferredLocale} messages={messages} key={preferredLocale}>
    <Provider store={store}>
      <Router basename={basename}>
        <App preferredLocale={preferredLocale} />
      </Router>
    </Provider>
  </IntlProvider>
);

ReactDOM.render(<Root store={store} />, document.getElementById("root"));

if (module.hot) {
  module.hot.accept("./App", () => {
    const HotApp = require("./App").default;
    ReactDOM.render(
      <IntlProvider locale={navigator.language} messages={messages} key={preferredLocale+'hot'}>
        <Provider store={store}>
          <Router basename={basename}>
            <HotApp preferredLocale={preferredLocale} />
          </Router>
        </Provider>
      </IntlProvider>,
      document.getElementById("root")
    );
  });
}

// ReactDOM.render(
//   <IntlProvider
//     locale={localeProp}
//     defaultLocale="en"
//     key={localeProp}
//     messages={translations[
//       // locale for traditional Chinese is zh-TW, but since
//       // zh-TW is not a valid name to be exported from locales.js
//       // we use zh_TW instead for traditional Chinese
//       localeProp === 'zh-TW' ? 'zh_TW' : localeProp
//     ]}
//   >
//     <App/>
//   </IntlProvider>,
//   document.getElementById('root')
// );


