
lizard-management-client
========================

IMPORTANT
=========

This project is in early stages of development. Expect stuff to not work.


![Screenshot](https://raw.githubusercontent.com/nens/lizard-management-client/master/screenshot.jpg?token=AAAcGWEdm9ezSIyVUaNIkOxDiImLdpkOks5Z3cBuwA%3D%3D)

This is the React/Redux-based management interface for Lizard.

It enables administrators and power-users to perform administrative tasks, such as:

- User management
- Alarm management
- 3DI scenario management
- Billing etc.


Installation
============

- Required: A working nodejs and yarn installation.
- In the root directory of the repository: `$ yarn install`
- ...followed by `$ PROXY_USERNAME=<your_sso_username> PROXY_PASSWORD=<your_sso_password> yarn start`



create-react-app
================

The base skeleton for this project was generated using [create-react-app](https://github.com/facebookincubator/create-react-app). Have a look at CRA.md for its documentation.



Development
===========

A pre-commit hook is configured to run [Prettier.js](https://github.com/prettier/prettier) every time, so the codebase stays in consistent form, style-wise.

If you work on this project, please submit changes via Pull Requests and follow the [commit guidelines as outlined here](https://github.com/conventional-changelog/standard-version#commit-message-convention-at-a-glance).

See [![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)

These commit messages will be used to auto-generate `CHANGELOG.md`.

Have a look at the [buck-trap README](https://github.com/nens/buck-trap/blob/master/README.md) for more information about the release procedure.


CSS
===

The first versions of this project used Twitter Bootstrap 4 for the styling of some components like Buttons, Forms and was especially chosen because of its popular grid system.

This worked well until the point where a lot of customization was needed. It required Ruby and Bundler to be installed, as well as some other dependencies. It also involved rebuilding the entire Bootstrap SCSS sourcetree every time.

Twitter Bootstrap was replaced by CSS Grid and Flexbox entirely in [PR #21](https://github.com/nens/lizard-management-client/pull/12).

This project now uses CSS modules almost entirely, save for some CSS reset code in `index.html`.



Production bundle
=================

Run `$ GENERATE_SOURCEMAP=false yarn build` and look in the `build/` folder.


Releasing
=========

Run `$ yarn run release` and answer the questions accordingly.


Deployment
==========

1) Log in to these webservers using SSH:

- p-web-ws-d20.external-nens.local
- p-web-ws-d21.external-nens.local
- p-web-ws-d22.external-nens.local

2) For each webserver, download the release asset you want from [Github](https://github.com/nens/lizard-management-client/releases) to a tmp dir in your home dir using `wget`

3) Unzip the archive

4) Copy or move the contents of the unzipped archive to /srv/nxt.lizard.net/src/lizard-management-client/dist/

5) Set permissions on that directory. Done.




Internationalisation
====================

This client has l10n/i18n support via react-intl.

English is the default/fallback language.
Dutch is the only planned supported other language for now.

To extract translation tags to the i18n catalog: `$ yarn run i18n:extract`.
To update the language catalogs: `$ yarn run i18n:update`

To execute both subsequently, run: `$ yarn run i18n:extract-then-update`.

See `src/translations/locales/[language].json`. (where language is 'nl', for now)


Redux
=====

Redux is used for the app-wide notification system.


React-router
============

React-router is used for the URL setup.


Sentry
======

To be written...


Browser development extensions
==============================

These extensions may help:

- React Devtools for [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

- Redux Devtools for [Chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) or [Firefox](https://addons.mozilla.org/en-Gb/firefox/addon/remotedev/)
