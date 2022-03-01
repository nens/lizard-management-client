import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import configureStore from "./configureStore";
import { IntlProvider } from "react-intl";
import translations from "./i18n/locales";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./api/hooks";
import { getLocaleStringFromBrowserSetting } from "./utils/detectLanguage";
import ScrollToTop from "./components/ScrollToTop";
import App from "./App";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

// Initialize Redux store
const store = configureStore();
export const appDispatch: AppDispatch = store.dispatch;
export type AppDispatch = ThunkDispatch<AppState, undefined, AnyAction>;
export type AppState = ReturnType<typeof store.getState>;
export type AppGetState = () => AppState;
export type Thunk = ThunkAction<void, AppState, undefined, AnyAction>;

// React-router basename (https://reacttraining.com/react-router/web/api/BrowserRouter/basename-string)
const basename = "/";

const localeProp = getLocaleStringFromBrowserSetting();

// const preferredLocale = "en";

const Root = () => (
  <IntlProvider
    locale={localeProp}
    defaultLocale="en"
    key={localeProp}
    messages={
      translations[
        // locale for traditional Chinese is zh-TW, but since
        // zh-TW is not a valid name to be exported from locales.js
        // we use zh_TW instead for traditional Chinese
        localeProp === "zh-TW" ? "zh_TW" : localeProp
      ]
    }
  >
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router basename={basename}>
          <ScrollToTop />
          <IntlProvider
            locale={localeProp}
            defaultLocale="en"
            key={localeProp}
            messages={
              translations[
                // locale for traditional Chinese is zh-TW, but since
                // zh-TW is not a valid name to be exported from locales.js
                // we use zh_TW instead for traditional Chinese
                localeProp === "zh-TW" ? "zh_TW" : localeProp
              ]
            }
          >
            <App />
          </IntlProvider>
        </Router>
      </QueryClientProvider>
    </Provider>
  </IntlProvider>
);

ReactDOM.render(<Root />, document.getElementById("root"));

if (module.hot) {
  module.hot.accept("./App", () => {
    const HotApp = require("./App").default;
    ReactDOM.render(
      <IntlProvider
        locale={localeProp}
        defaultLocale="en"
        key={localeProp}
        messages={
          translations[
            // locale for traditional Chinese is zh-TW, but since
            // zh-TW is not a valid name to be exported from locales.js
            // we use zh_TW instead for traditional Chinese
            localeProp === "zh-TW" ? "zh_TW" : localeProp
          ]
        }
      >
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Router basename={basename}>
              <HotApp />
            </Router>
          </QueryClientProvider>
        </Provider>
      </IntlProvider>,
      document.getElementById("root")
    );
  });
}
