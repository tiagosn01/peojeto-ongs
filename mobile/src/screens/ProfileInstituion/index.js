import React, { useCallback, useRef, useEffect, useState } from 'react';
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
  Header,
  HeaderText,
  HeaderAvatar,
  BackButton,
  Title,
  UserAvatarButton,
  UserAvatar,
  ProfileButton,
  InputDetail,
  AdminAvatar,
  AdminContainer,
  AdminName,
  AdminDetail,
  AdminDetailText,
  AdminInfo,
  DrawView,
} from './styles';

const RegisterInstitution = () => {
  const { user } = useAuth();
  const formRef = useRef();
  const formRefAdmin = useRef();

  const emailInputRef = useRef();
  const oldPasswordInputRef = useRef();
  const streetInputRef = useRef();
  const cityInputRef = useRef();
  const stateInputRef = useRef();
  const detailInputRef = useRef();

  const adminEmailInputRef = useRef();

  const [institution, setInstitution] = useState({});
  const [admins, setAdmins] = useState([]);
  const [listAdmins, setListAdmins] = useState(10);
  const [avatar, setAvatar] = useState();

  const { navigate, goBack } = useNavigation();

  useEffect(() => {
    api.get('/institutions-admin').then(response => {
      setInstitution(response.data.institution);
    });
  }, []);

  useEffect(() => {
    api.get('/admins').then(response => {
      setAdmins(response.data);
    });
  }, [listAdmins]);

  const handleSignUp = useCallback(async () => {
    try {
      const allData = formRef.current.getData();

      if (!allData.name) {
        allData.name = institution.name;
      }
      if (!allData.email) {
        allData.email = institution.email;
      }
      if (!allData.street) {
        allData.street = institution.street;
      }
      if (!allData.city) {
        allData.city = institution.city;
      }
      if (!allData.state) {
        allData.state = institution.state;
      }
      if (!allData.detail) {
        allData.detail = institution.detail;
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

      Alert.alert('Perfil da instituição atualizado com sucesso!');

      navigate('Dashboard');
    } catch (err) {
      Alert.alert(
        'Erro ao atualizar perfil.',
        'Cheque os dados e tente novamente',
      );
    }
  }, [navigate, institution]);

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
          name: `${institution.id}.jpg`,
          uri: response.uri,
        });

        const image = await api.post('/files', data);

        await api.patch(`/institutions/avatar/${image.data.id}`);
      },
    );
  }, [institution.id]);

  const handleUpdateAdmin = useCallback(
    async data => {
      try {
        await api.post('/admins', data);
        setListAdmins(listAdmins + 1);

        formRefAdmin.current.reset();

        return Alert.alert('Admin cadastrado com sucesso!');
      } catch (err) {
        return Alert.alert('Erro!', 'Usuário ja cadastrado ou inexistente.');
      }
    },
    [listAdmins],
  );

  const handleDeleteAdmin = useCallback(
    async adminId => {
      try {
        await api.delete(`/admins/${adminId}`);

        return setListAdmins(listAdmins - 1);
      } catch (err) {
        return Alert.alert('Erro!', 'Erro ao deletar usuário cheque os dados.');
      }
    },
    [listAdmins],
  );

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
          onPress: () => handleDeleteAdmin(id),
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
              {institution.avatar && (
                <UserAvatar
                  source={{ uri: avatar ? avatar.uri : institution.avatar.url }}
                />
              )}
            </UserAvatarButton>
            <View>
              <Title>Perfil da Instituição</Title>
            </View>
            <Form
              initialData={institution}
              onSubmit={handleSignUp}
              ref={formRef}
            >
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
                  oldPasswordInputRef.current.focus();
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

            <DrawView />

            <Title style={{ marginTop: 50 }}>Administradores</Title>

            {admins &&
              admins.map(admin => (
                <AdminContainer
                  onPress={() => {
                    confirmDelete(admin.id);
                  }}
                  key={admin.id}
                >
                  <AdminAvatar source={{ uri: admin.user.avatar.url }} />
                  <AdminInfo>
                    <AdminName>{admin.user.name}</AdminName>
                    <AdminDetail>
                      <Icon name="mail" size={14} color="#ff9000" />
                      <AdminDetailText>{admin.email}</AdminDetailText>
                    </AdminDetail>
                  </AdminInfo>
                </AdminContainer>
              ))}
            <Form onSubmit={handleUpdateAdmin} ref={formRefAdmin}>
              <Input
                name="email"
                icon="mail"
                ref={adminEmailInputRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="E-mail do novo administrador"
                returnKeyType="next"
                onSubmitEditing={() => {
                  formRefAdmin.current.submitForm();
                }}
              />
              <Button
                onPress={() => {
                  formRefAdmin.current.submitForm();
                }}
                style={{ backgroundColor: '#8D968F' }}
              >
                + Adicionar administrador
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default RegisterInstitution;
