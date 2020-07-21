import React, { useCallback, useRef, useState, useEffect } from 'react';
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
  DrawView,
} from './styles';

const ProfileUser = () => {
  const { user, updateUser, signOut } = useAuth();
  const formRef = useRef();

  const emailInputRef = useRef();
  const oldPasswordInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  const [institution, setInstitution] = useState();
  const [avatar, setAvatar] = useState();

  const navigation = useNavigation();

  useEffect(() => {
    api.get('/institution-owner').then(response => {
      setInstitution(response.data);
    });
  }, []);

  const handleSignUp = useCallback(async () => {
    try {
      const allData = formRef.current.getData();

      if (!allData.name) {
        allData.name = user.name;
      }
      if (!allData.email) {
        allData.email = user.email;
      }

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

      await schema.validate(allData, {
        abortEarly: false,
      });

      const { name, email, oldPassword, password, confirmPassword } = allData;

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

      updateUser(response.data);

      Alert.alert('Perfil atualizado com sucesso!');

      navigation.goBack();
    } catch (err) {
      Alert.alert(
        'Erro ao atualizar perfil.',
        'Cheque os dados e tente novamente',
      );
    }
  }, [navigation, user, updateUser]);

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
        setAvatar(response);
        const data = new FormData();

        data.append('file', {
          type: 'image/jpeg',
          name: `${user.id}.jpg`,
          uri: response.uri,
        });

        const image = await api.post('/files', data);

        await api.patch(`/users/avatar/${image.data.id}`).then(res => {
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
                source={{ uri: avatar ? avatar.uri : user.avatar.url }}
              />
            </UserAvatarButton>
            <View>
              <Title>Meu perfil</Title>
            </View>
            <Form initialData={user} onSubmit={handleSignUp} ref={formRef}>
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
                returnKeyType="next"
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
                returnKeyType="next"
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
            <DrawView />

            {institution ? (
              <Button
                onPress={() => {
                  navigation.navigate('ProfileInstitution');
                }}
              >
                Editar perfil da instituição
              </Button>
            ) : (
              <Button
                onPress={() => {
                  navigation.navigate('RegisterInstitution');
                }}
              >
                Criar instituição
              </Button>
            )}

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
