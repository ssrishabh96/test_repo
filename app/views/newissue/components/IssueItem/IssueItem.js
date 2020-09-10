// @flow

import React from 'react';
import { View, Text } from 'react-native';
import renderIf from 'render-if';

import Icon from 'react-native-vector-icons/dist/FontAwesome';
import styles from './style';

import { Props } from './types';

const IssueItem = ({ checked, item, isSubIssueView }: Props) => {
  const renderIfIsSubIssueView = renderIf(isSubIssueView);
  const renderIfNotIsSubIssueView = renderIf(!isSubIssueView);
  return (
    <View style={styles.issueItemView}>
      <Text style={styles.textDescription}>{item.description}</Text>
      {renderIfIsSubIssueView(checked && <Icon
        name="check"
        size={20}
        color="green"
      />)}
      {renderIfNotIsSubIssueView(<Icon
        name="chevron-right"
        size={20}
        color={'grey'}
      />)}
    </View>
  );
};

export default IssueItem;
