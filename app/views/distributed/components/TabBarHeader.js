import React from 'react';
import { TabBar } from 'react-native-tab-view';
import styles, { Badge, TextCount, TabContainer, TabLabel } from './styles';

type Props = {
  props: Object,
  tripCount: number,
  lotCount: number,
};

const TabBarHeader = (props: Props) => (
  <TabBar
    {...props.props}
    indicatorStyle={styles.indicator}
    style={styles.tabbar}
    tabStyle={styles.tabStyle}
    renderLabel={data => (
      <TabContainer focused={data.focused}>
        <TabLabel focused={data.focused}>{data.route.title}</TabLabel>
        <Badge routeKey={data.route.key}>
          <TextCount>{data.route.key === 'trips' ? props.tripCount : props.lotCount}</TextCount>
        </Badge>
      </TabContainer>
    )}
  />
);
export default TabBarHeader;
