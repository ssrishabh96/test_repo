import React from 'react';
import { StatusBar } from 'react-native';
import Swiper from './components/swiper';
import steps from './steps';
import { Screen } from './components/screen';
import { ScreenOne } from './components/screenOne';

type ModalProps = {
  +navigator: {
    +dismissModal: () => any,
  },
};
type ViewProps = {
  +onComplete: () => any,
};
class Onboarding extends React.Component<ModalProps | ViewProps> {
  static navigatorStyle = {
    navBarHidden: true,
  };
  handleOnboardingComplete = () => {
    if (this.props.onComplete !== undefined) this.props.onComplete();
    this.props.navigator.dismissModal();
  };
  render() {
    return (
      <Swiper handleOnboardingComplete={this.handleOnboardingComplete}>
        {/* works with custom screens */}
        <ScreenOne />

        {/* and screens mapped from a file */}
        {steps.map(step => (<Screen
          {...step}
          key={step.id}
        />))}
      </Swiper>
    );
  }
}
export default Onboarding;
