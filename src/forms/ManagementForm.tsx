// The main Form class

import React, { Component, ReactElement } from "react";
import { connect } from "react-redux";

interface FieldProps {
  name: string,
  initial?: any,
  validators?: Function[]
}

interface ManagementFormProps {
  children: Component<FieldProps, any>[]
};

interface ManagementFormState {
  formValues: {
    [key: string]: any
  },
  formValidated: {
    [key: string]: boolean
  }
}

class ManagementForm extends Component<ManagementFormProps, ManagementFormState> {
  constructor(props: ManagementFormProps) {
    super(props);

    const children = this.childrenAsArray();

    const formValues: {[key: string]: any} = {};
    const formValidated: {[key: string]: boolean} = {};

    children.forEach(child => {
      const {name, initial} = child.props;

      formValues[name] = initial || null;
    });

    children.forEach(child => {
      const {name, validators} = child.props;

      let validated = true;

      if (validators) {
        validators.forEach(validator => {
          if (validator(formValues[name], formValues)) {
            validated = false;
          }
        });
      }
      formValidated[name] = validated;
    });

    this.state = {
      formValues: formValues,
      formValidated: formValidated
    };

    this.valueChanged = this.valueChanged.bind(this);
  }

  valueChanged(name: string, value: any, validated: boolean): void {
    console.log('valueChanged(', name, value, validated, ')');
    this.setState(prevState => {
      return {
        formValues: {
          ...prevState.formValues,
          [name]: value
        },
        formValidated: {
          ...prevState.formValidated,
          [name]: validated
        }
      };
    });
  }

  childrenAsArray(): Component<FieldProps, {}>[] {
    // React madness: this.props.children is an array, except
    // if there is 1 child.
    const numChildren = React.Children.count(this.props.children);

    if (numChildren === 0) {
      return [];
    }
    if (numChildren === 1) {
      return [React.Children.only(this.props.children)];
    }

    return this.props.children;
  }

  render() {
    return (
      <div>
        {this.childrenAsArray().map(
          (child, idx) => {
            return React.cloneElement(
              (child as unknown) as ReactElement,
              {
                index: idx+1,
                key: "formfield"+idx,
                value: this.state.formValues[child!.props!.name],
                validated: this.state.formValidated[child!.props!.name],
                valueChanged: this.valueChanged,
                formValues: this.state.formValues
              })
          })}
        {JSON.stringify(this.state)}
      </div>
    );
  }
}

export default connect()(ManagementForm);
