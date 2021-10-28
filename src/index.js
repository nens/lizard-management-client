import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import configureStore from "./configureStore";
import { 
  IntlProvider 
} from 'react-intl';
import translations from './i18n/locales';
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./api/hooks";
import ScrollToTop from "./components/ScrollToTop";
import App from "./App";
import { getLocaleStringFromBrowserSetting } from './utils/detectLanguage';


// Initialize Redux store
let store = configureStore();
export const storeDispatch = store.dispatch;

// React-router basename (https://reacttraining.com/react-router/web/api/BrowserRouter/basename-string)
const basename = "/";

const localeProp = getLocaleStringFromBrowserSetting();

const preferredLocale =
  "en";

const Root = ({ store }) => (
  <IntlProvider
    locale={localeProp}
    defaultLocale="en"
    key={localeProp}
    messages={translations[
      // locale for traditional Chinese is zh-TW, but since
      // zh-TW is not a valid name to be exported from locales.js
      // we use zh_TW instead for traditional Chinese
      localeProp === 'zh-TW' ? 'zh_TW' : localeProp
    ]}
  >
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router basename={basename}>
          <ScrollToTop />
          <IntlProvider
            locale={localeProp}
            defaultLocale="en"
            key={localeProp}
            messages={translations[
              // locale for traditional Chinese is zh-TW, but since
              // zh-TW is not a valid name to be exported from locales.js
              // we use zh_TW instead for traditional Chinese
              localeProp === 'zh-TW' ? 'zh_TW' : localeProp
            ]}
          >
            <App preferredLocale={preferredLocale} />
          </IntlProvider>
        </Router>
      </QueryClientProvider>
    </Provider>
  </IntlProvider>
);

ReactDOM.render(<Root store={store} />, document.getElementById("root"));

if (module.hot) {
  module.hot.accept("./App", () => {
    const HotApp = require("./App").default;
    ReactDOM.render(
      <IntlProvider
        locale={localeProp}
        defaultLocale="en"
        key={localeProp}
        messages={translations[
          // locale for traditional Chinese is zh-TW, but since
          // zh-TW is not a valid name to be exported from locales.js
          // we use zh_TW instead for traditional Chinese
          localeProp === 'zh-TW' ? 'zh_TW' : localeProp
        ]}
      >
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Router basename={basename}>
              <HotApp preferredLocale={preferredLocale} />
            </Router>
          </QueryClientProvider>
        </Provider>
      </IntlProvider>,
      document.getElementById("root")
    );
  });
}
