import styled from 'styled-components/native';
import COLORS from './colors';

// global styles go here
export const defaultNavStyles = {
  navBarTextColor: COLORS.WHITE, // change the text color of the title (remembered across pushes)
  navBarButtonColor: COLORS.WHITE,
  navBarBackgroundColor: COLORS.COPART_BLUE, // change the background color of the nav bar (remembered across pushes)
  statusBarColor: COLORS.COPART_BLUE, // Android only - Applied to the status bar
  toolBarColor: COLORS.COPART_BLUE, // Android only - Applied to the bottom bar, some devices (nexus) have soft buttons in bottom
  navigationBarColor: COLORS.COPART_BLUE,
  screenBackgroundColor: COLORS.WHITE,
};

export const ItemSeparatorView = styled.View`
  height: 1.3;
  background-color: #e2e5e8;
`;

export const Container = styled.View`
  flex: 1;
`;

export const RowView = styled.View`
  flex-direction: row;
`;

export const RowBody = styled.View`
  padding-top: 8;
`;

export const BoldText18 = styled.Text`
  font-size: 18;
  font-weight: bold;
`;

export const InfoText = styled.Text`
  font-size: 16;
  padding-bottom: 3;
`;

export const LoadingIndicator = styled.ActivityIndicator`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
