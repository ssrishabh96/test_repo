// @flow

import React from 'react';
import { TabBar } from 'react-native-tab-view';

import styles, { Badge, TabContainer, TabLabel, TextCount } from './styles';

type Props = {
  tabBarHeaderProps: Object,
  groupCount: number,
  driverCount: number,
};

type TabLabelData = {
  focused: boolean,
  route: { title: string, key: string },
};

const TabBarHeader = (props: Props) => (
  <TabBar
    {...props.tabBarHeaderProps}
    indicatorStyle={styles.indicator}
    style={styles.tabbar}
    tabStyle={styles.tabStyle}
    renderLabel={(data: TabLabelData) => (
      <TabContainer focused={data.focused}>
        <TabLabel focused={data.focused}>{data.route.title}</TabLabel>
        <Badge>
          <TextCount>
            {data.route.key === 'groups' ? props.groupCount : props.driverCount}
          </TextCount>
        </Badge>
      </TabContainer>
    )}
  />
);

export default TabBarHeader;
