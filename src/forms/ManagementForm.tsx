// The main Form class

import React, { Component, ReactElement } from "react";
import DisabledStep from "./DisabledStep";
import WithStep from "./WithStep";
import SubmitButton from "./SubmitButton";

/*

   Show a number of InputFields in a nice style, and call a function
   if the whole form is submitted.

   Fields can have an array of "validators"; if present, these are
   functions that get two parameters (one the value of the field
   itself, one an object with all field values list in the form before
   this one) and return "false" on success, or an error message on
   failure.

   Fields can have a single "disabler"; if present, it is either a
   boolean or a function that takes an object with all field values
   listed earlier in the form than this one, and it returns "true" if
   this field should be disabled.

   The 'wizardStyle' property:

   The idea is that creating a new object uses the Wizard style,
   whereas with editing existing objects it is more useful to show all
   the data.

   With non-WizardStyle:

   If wizardStyle is false, show all fields immediately, don't use
   "Next" buttons.

   Things are easy: we show a Submit button at the end, which is
   active iff all fields are either validated or disabled; the user
   can any edit field he wants and there is no navigation. Check marks
   are always shown if validated.

   If the Submit button is clicked while there are still validation
   errors, error messages are shown at all steps with errors.

   With wizardStyle:

   - If wizardStyle is true, the user is expected to fill in the form
   step by step. There is a 'current step', only it is shown as
   open. When the user clicks "Next Step" or presses Enter, the next
   *non-disabled* field is opened, if any.

   - We track which fields have already been 'opened'; only those
   fields have a checkmark shown.

   - We track from which fields the user has already 'triedToMoveOn';
   only those fields will show error messages in red.

   - If a field is opened, we try to set the focus to its InputField,
   if applicable.

   '- The Submit button is only shown when the last step is opened,
   and in that case that last step doesn't show its Next button.

   - The user can click on step numbers; going back is always
   successful, going to the current step or a disabled step never does
   anything. Going to a later step *tries* to go to the next step
   repeatedly until some field doesn't validate or the goal is
   reached. Disabled steps are skipped.

   - The Next button just tries to go to the next step.

 */

type formValues = {
  [key: string]: any
};

interface FieldProps {
  name: string,
  title?: string,
  initial?: any,
  subtitle?: string,
  validators?: Function[],
  disabled?: Function | boolean
}

interface ManagementFormProps {
  wizardStyle?: boolean,
  children: Component<FieldProps, any>[],
  onSubmit: (validatedData: formValues) => void
};

interface ManagementFormState {
  allNames: string[],
  formValues: {
    [key: string]: any
  },
  formValidators: {
    [key: string]: Function[]
  },
  formDisablers: {
    [key: string]: Function | boolean
  },
  formValidated: {
    [key: string]: boolean
  },
  formErrors: {
    [key: string]: string[]
  }
  formDisabled: {
    [key: string]: boolean
  },
  currentFieldIndex: number,
  highestFieldSoFar: number,
  triedToMovePastField: number
}

class ManagementForm extends Component<ManagementFormProps, ManagementFormState> {
  constructor(props: ManagementFormProps) {
    // Set up the formValues and formValidated state. Each is an object
    // with the 'name' properties of the children as keys. Children can have
    // a property 'initial' to use as initial value, otherwise it is null.
    // Children may also have an array 'validators', they are used to created
    // the second object that has booleans as values.
    super(props);

    const children = this.childrenAsArray();

    // allNames: a list of names. Used to remember what order the fields are in.
    const allNames: string[] = [];

    // The current value of each field.
    const formValues: {[key: string]: any} = {};

    // A list of validator functions for each field.
    const formValidators: {[key: string]: Function[]} = {};

    // A list of disabler functions (or booleans) for each field.
    const formDisablers: {[key: string]: Function | boolean} = {};

    // Get values from the Field components' props to fill the
    // aforementioned variables.
    children.forEach(child => {
      const {name, initial, validators, disabled} = child.props;

      formValues[name] = initial || null;
      formValidators[name] = validators || [];
      formDisablers[name] = disabled || false;
      allNames.push(name);
    });

    // Initial calculation of validation values. Errors contains an array
    // of error message for each field (empty if there are no errors).
    // Validated has a boolean for each field that is true if there are
    // no errors.
    const errors = this.calculateValidated(
      allNames, formValues, formValidators);
    const validated: {[key: string]: boolean} = {};
    allNames.forEach(name => {
      validated[name] = errors[name].length === 0;
    });

    // A disabled boolean for each field.
    const disabled = this.calculateDisabled(
      allNames, formValues, formDisablers);

    this.state = {
      allNames: allNames,
      formValues: formValues,
      formValidators: formValidators,
      formValidated: validated,
      formErrors: errors,
      formDisablers: formDisablers,
      formDisabled: disabled,
      // The following are for wizardStyle only
      // Currently opened field
      currentFieldIndex: 0,
      // The highest field that was opened (show checkmarks up to here)
      highestFieldSoFar: 0,
      // The highest field we tried to move past (show errors up to here)
      triedToMovePastField: -1
    };
  }

