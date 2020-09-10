// @flow
import React from 'react';
import {
  View,
  Dimensions,
  Platform,
  ScrollView,
  NativeSyntheticEvent,
  StatusBar,
} from 'react-native';
import { flatten } from 'ramda';
import colors from 'styles/colors';
import { Button } from './button';

type Props = {
  children: React.Node,
  style: {},
};
export default class OnboardingScreens extends React.Component<Props> {
  static defaultProps = {
    horizontal: true,
    pagingEnabled: true,
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
    bounces: false,
    scrollsToTop: false,
    removeClippedSubviews: true,
    automaticallyAdjustContentInsets: false,
    index: 0,
  };

  state = this.initState(this.props);

  onScrollBegin = () => {
    // Update internal isScrolling state
    this.internals.isScrolling = true;
  };
  onScrollEnd = (e: NativeSyntheticEvent) => {
    // Update internal isScrolling state
    this.internals.isScrolling = false;

    // Update index
    this.updateIndex(
      e.nativeEvent.contentOffset
        ? e.nativeEvent.contentOffset.x
        : // When scrolled with .scrollTo() on Android there is no contentOffset
        e.nativeEvent.position * this.state.width,
    );
  };
  onScrollEndDrag = (e: NativeSyntheticEvent) => {
    const { contentOffset: { x: newOffset } } = e.nativeEvent;
    const { children } = this.props;
    const { index } = this.state;
    const { offset } = this.internals;

    // Update internal isScrolling state
    // if swiped right on the last slide
    // or left on the first one
    if (offset === newOffset && (index === 0 || index === children.length - 1)) {
      this.internals.isScrolling = false;
    }
  };
  initState(props: Props) {
    const totalChildren = flatten(props.children).length;
    const index = totalChildren > 1 ? Math.min(props.index, totalChildren - 1) : 0;
    const offset = width * index;

    // Component internals as a class property,
    // and not state to avoid component re-renders when updated
    this.internals = {
      isScrolling: false,
      offset,
    };
    return {
      totalChildren,
      index,
      offset,
      width,
      height,
    };
  }

  // update index after scroll
  updateIndex = (offset: number) => {
    const state = this.state;
    const diff = offset - this.internals.offset;
    const step = state.width;
    let index = state.index;

    // Do nothing if offset didn't change
    if (!diff) {
      return;
    }

    // Make sure index is always an integer
    index = parseInt(index + Math.round(diff / step), 10);

    // Update internal offset
    this.internals.offset = offset;
    // Update index in the state
    this.setState({
      index,
    });
  };

  // swipe one slide forward
  swipe = () => {
    // Ignore if already scrolling or if there is less than 2 slides
    if (this.internals.isScrolling || this.state.totalChildren < 2) {
      return;
    }

    const state = this.state;
    const diff = this.state.index + 1;
    const x = diff * state.width;
    const y = 0;

    // Call scrollTo on scrollView component to perform the swipe
    this.scrollView && this.scrollView.scrollTo({ x, y, animated: true });

    // Update internal scroll state
    this.internals.isScrolling = true;

    // Trigger onScrollEnd manually on android
    if (Platform.OS === 'android') {
      setImmediate(() => {
        this.onScrollEnd({
          nativeEvent: {
            position: diff,
          },
        });
      });
    }
  };
  renderScrollView = (pages: Array<React.Node>) => {
    const flattenedPages = flatten(pages);
    return (
      <ScrollView
        ref={(component) => {
          this.scrollView = component;
        }}
        {...this.props}
        contentContainerStyle={[styles.wrapper, this.props.style]}
        onScrollBeginDrag={this.onScrollBegin}
        onMomentumScrollEnd={this.onScrollEnd}
        onScrollEndDrag={this.onScrollEndDrag}
      >
        {flattenedPages.map((page: React.Node, i: number) => (
          // Render each slide inside a View
          <View
            style={[styles.fullScreen, styles.slide]}
            key={i}
          >
            {page}
          </View>
        ))}
      </ScrollView>
    );
  };
  renderPagination = () => {
    if (this.state.totalChildren <= 1) {
      return null;
    }
    const ActiveDot = <View style={[styles.dot, styles.activeDot]} />;
    const Dot = <View style={styles.dot} />;
    const dots = [];

    for (let key = 0; key < this.state.totalChildren; key++) {
      dots.push(
        key === this.state.index
          ? React.cloneElement(ActiveDot, { key })
          : React.cloneElement(Dot, { key }),
      );
    }
    return (
      <View
        pointerEvents="none"
        style={[styles.pagination]}
      >
        {dots}
      </View>
    );
  };
  render() {
    const lastScreen = this.state.index === this.state.totalChildren - 1;
    return (
      <View style={[styles.container, styles.fullScreen]}>
        <View style={{ flex: 1 }}>{this.renderScrollView(this.props.children)}</View>
        <View style={styles.footer}>
          <Button
            text="Skip"
            onPress={this.props.handleOnboardingComplete}
          />
          {this.renderPagination()}
          {lastScreen ? (
            // Show this button on the last screen
            // TODO: Add a handler that would send a user to your app after onboarding is complete
            <Button
              text="Start Now"
              onPress={this.props.handleOnboardingComplete}
              style={{ color: colors.COPART_BLUE }}
            />
          ) : (
            // Or this one otherwise
            <Button
              text="Next"
              onPress={() => this.swipe()}
            />
          )}
        </View>
      </View>
    );
  }
}

const { width, height } = Dimensions.get('window');
const styles = {
  // Set width and height to the screen size
  fullScreen: {
    width,
    ...Platform.select({
      ios: {
        height,
      },
      android: {
        height: height - StatusBar.currentHeight,
      },
    }),
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: 60,
  },
  // Main container
  container: {
    backgroundColor: 'white',
    position: 'relative',
  },
  // Slide
  slide: {
    backgroundColor: 'transparent',
  },
  // Pagination indicators
  pagination: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  // Pagination dot
  dot: {
    backgroundColor: 'rgba(0,0,0,.25)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  // Active dot
  activeDot: {
    backgroundColor: colors.COPART_BLUE,
  },
};
