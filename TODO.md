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



Group > contact > add  
- This should be a modal with a list of all contacts MINUS the contacts in the list we're adding to.
- This modal should have 2 tabs: The list of all contacts and an "Add new user form"



Groups: Modal voor toevoegen 1 of meerdere gebruikers
Groups contacts:
- delete checked
- pagination?
- filter?
- click to edit contact (detail/modal?)
- send message modal


Templates:
- delete template
- edit template

























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
