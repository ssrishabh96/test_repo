import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  navbarHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 55,
    backgroundColor: '#323742',
  },
  navbarHeadingText: {
    fontSize: 14,
    color: '#FDB827',
    fontWeight: 'bold',
    // textAlign: 'center',
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
