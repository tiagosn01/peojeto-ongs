import styled, { css } from 'styled-components/native';
import Platform from 'react-native';

export const Container = styled.View`
  flex: 1;
  padding: 0 28px ${Platform.OS === 'android' ? 130 : 40}px;
`;

export const BackButton = styled.TouchableOpacity`
  margin-top: 32px;
`;

export const Title = styled.Text`
  font-size: 24px;
  color: #fff;
  font-family: 'RobotoSlab-Medium';
  margin: 54px 0 24px;
`;

export const AnimalAvatar = styled.Image`
  width: 72px;
  height: 72px;
  border-radius: 36px;
`;

export const AnimalInfo = styled.View`
  margin-left: 22px;
`;

export const AnimalDetail = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ListsTitle = styled.Text`
  margin-top: 24px;
  font-family: 'RobotoSlab-Medium';
  font-size: 24px;
  color: #e2dcdc;
  margin-bottom: 10px;
`;

export const AnimalItem = styled.View``;

export const AnimalTitle = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 24px;
  color: #e2dcdc;
  margin-top: 24px;
  margin-bottom: 10px;
  padding: 0 24px 0;
`;

export const AnimalContainer = styled.TouchableOpacity`
  background: #416e4b;
  border-radius: 10px;
  padding: 18px 16px;
  margin-bottom: 10px;
  flex-direction: row;
  align-items: center;
  ${props =>
    props.isSelect &&
    css`
      background: #ff9900;
    `}
`;

export const AnimalName = styled.Text`
  font-family: 'RobotoSlab-Medium';
  margin-left: 16px;
  margin-bottom: 2px;
  font-size: 18px;
  color: #e2dcdc;
`;

export const AnimalDetailText = styled.Text`
  margin: 0 16px;
  color: #d5ccb3;
`;

export const DrawView = styled.View`
  border-bottom-color: gray;
  border-bottom-width: 1px;
  margin: 10px 24px 0;
  padding: 14px 0 8px;
`;

export const ContainerButton = styled.View`
  padding: 10px 24px;
`;

export const DrawVertical = styled.View`
  border-left-color: gray;
  border-left-width: 1px;
  width: 2px;
  height: 70px;
`;