  valuesUpTo(
    allNames: string[],
    formValues: formValues,
    upToName: string
  ): formValues {
    // Copy all *not-disabled, validated* values from formValues up to
    // (excluding) the one for the field with name upToName.
    const valuesUpTo: formValues = {};

    let found: boolean = false;

    allNames.forEach(name => {
      if (name === upToName) {
        found = true;
      }
      if (found) {
        return;
      }
      valuesUpTo[name] = formValues[name];
    });

    return valuesUpTo;
  }

  calculateValidated(
    allNames: string[],
    formValues: formValues,
    formValidators: {[key: string]: Function[]}
  ): {[key: string]: string[]} {
    const formErrors: {[key: string]: string[]} = {};

    allNames.forEach(name => {
      const value: any = formValues[name];
      const validators: Function[] = formValidators[name];

      const errors: string[] = [];

      // Only check with the values above this one
      // Wizards become hard if fields are invalidated because of later
      // ones, and there could be circular dependencies that way.
      const formValuesForTesting = this.valuesUpTo(allNames, formValues, name);
      validators.forEach(validator => {
        const errorMessage = validator(value, formValuesForTesting);
        if (errorMessage) {
          errors.push(errorMessage);
        }
      });

      formErrors[name] = errors;
    });

    return formErrors;
  }

  calculateDisabled(
    allNames: string[],
    formValues: formValues,
    formDisablers: {[key: string]: Function | boolean}
  ): {[key: string]: boolean} {
    const formDisabled: {[key: string]: boolean} = {};
    allNames.forEach(name => {
      const disabler = formDisablers[name];

      if (disabler === undefined || disabler === false) {
        formDisabled[name] = false;
      } else if (disabler === true) {
        formDisabled[name] = true;
      } else {
        formDisabled[name] = disabler(
          this.valuesUpTo(allNames, formValues, name)) as boolean;
      }
    });

    return formDisabled;
  }

  valueChanged(name: string, value: any): void {
    // This function is passed to children so they can update their value.
    const newValues = {
      ...this.state.formValues,
      [name]: value
    };

    // As validation can depend on values of other fields, we re-calculate
    // all validations.
    const newErrors = this.calculateValidated(
      this.state.allNames, newValues, this.state.formValidators);
    const newValidated: {[key: string]: boolean} = {};
    this.state.allNames.forEach(name => {
      newValidated[name] = newErrors[name].length === 0;
    });

    const newDisabled = this.calculateDisabled(
      this.state.allNames, newValues, this.state.formDisablers);

    this.setState({
      formValues: newValues,
      formValidated: newValidated,
      formErrors: newErrors,
      formDisabled: newDisabled
    });
  }

  lastStep(): number {
    // Return the index of the last *enabled* step.

    let indexOfLastStep = this.state.allNames.length - 1;
    while (this.state.formDisabled[this.state.allNames[indexOfLastStep]]) {
      indexOfLastStep--;
    }
    return indexOfLastStep;
  }

  tryToGoToStep(to: number) {
    // Going to an earlier step always succeeds immediately,
    // unless the to: step is disabled; then nothing happens.
    // To a later number, we move step by step. The step fails
    // if the current step is not validated. We always continue
    // if the step is disabled. We finish if the end of the
    // list or the goal is reached.
    const from = this.state.currentFieldIndex;
    const names = this.state.allNames;
    const lastStep = this.lastStep();

    if (to > lastStep) {
      to = lastStep;
    }

    if (to <= from) {
      if (to !== from && !this.state.formDisabled[names[to]]) {
        this.setState({currentFieldIndex: to});
      }
      return;
    }

    // True now: from < to <= lastStep, if to != lastStep then there is at least
    // one enabled field after to

    // Now we move step by step.
    let current = from;
    let triedToMovePastField = this.state.triedToMovePastField;

    while (current < to || this.state.formDisabled[names[current]]) {
      const name = names[current];
      // Don't move on if the field doesn't validate
      if (!this.state.formDisabled[name] && !this.state.formValidated[name]) {
        triedToMovePastField = current; // Show error messages up to here
        break;
      }

      // Move on.
      current++;
    }

    const highestFieldSoFar = Math.max(this.state.highestFieldSoFar, current);
    this.setState({
      currentFieldIndex: current,
      highestFieldSoFar,
      triedToMovePastField
    });
  }

