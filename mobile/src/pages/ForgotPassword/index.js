import React, { useCallback, useRef } from 'react';

import {
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  Alert,
} from 'react-native';

import { Form } from '@unform/mobile';
import * as Yup from 'yup';

import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import logoImg from '../../assets/logo.png';

import Button from '../../components/Button';
import Input from '../../components/Input';

import { Container, Title, BackToSignIn, BackToSignInText } from './styles';
import api from '../../services/api';

const ForgotPassword = () => {
  const formRef = useRef();
  const navigation = useNavigation();

  const handlePassword = useCallback(
    async data => {
      try {
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um email válido obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.put('/forgot-password', {
          email: data.email,
        });

        Alert.alert('Atençao!!', 'Foi envaido um email com a sua nova senha.');

        navigation.goBack();
      } catch (err) {
        Alert.alert('Erro na autenticação', 'Email inválido');
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
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <Image source={logoImg} />
            <View>
              <Title>Digite seu Email</Title>
            </View>

            <Form onSubmit={handlePassword} ref={formRef}>
              <Input
                name="email"
                icon="mail"
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="Digite seu e-mail"
              />

              <Button
                onPress={() => {
                  formRef.current.submitForm();
                }}
              >
                Recuperar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignIn onPress={() => navigation.goBack()}>
        <Icon name="log-in" size={20} color="#fff" />
        <BackToSignInText>Voltar para login</BackToSignInText>
      </BackToSignIn>
    </>
  );
};

export default ForgotPassword;
