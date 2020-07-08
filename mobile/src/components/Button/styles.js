import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';

export const Container = styled(TouchableOpacity)`
  max-width: 100%;
  height: 60px;
  background: #ff9000;
  border-radius: 10px;
  margin-top: 10px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
  color: #282828;
`;