  notValidatedSteps(): number[] {
    const notValidated: number[] = [];

    this.state.allNames.forEach((name, idx) => {
      if (!this.state.formValidated[name] && !this.state.formDisabled[name]) {
        notValidated.push(idx + 1);
      }
    });

    return notValidated;
  }

  handleEnter(idx:number, event: any) {
    if (event.keyCode === 13) {
      // 13 is keycode 'enter' (works only when current input validates)
      this.tryToGoToStep(idx + 1);
    }
  }

  childrenAsArray(): Component<FieldProps, {}>[] {
    // React madness: this.props.children is an array, except
    // if there is 1 child. This helper method always returns
    // an array of children.
    const numChildren = React.Children.count(this.props.children);

    if (numChildren === 0) {
      return [];
    }
    if (numChildren === 1) {
      return [React.Children.only(this.props.children)];
    }

    return this.props.children;
  }

  submit() {
    // Check if all is OK.
    const notValidatedSteps = this.notValidatedSteps();
    if (notValidatedSteps.length > 0) {
      // Say we wanted to move past the whole form, so we show all errors
      this.setState({triedToMovePastField: this.state.allNames.length});
      return;
    }

    // Collect all enabled values and call the submit function with them.
    const allValues: formValues = {};

    this.state.allNames.forEach(name => {
      if (this.state.formDisabled[name]) return;

      allValues[name] = this.state.formValues[name];
    });

    this.props.onSubmit(allValues);
  }

  render() {
    const {
      currentFieldIndex,
      formValues,
      formValidated,
      formErrors,
      formDisabled,
      highestFieldSoFar,
      triedToMovePastField
    } = this.state;
    const { wizardStyle } = this.props;

    return (
      <div>
        {this.childrenAsArray().map(
          (child, idx) => {
            const name: string = child.props.name;
            const title: string = child.props.title || name;
            const subtitle: string = child.props.subtitle || '';
            const validated = formValidated[name];
            const disabled = formDisabled[name];
            const errors = formErrors[name];

            const childWithExtraFields = React.cloneElement(
              (child as unknown) as ReactElement,
              {
                value: formValues[name],
                validated: validated,
                valueChanged: (value: any) => this.valueChanged(name, value),
                wizardStyle: wizardStyle,
                handleEnter: (e: any) => this.handleEnter(idx, e)
              });

            if (disabled) {
              return (
                <DisabledStep
                  key={"formfield"+idx}
                  step={idx+1}
                  title={title}
                />
              );
            } else if (wizardStyle) {
              return (
                <WithStep
                  step={idx+1}
                  title={title}
                  subtitle={subtitle}
                  key={"formfield"+idx}
                  opened={idx === currentFieldIndex}
                  showCheck={idx <= highestFieldSoFar}
                  showErrors={idx <= triedToMovePastField}
                  nextStep={() => this.tryToGoToStep(idx + 1)}
                  selectStep={() => this.tryToGoToStep(idx)}
                  wizardStyle={true}
                  isLastStep={idx >= this.lastStep()}
                  validated={validated}
                  errors={errors}>
                  {childWithExtraFields}
                </WithStep>
              );
            } else {
              return (
                <WithStep
                  step={idx+1}
                  title={title}
                  subtitle={subtitle}
                  key={"formfield"+idx}
                  showCheck={true}
                  showErrors={idx <= triedToMovePastField}
                  wizardStyle={false}
                  opened={true}
                  validated={validated}
                  errors={errors}>
                  {childWithExtraFields}
                </WithStep>
              );
            }
          })}
        {!wizardStyle || currentFieldIndex >= this.lastStep() ?
         <SubmitButton notValidatedSteps={this.notValidatedSteps()} submit={this.submit.bind(this)} /> : null}
      </div>
    );
  }
}

export default ManagementForm;
