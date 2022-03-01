/* Definitions for react-intl.macro */

declare module "react-intl.macro" {
  import React from "react";

  interface FormattedMessageProps {
    id: string;
    defaultMessage: string;
    values?: object;
  }
  export class FormattedMessage extends React.Component<FormattedMessageProps> {}
}
