import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  Alert,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../hooks/auth';

import api from '../../services/api';

import Button from '../../components/Button';

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
} from './styles';

const AvatarAnimal = () => {
  const { user } = useAuth();

  const [institution, setInstitution] = useState({});

  const [avatar, setAvatar] = useState();

  const { navigate } = useNavigation();

  useEffect(() => {
    async function loadProfileInstitution() {
      const response = await api.get('/institutions-admin');

      setInstitution(response.data.institution);
    }

    loadProfileInstitution();
  }, []);

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
          Alert.alert('Erro ao atualizar o avatar.');
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

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <Header>
          <BackButton>
            <Icon name="chevron-left" size={24} color="#999591" />
          </BackButton>

          <HeaderText>Voltar</HeaderText>

          <ProfileButton>
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
              <Title>Foto de perfil da instituição</Title>
            </View>

            <Button
              onPress={() => {
                navigate('Dashboard');
              }}
            >
              Continuar
            </Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default AvatarAnimal;
