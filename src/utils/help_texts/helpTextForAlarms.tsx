import React from "react";
import ButtonStyles from "../../styles/Buttons.module.css";

import { HelpText, nameHelpText, uuidHelpText } from "./defaultHelpText";

const relativeFieldHelpText = (
  <>
    <p>
      Specify the period to limit the alarm triggering, e.g. to only consider future events.
      Reference time is the real time at which the alarm is checked.
    </p>
    <p>
      <em>Leave empty to trigger based on all newly processed data.</em>
    </p>
    <p>
      Find details about this feature{" "}
      <button
        className={ButtonStyles.Link}
        onMouseDown={() =>
          window.open("https://docs.lizard.net/f_alarms.html#relative-start-and-end", "_blank")
        }
        style={{ padding: 0 }}
      >
        in our docs
      </button>
      .
    </p>
  </>
);

const snoozeFieldHelpText = (
  <>
    <p>Raise or withdraw the alarm after a series of N consecutive occurrences.</p>
    <p>
      <em>Default is 1, trigger at first sight.</em>
    </p>
    <p>
      Find details about this feature{" "}
      <button
        className={ButtonStyles.Link}
        onMouseDown={() =>
          window.open("https://docs.lizard.net/f_alarms.html#snoozing-option", "_blank")
        }
        style={{ padding: 0 }}
      >
        in our docs
      </button>
      .
    </p>
  </>
);

export const alarmFormHelpText: HelpText = {
  default: "Form to edit an alarm. Please select a field to get more information.",
  name: nameHelpText,
  uuid: uuidHelpText,
  raster: (
    <>
      <p>Choose a raster layer to apply this alarm to.</p>
      <p>
        <em>Tip: You can search for raster layer by name or UUID.</em>
      </p>
    </>
  ),
  point: (
    <>
      <p>Choose a point location for which the data is used in the alarm.</p>
      <p>
        <em>There are three options to select a location:</em>
      </p>
      <ol>
        <li>
          <em>Click on the map;</em>
        </li>
        <li>
          <em>Find an asset to use its location;</em>
        </li>
        <li>
          <em>Set or adjust the coordinates in the geometry field below the map;</em>
        </li>
      </ol>
    </>
  ),
  geometry: "Geometry of the location.",
  timeseries_asset: (
    <>
      <p>Search and select the asset to which the timeseries you are looking for is related to.</p>
      <p>
        <em>
          In case of a groundwater filter or pump, select the related sub-location in the second
          dropdown.
        </em>
      </p>
    </>
  ),
  timeseries_nestedAsset:
    "Select the related sub-location in case of a groundwater filter or pump.",
  timeseries: (
    <>
      <p>
        Select the timeseries to apply the alarm to from the list of related timeseries of the
        selected asset.
      </p>
      <p>
        <em>
          Tip: First select a location (and a sub-location if available) to find the related
          timeseries.
        </em>
      </p>
    </>
  ),
  relative: relativeFieldHelpText,
  relativeStart: relativeFieldHelpText,
  relativeEnd: relativeFieldHelpText,
  comparison: (
    <>
      <p>
        Determine whether the alarm should check for values above or below the specified thresholds.
      </p>
      <p>
        <em>E.g. check for floods (&#62;) or droughts (&#60;).</em>
      </p>
    </>
  ),
  thresholdValue: "Set the level for which the alarm should be raised.",
  thresholdLevel: "Label them with a name to explain the status of the threshold.",
  addNewThreshold: "Add a new alarm threshold.",
  snoozeOn: snoozeFieldHelpText,
  snoozeOff: snoozeFieldHelpText,
  contactGroup: (
    <>
      <p>Select a group of contacts to receive message when the alarm is triggered.</p>
      <p>
        <em>Multiple entries are allowed, also to set a withdrawal message.</em>
      </p>
    </>
  ),
  message: (
    <>
      <p>Select a template message to send to the selected group when the alarm is triggered.</p>
      <p>
        <em>Multiple entries are allowed, also to set a withdrawal message.</em>
      </p>
    </>
  ),
  addRecipient: "Add a new recipient by selecting a group and a template message for it.",
};
