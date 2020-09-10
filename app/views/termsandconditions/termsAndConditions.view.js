import React from 'react';
import { View, WebView, ScrollView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { pathOr } from 'ramda';

import { signoutUser, acceptTerms } from 'views/login/login.action';

import colors from 'styles/colors';
import { defaultNavStyles } from 'styles';
import Header from './components/Header';
import AcceptDecline from './components/AcceptDecline';

import termsText from './termstext';
// const termsText = '<html><body><p>Hello world!</p></body></html>';

type Props = {
  +navigator: Object,
  +afterAccept: () => any,
  +acceptTerms: () => any,
  +signoutUser: () => any,
  +buttonType: 'AcceptDecline' | 'Dismiss',
  +resolve?: () => any,
  +reject?: () => any,
};
class TermsAndConditions extends React.Component<Props> {
  static navigatorStyle = defaultNavStyles;
  static navigatorButtons = {
    leftButtons: [
      {
        id: 'cancel',
        title: 'Close',
      },
    ],
  };
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }
  onNavigatorEvent = (event) => {
    if (event.id === 'cancel' || event.id === 'backPress') {
      this.props.navigator.dismissModal();
      if (this.props.reject) this.props.reject();
    }
  };
  onAccept = () => {
    this.props.navigator.dismissModal();
    this.props.acceptTerms();
    if (this.props.afterAccept) this.props.afterAccept();
    if (this.props.resolve) this.props.resolve();
  };
  onDecline = () => {
    this.props.signoutUser();
    this.props.navigator.dismissModal();
    if (this.props.reject) this.props.reject();
  };
  onClose = () => {
    this.props.navigator.dismissModal();
  };
  render() {
    return (
      <View style={styles.container}>
        <Header />
        <View style={{ flex: 1 }}>
          <WebView
            source={{ html: termsText }}
            style={[styles.terms]}
          />
        </View>
        <AcceptDecline
          buttonType={this.props.buttonType}
          onAccept={this.onAccept}
          onDecline={this.onDecline}
          onClose={this.onClose}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  termsText: pathOr('', [
    'login',
    'user',
    'profiles',
    'profileInfo',
    'terms_and_conditions',
    'latest_text',
  ])(state),
  isSubmitting: state.login.termsAndConditions.isSubmitting,
});
const mapDispatchToProps = {
  acceptTerms,
  signoutUser,
};
export default connect(mapStateToProps, mapDispatchToProps)(TermsAndConditions);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.OFF_WHITE,
  },
  terms: {
    flex: 1,
    padding: 10,
  },
});
