
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
- Required: `$ cp package.json.original package.json` (needed until better solution is found for proxy credentials)
- Add your SSO credentials in the proxy headers of `package.json`
- In the root directory of the repository: `$ yarn install`
- ...followed by `$ yarn start`


create-react-app
================

The base skeleton for this project was generated using [create-react-app](https://github.com/facebookincubator/create-react-app). Have a look at CRA.md for its documentation.


Bootstrap 4
===========

This project uses `Bootstrap 4.0.0-beta` as its base stylesheet. Most of the customization is done in `_lizard.scss`.

To re-build, run `$ npm run dist` in the `public/bootstrap-4.0.0` directory.

You'll need to [install some tooling](https://getbootstrap.com/docs/4.0/getting-started/build-tools/#tooling-setup) first.


Development
===========

A pre-commit hook is configured to run [Prettier.js](https://github.com/prettier/prettier) every time, so the codebase stays in consistent form, style-wise.

If you work on this project, please submit changes via Pull Requests and follow the [commit guidelines as outlined here](https://github.com/conventional-changelog/standard-version#commit-message-convention-at-a-glance).

See [![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)

These commit messages will be used to auto-generate `CHANGELOG.md`.

Have a look at the [buck-trap README](https://github.com/nens/buck-trap/blob/master/README.md) for more information about the release procedure.


Production bundle
=================

Run `yarn build` and look in the `build/` folder.


Releasing
=========

To be written...


Deployment
==========

Uses Ansible for deployment.
To be written...


Internationalisation
====================

This client has l10n/i18n support via react-intl.
English is the default/fallback language.
Dutch is the only supported other language for now.

To extract translation tags to the i18n catalog: `$ yarn run i18n:extract`.
To update the language catalogs: `$ yarn run i18n:update`

To execute both subsequently, run: `$ yarn run i18n:extract-then-update`.

See `src/translations/locales/[language].json`. (where language is 'nl', for now)


Redux
=====

To be written...


React-router
============

To be written...


Sentry
======

To be written...


Browser development extensions
==============================

These extensions may help:

- React Devtools for [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

- Redux Devtools for [Chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) or [Firefox](https://addons.mozilla.org/en-Gb/firefox/addon/remotedev/)
