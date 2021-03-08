
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
- make a copy of the file 'startauth.example' and call it 'startauth'
- replace the '<personal_api_key>' with your personal api key requested in the [api-key-management-page](https://nxt3.staging.lizard.net/management)
- Now you can start with basic-auth by doing `yarn start` or withouth basic-auth `yarn run start-minimal`    
- In case you run into the followinf error on unbuntu:  
"/bin/sh: 1: ./startauth: Permission denied  
error Command failed with exit code 126."  
Make the file 'startauth' executable as described here: https://askubuntu.com/questions/484718/how-to-make-a-file-executable
- in case you run into the following error:  
postcss@8.2.1: The engine "node" is incompatible with this module. Expected version "^10 || ^12 || >=14". Got "13.7.0"   
Use nvm to use nodeJS version 12:  
`$ nvm install 12`  
`$ nvm use 12`  


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

View development server on multiple devices
======================================

1. In lizard-nxt, go to the settings folder and make a file and name it 'localsettings.py'. In this file, write:
ALLOWED_HOSTS = ['localhost', 'YOUR_HOSTNAME']

2. In this repository then, look for the 'start.js' file under 'scripts'. Change the line that contains:
const HOST = process.env.HOST || '0.0.0.0', replace the HOST value with your IP address.

3. On another device you can now open de browser and go to 'http://YOUR_HOSTNAME:3000/

Storybook
=========
Simple UI-focused React components can be tested in Storybook. They can be developed there and then used in larger screens.

Run it with

`$ yarn run storybook`

And Storybook will be available on https://localhost:9009/.

There is important configuration in the .storybook/ directory; it defines which files contain stories (*.stories.tsx files) and which plugins we use (actions and knobs; links too but I don't think I use it).

- Actions can show messages when a callback is used (e.g. when a button on the component is pressed)
- Knobs let the Storybook user control what value is used for a prop

Together that is enough to test the components.

preview-head.html is used in the template used by Storybook to render the components. It contains two important things:

- External CSS and JS files, in this case particularly the Google fonts, but I included everything we have in index.html for the App.

- The CSS from index.css, copy and pasted. As there is no easy way to include a CSS file that in the app is included by Webpack. If you update index.css, also update the CSS here!


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
=========

For the deployment of frontend repositories we make use of an Ansible script in the lizard-nxt repository.
More information is provided in the readme file of lizard-nxt: https://github.com/nens/lizard-nxt/blob/master/README.rst
Look below the heading "Deployment clients".


Internationalisation
====================

This client has l10n/i18n support via react-intl.

English is the default/fallback language.
Dutch is the only planned supported other language for now.

Below is described how to automaticly extract translations.
Currently this does not find the translations that are passed as formatted messages in attributes of react components,
nor does it find messages translated with intl.formatMessage({ id: "<key>" });
Even worse, it deletes existing translations that were made that way.
Therefore we do not currently use below command, but keep translations in sync manually.

To extract translation tags to the i18n catalog (this thus wrongly removes some translations and should not be used untill this problem is resolved): `$ yarn run i18n:extract`.



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
