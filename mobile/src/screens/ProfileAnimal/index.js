import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  Linking,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../hooks/auth';

import api from '../../services/api';

import Button from '../../components/Button';
import TextView from '../../components/TextView';

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
  ViewDetail,
  CheckboxText,
} from './styles';

const ProfileAnimal = () => {
  const route = useRoute();
  const { animalId } = route.params;

  const { user } = useAuth();

  const [animal, setAnimal] = useState({});
  const [animalSituation, setAnimalSituation] = useState(false);
  const [admin, setAdmin] = useState({});

  const { navigate, goBack } = useNavigation();

  useEffect(() => {
    async function loadProfileAnimal() {
      const response = await api.get(`/animals-show/${animalId}`);

      setAnimalSituation(response.data.available);

      response.data.available = '';
      setAnimal(response.data);
    }

    loadProfileAnimal();
  }, [animalId]);

  useEffect(() => {
    if (animal.institution_id) {
      api.get(`/isadmins/${animal.institution_id}`).then(response => {
        setAdmin(response.data);
      });
    }
  }, [animal.institution_id]);

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
            <UserAvatarButton>
              {animal.avatar && (
                <UserAvatar source={{ uri: animal.avatar.url }} />
              )}
            </UserAvatarButton>

            <View>
              <Title>{animal.name}</Title>
            </View>

            <ViewDetail>
              <CheckboxText>Status do animal:</CheckboxText>

              <TextView icon="info">
                {animalSituation === true
                  ? 'Disponível para adoção'
                  : 'Em tratamento'}
              </TextView>

              <CheckboxText>Fotos:</CheckboxText>
              {animal.photos ? (
                <TextView
                  icon="link"
                  onPress={() => Linking.openURL(animal.photos)}
                >
                  Clique aqui para ver a fotos
                </TextView>
              ) : (
                <TextView icon="chevrons-right">Sem fotos para exibir</TextView>
              )}
              <CheckboxText>Detalhes:</CheckboxText>
              <TextView icon="align-left">{animal.detail}</TextView>
            </ViewDetail>

            {admin.email && (
              <Button
                style={{ marginTop: 15 }}
                onPress={() => {
                  navigate('EditAnimal', { animalId });
                }}
              >
                Editar perfil
              </Button>
            )}
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default ProfileAnimal;
