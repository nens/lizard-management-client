import React from 'react';

export interface HelpText {
  [name: string]: string | JSX.Element
};

export const nameHelpText = 'Choose a name that is findable and not too difficult.';

export const organisationHelpText = (
  <>
    <p>The organisation which this object belongs to.</p>
    <p><i>This field is always pre-filled with the current organisation.</i></p>
  </>
);