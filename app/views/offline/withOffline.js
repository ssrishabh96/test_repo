import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'ramda';
import hoistStatics from 'hoist-non-react-statics';
import EmptyBucket from 'components/custom/EmptyBucket';
import { getConnectionStatus } from 'views/settings/settings.redux';

type Props = { isOnline: boolean };
const withOffline = (WrappedComponent) => {
  const WithOffline = ({ isOnline, ...props }: Props) => {
    if (isOnline) return <WrappedComponent {...props} />;
    return (<EmptyBucket
      navigator={props.navigator}
      type="offline"
    />);
  };
  hoistStatics(WithOffline, WrappedComponent);
  return WithOffline;
};

const mapStateToProps = state => ({
  isOnline: getConnectionStatus(state),
});
export default compose(connect(mapStateToProps), withOffline);
