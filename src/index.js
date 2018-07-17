import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import configureStore from "./configureStore";
import { addLocaleData, IntlProvider } from "react-intl";
import { HashRouter as Router } from "react-router-dom";
import App from "./App";

import nl from "./translations/locales/nl.json";
import nldata from "react-intl/locale-data/nl";

// Initialize Redux store
let store = configureStore();

// Add localisation data to translations
addLocaleData([...nldata]);

// React-router basename (https://reacttraining.com/react-router/web/api/BrowserRouter/basename-string)
const basename = "/";

// Create multiple languages object
const localeData = {
  nl: nl
};

const preferredLocale =
  localStorage.getItem("lizard-preferred-language") || "en";
const messages = localeData[preferredLocale];

const Root = ({ store }) => (
  <IntlProvider locale={preferredLocale} messages={messages}>
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
      <IntlProvider locale={navigator.language} messages={messages}>
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
