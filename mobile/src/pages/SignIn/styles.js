import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 10px 30px ${Platform.OS === 'android' ? 80 : 40}px;
`;

export const Title = styled.Text`
  font-size: 24px;
  color: #fff;
  font-family: 'RobotoSlab-Medium';
  margin: 64px 0 24px;
`;

export const ForgotPassword = styled.TouchableOpacity`
  margin-top: 24px;
`;

export const ForgotPasswordText = styled.Text`
  color: #fff;
  font-family: 'RobotoSlab-Regular';
  font-size: 14px;
`;

export const CreateAccount = styled.TouchableOpacity`
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

export const CreateAccountText = styled.Text`
  margin-left: 4px;
  color: #ff9000;
  font-family: 'RobotoSlab-Medium';
  font-size: 15px;
`;
