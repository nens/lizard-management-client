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

- Add buck-trap and config
- Add ansible scripts


Features
--------

DONE - Create organisation switcher component (needs org id serialized from /bootstrap/lizard/ endpoint or call /organisation endpoint on init)
- Apps menu (grid like Lizard/Google Apps)


Enhancements
------------

- Draw preview timeseries chart as bars or lines based on ratio/interval property
- Auth handling (via sso)
- Full i18n/l10n
- Get i18n catalog translated
- Use default locale from bootstrap endpoint instead of defaulting to english
- Snackbar component for errors and notifications


Bugs / glitches
---------------

- Chart doesnt render proper temporal extent

- Big: Facilitate timeseries-alarms as well...

- Factor Bootstrap out in favor of CSS Grid https://hacks.mozilla.org/2017/04/replace-bootstrap-layouts-with-css-grid/

Notifications:
- Detail view: Add / remove thresholds
- Detail view: Add / remove recipient groups
- Detail view: Map and chart

Groups contacts:
- Delete checked (api change needed)
- Pagination?
- Filter?
- Detail view (delete users from group)

Contacts:
- Add contact
- Import contacts
- Delete contacts (api change needed?)

Templates:
- Delete template
- Edit template









<div className="row">
  <div className="col-md-6 form-group">
    <input
      className="form-control"
      type="text"
      id="firstName"
      defaultValue=""
      placeholder=""
      maxLength={80}
    />
    <small id="helpText" className="form-text text-muted">
      First name
    </small>
  </div>
  <div className="col-md-6 form-group">
    <input
      className="form-control"
      type="text"
      id="lastName"
      defaultValue=""
      placeholder=""
      maxLength={80}
    />
    <small id="helpText" className="form-text text-muted">
      Last name
    </small>
  </div>
</div>
<div className="row">
  <div className="col-md-12 form-group">
    <input
      className="form-control"
      type="text"
      id="emailAddress"
      defaultValue=""
      placeholder=""
      maxLength={200}
    />
    <small id="helpText" className="form-text text-muted">
      E-mail address
    </small>
  </div>
</div>
