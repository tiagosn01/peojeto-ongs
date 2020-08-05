import React, { useCallback, useRef, useEffect, useState } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  Alert,
  Linking,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import * as Yup from 'yup';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../hooks/auth';

import api from '../../services/api';

import Checkbox from '../../components/Checkbox';
import Button from '../../components/Button';
import Input from '../../components/Input';
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
  InputDetail,
  CheckboxText,
} from './styles';

const ProfileAnimal = () => {
  const route = useRoute();
  const { animalId } = route.params;

  const { user } = useAuth();
  const formRef = useRef();

  const photosInputRef = useRef();
  const detailInputRef = useRef();

  const [animal, setAnimal] = useState({});
  const [animalSituation, setAnimalSituation] = useState(false);
  const [admin, setAdmin] = useState({});

  const [avatar, setAvatar] = useState();

  const { navigate, goBack } = useNavigation();

  const checkboxOptions = [
    { value: 'true', label: 'Disponível para adoção' },
    { value: 'false', label: 'Em tratamento' },
  ];

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

  const handleSubmit = useCallback(async () => {
    try {
      const allData = formRef.current.getData();

      if (!allData.name) {
        allData.name = animal.name;
      }
      if (!allData.photos) {
        allData.photos = animal.photos;
      }
      if (!allData.detail) {
        allData.detail = animal.detail;
      }

      const schema = Yup.object().shape({
        available: Yup.string(),
        name: Yup.string(),
        photos: Yup.string(),
        detail: Yup.string(),
      });

      await schema.validate(allData, {
        abortEarly: false,
      });

      await api.put(`/animals/${animalId}`, allData);

      Alert.alert('Perfil atualizado com sucesso!');

      navigate('Animals');
    } catch (err) {
      Alert.alert(
        'Erro ao atualizar perfil.',
        'Cheque os dados e tente novamente',
      );
    }
  }, [navigate, animal, animalId]);

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

        await api.patch(`/animals/avatar/${image.data.id}`, { animalId });
      },
    );
  }, [animalId]);

  const handleDeleteAnimal = useCallback(
    async id => {
      try {
        await api.delete(`/animals/${id}`);

        Alert.alert('Registro de animal deletado com sucesso!');
        return navigate('Animals');
      } catch (err) {
        return Alert.alert('Erro!', 'Erro ao deletar usuário cheque os dados.');
      }
    },
    [navigate],
  );

  const confirmDelete = id => {
    Alert.alert(
      'Excluir Animal',
      'Deseja realmente excluir o registro do animal?',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: () => {
            handleDeleteAnimal(id);
          },
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
          {admin.email ? (
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

              <Form initialData={animal} onSubmit={handleSubmit} ref={formRef}>
                <CheckboxText>Status do animal:</CheckboxText>
                <View style={{ flexDirection: 'row', marginBottom: 18 }}>
                  <Checkbox
                    name="available"
                    options={checkboxOptions}
                    defaultValue=""
                  />
                </View>

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

                <Input
                  name="photos"
                  icon="chevrons-right"
                  placeholder="Link das fotos do aniaml"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    photosInputRef.current.focus();
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

              <Button
                onPress={() => {
                  confirmDelete(animalId);
                }}
              >
                Apagar animal
              </Button>
            </Container>
          ) : (
            <Container>
              <UserAvatarButton>
                {animal.avatar && (
                  <UserAvatar
                    source={{ uri: avatar ? avatar.uri : animal.avatar.url }}
                  />
                )}
              </UserAvatarButton>

              <View>
                <Title>{animal.name}</Title>
              </View>

              <View>
                <CheckboxText>Status do animal:</CheckboxText>

                <TextView icon="chevrons-right">
                  {animalSituation === true
                    ? 'Disponível para adoção'
                    : 'Em tratamento'}
                </TextView>

                {animal.photos ? (
                  <TextView
                    icon="chevrons-right"
                    onPress={() => Linking.openURL(animal.photos)}
                  >
                    Fotos
                  </TextView>
                ) : (
                  <TextView icon="chevrons-right">
                    Sem fotos para exibir
                  </TextView>
                )}

                <TextView icon="chevrons-right">{animal.detail}</TextView>
              </View>
            </Container>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default ProfileAnimal;
