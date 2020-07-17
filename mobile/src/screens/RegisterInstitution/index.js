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
import ImagePicker from 'react-native-image-picker';
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
  const { user, updateUser } = useAuth();
  const formRef = useRef();

  const emailInputRef = useRef();
  const oldPasswordInputRef = useRef();

  const navigation = useNavigation();

  const handleSignUp = useCallback(
    async data => {
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('Email Obrigatório')
            .email('Digite um e-mail válido'),
          oldPassword: Yup.string(),
          password: Yup.string().when('oldPassword', {
            is: val => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),
          confirmPassword: Yup.string()
            .when('oldPassword', {
              is: val => !!val.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), null], 'Confirmação incorreta'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { name, email, oldPassword, password, confirmPassword } = data;

        const formData = {
          name,
          email,
          ...(oldPassword
            ? {
                oldPassword,
                password,
                confirmPassword,
              }
            : {}),
        };

        const response = await api.put('/users', formData);

        Alert.alert('Perfil atualizado com sucesso!');

        navigation.goBack();
      } catch (err) {
        Alert.alert(
          'Erro ao atualizar perfil.',
          'Cheque os dados e tente novamente',
        );
      }
    },
    [navigation],
  );

  const handleUpdateAvatar = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: 'Selecione um avatar',
        cancelButtonTitle: 'Cancelar',
        takePhotoButtonTitle: 'Usar camera',
        chooseFromLibraryButtonTitle: 'Escolher da galeria',
      },

      async response => {
        if (response.didCancel) {
          return;
        }

        if (response.error) {
          Alert.alert('Erro ao atualizar seu avatar.');
        }

        const image = await api.post('/files', data);

        await api.put(`/users/avatar/${image.data.id}`).then(res => {
          updateUser(res.data);
        });
      },
    );
  }, [user.id, updateUser]);

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
            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatar
                source={{
                  uri:
                    'http://192.168.0.8:3333/files/ec73c9c647aad4e568e261f064af8669.png',
                }}
              />
            </UserAvatarButton>
            <View>
              <Title>Perfil da Instituição</Title>
            </View>
            <Form onSubmit={handleSignUp} ref={formRef}>
              <Input
                name="name"
                icon="user"
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
                icon="mail"
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  oldPasswordInputRef.current.focus();
                }}
              />

              <Input
                name="name"
                icon="user"
                placeholder="Endereço"
                returnKeyType="next"
                autoCapitalize="words"
                onSubmitEditing={() => {
                  emailInputRef.current.focus();
                }}
              />

              <Input
                name="name"
                icon="user"
                placeholder="Cidade"
                returnKeyType="next"
                autoCapitalize="words"
                onSubmitEditing={() => {
                  emailInputRef.current.focus();
                }}
              />

              <Input
                name="name"
                icon="user"
                placeholder="Estado"
                returnKeyType="next"
                autoCapitalize="words"
                onSubmitEditing={() => {
                  emailInputRef.current.focus();
                }}
              />

              <Input
                name="name"
                icon="user"
                placeholder="Detalhes"
                returnKeyType="next"
                autoCapitalize="words"
                onSubmitEditing={() => {
                  emailInputRef.current.focus();
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

            <Button
              onPress={() => {
                navigation.goBack();
              }}
            >
              Voltar
            </Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default ProfileUser;
