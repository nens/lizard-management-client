TODO
====

Config
------

- Add buck-trap and config
- Add ansible scripts


Features
--------

DONE - Create organisation switcher component (needs org id serialized from /bootstrap/lizard/ endpoint or call /organisation endpoint on init)
- Apps menu (grid like Lizard/Google Apps)


Enhancements
------------

- Draw preview timeseries chart as bars or lines based on ratio/interval property
- Full i18n/l10n-ify
- Get i18n catalog translated
- Use default locale from bootstrap endpoint instead of defaulting to english
- DONE Snackbar component for errors and notifications


Bugs / glitches
---------------

- Big: Chart doesnt render proper temporal extent
- Big: Facilitate timeseries-alarms as well...
- DONE! Refactor redux code to support pagination
- DONE! Factor Bootstrap out in favor of CSS Grid

Notifications:
- Detail view: Add / remove thresholds
- Detail view: Add / remove recipient groups

Groups contacts:
- Delete checked (api change needed)
- Filter?

Contacts:
- Import contacts
- Delete contacts (api change needed?)
