import styled from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
  padding: 0 16px;
  height: 60px;
  background: #1c3b2d;
  border-radius: 10px;
  margin-bottom: 8px;

  flex-direction: row;
  align-items: center;
`;

export const TextInput = styled.TextInput.attrs({
  placeholderTextColor: 'rgba(255, 255, 255, 0.3)',
})`
  flex: 1;
  font-size: 16px;
  margin-left: 10px;
  color: #fff;
  font-family: 'RobotoSlab-Regular';
`;
