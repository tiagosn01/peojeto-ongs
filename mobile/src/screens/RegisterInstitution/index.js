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

  const emailInputRef = useRef();
  const streetInputRef = useRef();
  const cityInputRef = useRef();
  const stateInputRef = useRef();
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
          street: Yup.string().required('Endereço obrigatório'),
          city: Yup.string().required('Cidade obrigatória'),
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
              <Title>Criar perfil da instituição</Title>
            </View>

            <Form onSubmit={handleSignUp} ref={formRef}>
              <Input
                name="name"
                icon="chevrons-right"
                placeholder="Nome"
                returnKeyType="next"
                autoCapitalize="words"
                onSubmitEditing={() => {
                  emailInputRef.current.focus();
                }}
              />

              <Input
                ref={emailInputRef}
                name="email"
                icon="chevrons-right"
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  streetInputRef.current.focus();
                }}
              />

              <Input
                ref={streetInputRef}
                name="street"
                icon="chevrons-right"
                placeholder="Endereço"
                returnKeyType="next"
                autoCapitalize="words"
                onSubmitEditing={() => {
                  cityInputRef.current.focus();
                }}
              />

              <Input
                ref={cityInputRef}
                name="city"
                icon="chevrons-right"
                placeholder="Cidade"
                returnKeyType="next"
                autoCapitalize="words"
                onSubmitEditing={() => {
                  stateInputRef.current.focus();
                }}
              />

              <Input
                ref={stateInputRef}
                name="state"
                icon="chevrons-right"
                placeholder="Estado"
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
