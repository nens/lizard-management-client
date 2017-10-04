TODO
====

Core stuff
----------

- Notifications: Detailview
- Notifications: re-instantiate threshold modal on edit
- Groups: List and detailview
- Templates: List and detailview
- Send Messages: List and 'action' view


Config
------

- Use env variables in `package.json` for proxy credentials.
  - Question asked on SO:
    https://stackoverflow.com/questions/46540713/how-to-use-npm-config-in-package-json
- Add buck-trap and config
- Add ansible scripts


Features
--------

- Create organisation switcher component (needs org id serialized from /bootstrap/lizard/ endpoint)
- Apps pulldown (grid like Lizard/Google Apps)


Enhancements
------------

- Draw preview timeseries chart as bars or lines based on ratio/interval property
- Auth handling (via sso)
- Full i18n/l10n
- Get i18n catalog translated
- Use default locale from bootstrap endpoint instead of defaulting to english


Bugs / glitches
---------------

- Prevent jumping of alarms list ordering (dont use reverse() there)
