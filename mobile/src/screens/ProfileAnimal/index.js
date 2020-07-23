import React, { useCallback, useRef, useEffect, useState } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  Alert,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
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
  Header,
  HeaderText,
  HeaderAvatar,
  BackButton,
  Title,
  UserAvatarButton,
  UserAvatar,
  ProfileButton,
  InputDetail,
} from './styles';

const RegisterInstitution = () => {
  const route = useRoute();
  const { animalId } = route.params;

  const { user } = useAuth();
  const formRef = useRef();

  const detailInputRef = useRef();

  const [animal, setAnimal] = useState({});

  const [avatar, setAvatar] = useState();

  const { navigate, goBack } = useNavigation();

  useEffect(() => {
    api.get(`/animals-show/${animalId}`).then(response => {
      setAnimal(response.data);
    });
  }, [animalId]);

  const handleSignUp = useCallback(async () => {
    try {
      const allData = formRef.current.getData();

      if (!allData.name) {
        allData.name = animal.name;
      }
      if (!allData.detail) {
        allData.detail = animal.detail;
      }

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string()
          .required('Email Obrigatório')
          .email('Digite um e-mail válido'),
        street: Yup.string().required('Endereço obrigatório'),
        city: Yup.string().required('Cidade obrigatória'),
        state: Yup.string().required('Estado obrigatório'),
        detail: Yup.string().required('Detalhes obrigatório'),
      });

      await schema.validate(allData, {
        abortEarly: false,
      });

      await api.put('/institutions', allData);

      Alert.alert('Perfil atualizado com sucesso!');

      navigate('Animals');
    } catch (err) {
      Alert.alert(
        'Erro ao atualizar perfil.',
        'Cheque os dados e tente novamente',
      );
    }
  }, [navigate, animal]);

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
          name: `${animalId}.jpg`,
          uri: response.uri,
        });

        const image = await api.post('/files', data);

        await api.patch(`/animals/avatar/${image.data.id}`);
      },
    );
  }, [animalId]);

  const confirmDelete = id => {
    Alert.alert(
      'Excluir Administrador',
      'Deseja realmente excluir o administrador?',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: () => {},
        },
      ],
      { cancelable: false },
    );
  };

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
              goBack();
            }}
          >
            <Icon name="chevron-left" size={24} color="#999591" />
          </BackButton>

          <HeaderText>Voltar</HeaderText>

          <ProfileButton
            onPress={() => {
              navigate('ProfileUser');
            }}
          >
            <HeaderAvatar source={{ uri: user.avatar.url }} />
          </ProfileButton>
        </Header>

        <ScrollView keyboardShouldPersistTaps="handled">
          <Container>
            <UserAvatarButton onPress={handleUpdateAvatar}>
              {animal.avatar && (
                <UserAvatar
                  source={{ uri: avatar ? avatar.uri : animal.avatar.url }}
                />
              )}
            </UserAvatarButton>
            <View>
              <Title>Perfil do animal</Title>
            </View>
            <Form initialData={animal} onSubmit={handleSignUp} ref={formRef}>
              <Input
                name="name"
                icon="chevrons-right"
                placeholder="Nome"
                returnKeyType="next"
                autoCapitalize="words"
                onSubmitEditing={() => {
                  detailInputRef.current.focus();
                }}
              />

              <InputDetail
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
                Confirmar alterações
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default RegisterInstitution;
