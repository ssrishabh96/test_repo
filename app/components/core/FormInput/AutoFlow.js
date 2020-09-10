import React from 'react';
import { View } from 'react-native';

/**
 * AutoFlow can be wrapped around redux-form Field components to auto focus on next field on submit.
 * (note the Field component must be a class so a ref can be assigned, and have a .focus() function)
 */
export default class AutoFlow extends React.Component {
  fields = [];

  gotoNext = (i) => {
    if (
      i < this.fields.length - 1 &&
      this.fields[i + 1] &&
      this.fields[i + 1].getRenderedComponent &&
      this.fields[i + 1].getRenderedComponent().focus
    ) {
      this.fields[i + 1].getRenderedComponent().focus();
    }
  };
  setRef = (ref, i) => {
    this.fields[i] = ref;
  };

  render() {
    const count = React.Children.length - 1;
    const newChildren = React.Children.map(this.props.children, (child, i) =>
      React.cloneElement(child, {
        ref: ref => this.setRef(ref, i),
        withRef: true,
        returnKeyType: i === count ? 'done' : 'next',
        onSubmitEditing: () => {
          this.gotoNext(i);
        },
      }),
    );
    return <View>{newChildren}</View>;
  }
}
