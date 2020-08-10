import styled from 'styled-components/native';
import Platform from 'react-native';
import {
  getBottomSpace,
  getStatusBarHeight,
} from 'react-native-iphone-x-helper';
import Input from '../../components/Input';

export const Container = styled.View`
  flex: 1;

  padding: 0 30px ${Platform.OS === 'android' ? 130 : 40}px;
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
  color: #e2dcdc;
  font-size: 22px;
  font-family: 'RobotoSlab-Regular';
  margin-left: 16px;
`;

export const HeaderAvatar = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  align-self: center;
`;

export const ProfileButton = styled.TouchableOpacity`
  margin-left: auto;
`;
export const BackButton = styled.TouchableOpacity``;

export const Form = styled.View``;

export const Title = styled.Text`
  font-size: 24px;
  color: #fff;
  font-family: 'RobotoSlab-Medium';
  margin: 54px 0 24px;
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

export const UserAvatarButton = styled.TouchableOpacity`
  align-self: center;
`;

export const UserAvatar = styled.Image`
  margin-top: 32px;
  width: 186px;
  height: 186px;
  border-radius: 98px;
`;

export const InputDetail = styled(Input)`
  height: 100px;
`;

export const AdminAvatar = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 28px;
`;

export const AdminContainer = styled.TouchableOpacity`
  background: #416e4b;
  border-radius: 10px;
  padding: 12px 10px;
  margin-bottom: 10px;
  flex-direction: row;
  align-items: center;
`;

export const AdminInfo = styled.View`
  margin-left: 22px;
`;

export const AdminName = styled.Text`
  font-family: 'RobotoSlab-Medium';

  font-size: 18px;
  color: #e2dcdc;
`;

export const AdminDetail = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const AdminDetailText = styled.Text`
  margin-left: 6px;
  color: #d5ccb3;
`;

export const DrawView = styled.View`
  border-bottom-color: gray;
  border-bottom-width: 1px;
  margin: 24px 24px 0px;
  padding: 14px 0 8px;
`;

export const CheckboxText = styled.Text`
  font-family: 'RobotoSlab-Regular';
  font-size: 20px;
  color: #e2dcdc;
  margin-top: 14px;
  margin-bottom: 10px;
`;
