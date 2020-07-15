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
  UserAvatarButton,
  UserAvatar,
} from './styles';

const ProfileUser = () => {
  const { user, signOut } = useAuth();
  const formRef = useRef();

  const emailInputRef = useRef();
  const oldPasswordInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  const navigation = useNavigation();

  const handleSignUp = useCallback(
    async data => {
      try {
        formRef.current.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required(),
          email: Yup.string().email().required(),
          oldPassword: Yup.string().min(6),
          password: Yup.string()
            .min(6)
            .when('oldPassword', (oldPassword, field) =>
              oldPassword ? field.required() : field,
            ),
          confirmPassword: Yup.string().when('password', (password, field) =>
            password ? field.required().oneOf([Yup.ref('password')]) : field,
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.put('/users', data);

        Alert.alert('Alterações realizadas com sucesso!');

        navigation.goBack();
      } catch (err) {
        Alert.alert(
          'Erro ao atualizar.',
          'Ocorreu um erro atualizar o cadastro, cheque os dados e tente novamente',
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
        <ScrollView keyboardShouldPersistTaps="handled">
          <Container>
            <BackButton
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Icon name="chevron-left" size={24} color="#e2dcdc" />
            </BackButton>
            <UserAvatarButton>
              <UserAvatar source={{ uri: user.avatar.url }} />
            </UserAvatarButton>
            <View>
              <Title>Meu perfil</Title>
            </View>
            <Form onSubmit={handleSignUp} ref={formRef}>
              <Input
                name="name"
                icon="user"
                placeholder="Digite seu Nome"
                returnKeyType="next"
                autoCapitalize="words"
                onSubmitEditing={() => {
                  emailInputRef.current.focus();
                }}
              />

              <Input
                ref={emailInputRef}
                name="email"
                icon="mail"
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="Digite seu e-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  oldPasswordInputRef.current.focus();
                }}
              />
              <Input
                ref={oldPasswordInputRef}
                name="oldPassword"
                icon="lock"
                secureTextEntry
                placeholder="Senha atual"
                textContentType="newPassword"
                onSubmitEditing={() => {
                  passwordInputRef.current.focus();
                }}
              />

              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                secureTextEntry
                placeholder="Nova senha"
                textContentType="newPassword"
                onSubmitEditing={() => {
                  confirmPasswordInputRef.current.focus();
                }}
              />

              <Input
                ref={confirmPasswordInputRef}
                name="confirmPassword"
                icon="lock"
                secureTextEntry
                placeholder="Confirmação nova senha"
                textContentType="newPassword"
                onSubmitEditing={() => {
                  formRef.current.submitForm();
                }}
              />

              <Button
                onPress={() => {
                  formRef.current.submitForm();
                }}
              >
                Confirmar alterações
              </Button>
            </Form>
            <Button
              onPress={() => {
                signOut();
              }}
            >
              Sair
            </Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default ProfileUser;
