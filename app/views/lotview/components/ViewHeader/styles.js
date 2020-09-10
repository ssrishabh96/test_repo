import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  navbarHeading: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#323742',
  },
  navbarHeadingText: {
    fontSize: 14,
    color: '#FDB827',
    fontWeight: 'bold',
    // textAlign: 'center',
  },
  lotNumber: { color: '#fefefe', fontWeight: 'bold', marginRight: 10 },
  headerLeft: {
    alignItems: 'center',
    paddingVertical: 5,
    paddingLeft: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    justifyContent: 'space-between',
  },
  buttonGroup: {
    paddingRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: StyleSheet.absoluteFillObject,
});
