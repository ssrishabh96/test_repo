import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { CenteredWhiteText, MessageBoxView } from './MessageBox.styles';

class MessageBox extends React.Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.string,
    timeout: PropTypes.number,
  }

  static defaultProps = {
    type: 'default',
    timeout: 2500,
  }

  state = {
    isVisible: true,
  }

  componentWillMount() {
    const { timeout } = this.props;
    setTimeout(this.hideView, timeout);
  }

  hideView = () => {
    this.setState({
      isVisible: false,
    });
  }

  render() {
    const { message, type = 'default' } = this.props;
    const { isVisible } = this.state;
    if (isVisible) {
      return (
        <MessageBoxView type={type}>
          <CenteredWhiteText>
            {message}
          </CenteredWhiteText>
        </MessageBoxView>
      );
    }
    return <View />;
  }
}

export default MessageBox;
