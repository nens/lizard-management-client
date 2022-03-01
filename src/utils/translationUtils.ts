import { IntlShape } from "react-intl";

// Sometimes for example with tooltips / title of html elements a react JSX formatted message can not be used.
// We did a lot of double coding the translations for this,
// but this is hopefully a good way to change a formatted message to a string without hardcoding everything double
export const formattedMessageToString = (
  formattedMessage: JSX.Element,
  intl: IntlShape,
  options?: any
): string => {
  return intl.formatMessage(
    {
      id: formattedMessage.props.id,
      defaultMessage: formattedMessage.props.defaultMessage,
    },
    options
  );
};
