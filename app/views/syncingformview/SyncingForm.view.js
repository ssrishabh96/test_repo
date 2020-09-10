import React from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';

import { syncFormSubmission } from 'views/pickupform/pickupform.action';
import { defaultNavStyles } from 'styles';
import FullScreenLoader from 'components/custom/FullScreenLoader';

type Props = {
  +navigator: Object,
  +lotsToSync: Array<number>, // array of dispatch ids;
  syncFormSubmission: () => any,
  goBack: ?Function,
};
export class SyncingView extends React.Component<Props> {
  static navigatorStyle = defaultNavStyles;
  static defaultProps = defaultProps;

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.state = {
      index: 0,
    };
  }
  onNavigatorEvent = (event) => {
    if (event.id === 'didAppear') {
      // console.log('start syncing');
      this.startSyncing(0).finally(() => {
        this.props.navigator.dismissModal();
        this.props.goBack();
      });
    }
  };
  startSyncing = (index) => {
    if (this.props.lotsToSync[index]) {
      this.setState({ index });
      return this.syncLot(index).finally(() => this.startSyncing(index + 1));
    }
    return Promise.resolve();
  };
  syncLot = (index) => {
    const id = this.props.lotsToSync[index];
    return this.props.syncFormSubmission(id, this.props.navigator);
  };

  render() {
    // console.log('Rendering!', this.state.index, this.props.submittingStatus);
    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          Syncing Form {this.state.index + 1} of {this.props.lotsToSync.length}
        </Text>
        <Text style={styles.content}>{this.props.submittingStatus}</Text>
        <FullScreenLoader />
      </View>
    );
  }
}
const defaultProps = {
  goBack: () => null,
};
const mapDispatchToProps = {
  syncFormSubmission,
};
const mapStateToProps = state => ({
  submittingStatus: state.pickUpForm.submittingStatus,
});

export default connect(mapStateToProps, mapDispatchToProps)(SyncingView);

const styles = StyleSheet.create({
  container: { flex: 1, alignContent: 'center', backgroundColor: '#fff' },
  header: { fontSize: 20, textAlign: 'center' },
  content: { fontSize: 18, textAlign: 'center' },
});
