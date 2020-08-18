import styled from 'styled-components/native';
import Platform from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  padding: 0 30px ${Platform.OS === 'android' ? 130 : 40}px;
`;

export const Title = styled.Text`
  font-size: 24px;
  color: #fff;
  font-family: 'RobotoSlab-Medium';
  margin: 64px 0 24px;
`;

export const BackToSignIn = styled.TouchableOpacity`
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  background: #005338;
  border-top-width: 1px;

  padding: 16px 0 ${14 + getBottomSpace()}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const BackToSignInText = styled.Text`
  margin-left: 4px;
  color: #fff;
  font-family: 'RobotoSlab-Regular';
  font-size: 14px;
`;
