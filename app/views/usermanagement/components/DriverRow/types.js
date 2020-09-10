// @flow

export type Props = {
  driver: Object, // TODO: Add shape
  onPressItem?: (id: ?number) => void,
  chevron: boolean,
  showRole: boolean,
  disabled?: boolean,
};
