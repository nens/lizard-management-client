import React from 'react';
import ButtonStyles from '../../styles/Buttons.module.css';

import {
  HelpText,
  nameHelpText,
} from './defaultHelpText';

const relativeFieldHelpText = (
  <>
    <p>Specify the period to limit the alarm triggering, e.g. to only consider future events. Reference time is the real time at which the alarm is checked.</p>
    <p><em>Leave empty to trigger based on all newly processed data.</em></p>
    <p>
      Find details about this feature <button className={ButtonStyles.Link} onMouseDown={() => window.open("https://docs.lizard.net/f_alarms.html#relative-start-and-end", "_blank")} style={{ padding: 0 }}>in our docs</button>.
    </p>
  </>
);

const snoozeFieldHelpText = (
  <>
    <p>Raise or withdraw the alarm after a series of N consecutive occurrences.</p>
    <p><em>Default is 1, trigger at first sight.</em></p>
    <p>
      Find details about this feature <button className={ButtonStyles.Link} onMouseDown={() => window.open("https://docs.lizard.net/f_alarms.html#snoozing-option", "_blank")} style={{ padding: 0 }}>in our docs</button>.
    </p>
  </>
)

export const rasterAlarmFormHelpText: HelpText = {
  default: 'Form to edit a raster alarm. Please select a field to get more information.',
  name: nameHelpText,
  raster: 'Choose a raster layer to apply this alarm to.',
  point: (
    <>
      <p>Choose a point location for which the data is used in the alarm.</p>
      <p><em>There are three options to select a location:</em></p>
      <ol>
        <li><em>Click on the map;</em></li>
        <li><em>Find an asset to use its location;</em></li>
        <li><em>Set or adjust the coordinates in the geometry field below the map;</em></li>
      </ol>
    </>
  ),
  geometry: 'Geometry of the location.',
  relative: relativeFieldHelpText,
  relativeStart: relativeFieldHelpText,
  relativeEnd: relativeFieldHelpText,
  comparison: (
    <>
      <p>Determine whether the alarm should check for values above or below the specified thresholds.</p>
      <p><em>E.g. check for floods (&#62;) or droughts (&#60;).</em></p>
    </>
  ),
  thresholdValue: 'Set the level for which the alarm should be raised.',
  thresholdLevel: 'Label them with a name to explain the status of the threshold.',
  addNewThreshold: 'Add a new alarm threshold.',
  snoozeOn: snoozeFieldHelpText,
  snoozeOff: snoozeFieldHelpText,
  messages: (
    <>
      <p>Which group of contacts should receive which message when the alarm is triggered?</p>
      <p><em>Multiple entries are allowed, also to set a withdrawal message.</em></p>
    </>
  ),
}

export const timeseriesAlarmFormHelpText: HelpText = {
  default: 'Form to edit a time-series alarm. Please select a field to get more information.',
  name: nameHelpText,
  timeseries_asset: 'Select a location.',
  timeseries_nestedAsset: 'Select a nested asset if any.',
  timeseries: 'Select a time-series.',
}