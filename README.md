
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
- start the app using `$ yarn start`  
- By default, the proxy sends requests to https://nxt3.staging.lizard.net/  
  (for selected URLs), without authentication.  
- Set up proxy and basic authentication by following the steps [here](./BASIC_AUTH.md)
- start the app by running one of (depending on your choice in previous step) :  

`yarn start`  
or  
`PROXY_URL=https://nxt3.staging.lizard.net/ PROXY_API_KEY=123456789STAGINGKEY yarn start`  
or    
`yarn run startauth`  

Installation problems
=====================

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

Here is how to create a translated html component.  
The majority of your translations will be html components:  

```JSX
  import { FormattedMessage } from 'react-intl.macro';

  ....

  <FormattedMessage 
    id="select_model.header" 
    defaultMessage="Choose model to run" 
  />
```

The method above does not allow to translate to strings (for example needed for html attributes).   
Below methos allows this: the tooltip attribute of the html attribute was translated to a string with the function intl.formatMessage() :    

```JSX
  import { FormattedMessage } from 'react-intl.macro';
  import {  useIntl } from 'react-intl';
  import {formattedMessageToString} from '../utils/translationUtils';

  // inside react component !
  const intl = useIntl();

  ...

  <button
    title={formattedMessageToString(<FormattedMessage id="toolbox.wind_tooltip" defaultMessage="Wind tool"/>, intl)}
  />
```

### Extract translations automatically

To extract the translations run:

### `yarn run i18n:extract`

After this you will need to add the translations to a human readable form by running:   

### `yarn i18n:manageTranslations`

The translations will now be stored in:  
./src/i18n/translations/nl.json  
./src/i18n/translations/en.json  
./src/i18n/translations/es.json  
    
They need to be translated here manually in the .json files.  
We do not need the Spanish translation yet, it just serves as example. 
The English translations should not be edited, but the "defaultMessage" inside the "FormattedMessage" component should be edited instead.    
We do not have a good editor for these translations and are considering how to use the online service transifex.  

### Language displayed in app

To change your preferred language you need to change your browser settings.  
For Firefox it is explained here:   
https://support.mozilla.org/en-US/kb/choose-display-languages-multilingual-web-pages  
For Chrome it is explained here:    
https://support.google.com/chrome/answer/173424?co=GENIE.Platform%3DDesktop&hl=en below "Turn translation on or off for a specific language"  

### more translation details

For translation we used the following tutorial:  
https://objectpartners.com/2019/04/03/translate-create-react-app-with-react-intl/  
The tutorial is already outdated so we improvised a bit. 

### What is currently translated? 
We currently only translated the homepage to Dutch.  
But we plan on translating the whole management app to Dutch. 
Later we might also translate the whole management app to Traditional-Chinese and Vietnamese. 
Previously bigger parts of the app were translated to Dutch, but not everything.
To not get intoo the situation that parts are translated and other parts not we for now comment everything out what is translated outside of the homepage. The only part that is used in both places is the profile dropdown so we must accept that this one can be Dutch, but the rest of the app English.  
Commented out translation components look like this:  
```JSX
{0?<FormattedMessage id="raster_form.aggregation_type_none" defaultMessage="no aggregation" />:null}  
```


### old translations 
Before we used a slightly different translation extraction. 
The resulting translations are now not used, but can still be of value.
They can be found in the folder /src/translations__legacy


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
