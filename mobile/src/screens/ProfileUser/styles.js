import styled from 'styled-components/native';
import Platform from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';

export const Container = styled.View`
  flex: 1;

  justify-content: center;
  padding: 0 30px ${Platform.OS === 'android' ? 130 : 40}px;
`;

export const BackButton = styled.TouchableOpacity`
  margin-top: 32px;
`;

export const Form = styled.View``;

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

export const UserAvatarButton = styled.TouchableOpacity``;

export const UserAvatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 98px;
  align-self: center;
`;

export const DrawView = styled.View`
  border-bottom-color: gray;
  border-bottom-width: 1px;
  margin: 0 24px 14px;
  padding: 14px 0 8px;
`;
