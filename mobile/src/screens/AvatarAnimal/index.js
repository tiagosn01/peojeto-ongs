import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  Alert,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

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
  const route = useRoute();
  const { animalId } = route.params;

  const { user } = useAuth();

  const [animal, setAnimal] = useState({});

  const [avatar, setAvatar] = useState();

  const { navigate } = useNavigation();

  useEffect(() => {
    async function loadProfileAnimal() {
      const response = await api.get(`/animals-show/${animalId}`);

      setAnimal(response.data);
    }

    loadProfileAnimal();
  }, [animalId]);

  const handleUpdateAvatar = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: 'Selecione um avatar',
        cancelButtonTitle: 'Cancelar',
        takePhotoButtonTitle: 'Usar camera',
        chooseFromLibraryButtonTitle: 'Escolher da galeria',
        rotation: 360,
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

        await api.patch(`/animals/avatar/${image.data.id}`, { animalId });
      },
    );
  }, [animalId]);

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
              {animal.avatar && (
                <UserAvatar
                  source={{ uri: avatar ? avatar.uri : animal.avatar.url }}
                />
              )}
            </UserAvatarButton>

            <View>
              <Title>Foto de perfil do animal</Title>
            </View>

            <Button
              onPress={() => {
                navigate('Animals');
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
