import React, { useCallback, useRef } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  Alert,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../hooks/auth';

import api from '../../services/api';

import Button from '../../components/Button';
import Input from '../../components/Input';

import {
  Container,
  BackButton,
  Title,
  ProfileButton,
  UserAvatar,
  Header,
  HeaderText,
} from './styles';

const RegisterInstitution = () => {
  const { user } = useAuth();
  const formRef = useRef();

  const sexInputRef = useRef();
  const typeInputRef = useRef();
  const situationInputRef = useRef();
  const detailInputRef = useRef();

  const navigation = useNavigation();

  const handleSignUp = useCallback(
    async data => {
      try {
        formRef.current.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um email válido obrigatório'),
          type: Yup.string().required('Endereço obrigatório'),
          situation: Yup.string().required('Cidade obrigatória'),
          state: Yup.string().required('Estado obrigatório'),
          detail: Yup.string().required('Detalhes obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/institutions', data);

        Alert.alert('Cadastro da instituição realizado com sucesso!');

        navigation.navigate('ProfileInstitution');
      } catch (err) {
        Alert.alert(
          'Erro no cadastro',
          'Ocorreu um erro ao fazer o cadastro, cheque os dados e tente novamente',
        );
      }
    },
    [navigation],
  );

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <Header>
          <BackButton
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Icon name="chevron-left" size={24} color="#e2dcdc" />
          </BackButton>
          <HeaderText>Voltar</HeaderText>

          <ProfileButton
            onPress={() => {
              navigation.navigate('ProfileUser');
            }}
          >
            <UserAvatar source={{ uri: user.avatar.url }} />
          </ProfileButton>
        </Header>

        <ScrollView keyboardShouldPersistTaps="handled">
          <Container>
            <View>
              <Title>Cadastrar animal</Title>
            </View>

            <Form onSubmit={handleSignUp} ref={formRef}>
              <Input
                name="name"
                icon="chevrons-right"
                placeholder="Nome"
                returnKeyType="next"
                autoCapitalize="words"
                onSubmitEditing={() => {
                  sexInputRef.current.focus();
                }}
              />

              <Input
                ref={sexInputRef}
                name="sex"
                icon="chevrons-right"
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="Sexo"
                returnKeyType="next"
                onSubmitEditing={() => {
                  typeInputRef.current.focus();
                }}
              />

              <Input
                ref={typeInputRef}
                name="type"
                icon="chevrons-right"
                placeholder="Endereço"
                returnKeyType="next"
                autoCapitalize="words"
                onSubmitEditing={() => {
                  situationInputRef.current.focus();
                }}
              />

              <Input
                ref={situationInputRef}
                name="situation"
                icon="chevrons-right"
                placeholder="Cidade"
                returnKeyType="next"
                autoCapitalize="words"
                onSubmitEditing={() => {
                  detailInputRef.current.focus();
                }}
              />

              <Input
                ref={detailInputRef}
                name="detail"
                icon="chevrons-right"
                placeholder="Detalhes"
                onSubmitEditing={() => {
                  formRef.current.submitForm();
                }}
              />

              <Button
                onPress={() => {
                  formRef.current.submitForm();
                }}
              >
                Cadastrar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default RegisterInstitution;
