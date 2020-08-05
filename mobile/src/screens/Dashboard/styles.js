import styled from 'styled-components/native';
import { Platform, TouchableOpacity } from 'react-native';

import { getStatusBarHeight } from 'react-native-iphone-x-helper';

export const Container = styled.View`
  flex: 1;
`;
export const Header = styled.View`
  padding: 24px;
  padding-top: ${Platform.OS === 'ios' ? getStatusBarHeight() + 24 : 24}px;
  background: #0f2417;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
export const HeaderText = styled.Text`
  color: #f4f4f4;
  font-size: 22px;
  font-family: 'RobotoSlab-Regular';
  line-height: 28px;
`;
export const UserName = styled.Text`
  color: #ff9000;
  font-size: 24px;
  font-family: 'RobotoSlab-Medium';
`;

export const ProfileButton = styled.TouchableOpacity``;

export const UserAvatar = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 28px;
`;

export const InstitutionContainer = styled.TouchableOpacity`
  background: #416e4b;
  border-radius: 10px;
  padding: 26px 24px;
  margin-bottom: 10px;
  flex-direction: row;
  align-items: center;
`;

export const InstitutionAvatar = styled.Image`
  width: 72px;
  height: 72px;
  border-radius: 36px;
`;

export const InstitutionInfo = styled.View`
  flex: 1;
  margin-left: 22px;
`;

export const InstitutionName = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
  color: #e2dcdc;
`;

export const InstitutionDetail = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
`;

export const InstitutionDetailText = styled.Text`
  margin-left: 8px;
  color: #d5ccb3;
`;

export const ListsTitle = styled.Text`
  margin-top: 24px;
  font-family: 'RobotoSlab-Medium';
  font-size: 24px;
  color: #e2dcdc;
  margin-bottom: 10px;
`;

export const InstitutionAdmin = styled.View`
  padding: 0 24px 0;
`;

export const InstitutionTitle = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 24px;
  color: #e2dcdc;
  margin-top: 24px;
  margin-bottom: 10px;
  padding: 0 24px 0;
`;

export const DrawView = styled.View`
  border-bottom-color: gray;
  border-bottom-width: 1px;
  margin: 0 24px 0;
  padding: 14px 0 8px;
`;

export const ContainerForm = styled.View`
  padding: 20px 24px;
  flex-direction: row;
  max-width: 82%;
`;

export const ButtonForm = styled(TouchableOpacity)`
  background: #fff;
  width: 56px;
  height: 56px;
  border-radius: 26px;
  margin-left: 10px;
  justify-content: center;
  align-items: center;
`;
