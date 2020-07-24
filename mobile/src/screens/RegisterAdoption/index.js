import React, { useCallback, useRef, useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import { Form } from '@unform/mobile';
import * as Yup from 'yup';

import Icon from 'react-native-vector-icons/Feather';
import api from '../../services/api';

import Button from '../../components/Button';
import Input from '../../components/Input';

import {
  Container,
  BackButton,
  Title,
  AnimalItem,
  AnimalContainer,
  AnimalInfo,
  AnimalName,
  AnimalAvatar,
  AnimalDetail,
  AnimalDetailText,
  DrawView,
  DrawVertical,
} from './styles';

const RegisterAdoption = () => {
  const route = useRoute();
  const { institutionId } = route.params;

  const formRef = useRef();

  const emailInputRef = useRef();
  const cpfInputRef = useRef();

  const { goBack, navigate } = useNavigation();
  const [animals, setAnimals] = useState([]);

  const [selectedAnimal, setSelectedAnimal] = useState({});

  useEffect(() => {
    api.get(`/animals/${institutionId}`).then(response => {
      setAnimals(response.data);
    });
  }, [institutionId]);

  const handleResetSelect = () => {
    setSelectedAnimal({});
  };

  const handleSelectAnimal = animal => {
    setSelectedAnimal(animal);
  };

  const navigateToAnimals = useCallback(
    animalId => {
      navigate('Animals', { animalId });
    },
    [navigate],
  );

  const handleSignUp = useCallback(
    async data => {
      try {
        formRef.current.setErrors({});

        setSelectedAnimal(selectedAnimal);

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string().required('E-mail obrigatório'),
          cpf: Yup.string().min(2, 'No mínimo 6 digitos.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post(`/adoptions/${selectedAnimal.id}`, data);

        Alert.alert('Adoção cadastrada com sucesso.');

        navigateToAnimals(selectedAnimal.id);
      } catch (err) {
        Alert.alert('Erro no cadastro', 'Cheque os dados e tente novamente');
      }
    },
    [selectedAnimal, navigateToAnimals],
  );

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView style={{ flex: 1 }}>
          <Container>
            <BackButton
              onPress={() => {
                goBack();
              }}
            >
              <Icon name="chevron-left" size={24} color="#e2dcdc" />
            </BackButton>

            <Title>Escolha o animal</Title>
            <ScrollView style={{ maxHeight: 400 }} nestedScrollEnabled>
              {selectedAnimal.name ? (
                <AnimalItem key={selectedAnimal.id}>
                  <AnimalContainer>
                    <AnimalAvatar source={{ uri: selectedAnimal.avatar.url }} />

                    <AnimalInfo>
                      <AnimalName>{selectedAnimal.name}</AnimalName>

                      <AnimalDetail>
                        <DrawVertical />
                        <AnimalDetailText>
                          {selectedAnimal.type} {'\n'}
                          {selectedAnimal.sex} {'\n'}
                          {selectedAnimal.detail}
                        </AnimalDetailText>
                      </AnimalDetail>
                    </AnimalInfo>
                  </AnimalContainer>
                </AnimalItem>
              ) : (
                animals &&
                animals.map(animal =>
                  animal.available ? (
                    <AnimalItem key={animal.id}>
                      <AnimalContainer
                        onPress={() => handleSelectAnimal(animal)}
                      >
                        <AnimalAvatar source={{ uri: animal.avatar.url }} />

                        <AnimalInfo>
                          <AnimalName>{animal.name}</AnimalName>

                          <AnimalDetail>
                            <DrawVertical />
                            <AnimalDetailText>
                              {animal.type} {'\n'}
                              {animal.sex} {'\n'}
                              {animal.detail}
                            </AnimalDetailText>
                          </AnimalDetail>
                        </AnimalInfo>
                      </AnimalContainer>
                    </AnimalItem>
                  ) : null,
                )
              )}
            </ScrollView>
            <Button
              onPress={() => {
                handleResetSelect();
              }}
            >
              Escolher outro
            </Button>

            <DrawView />

            <Form onSubmit={handleSignUp} ref={formRef}>
              <Title>Dados do responsável</Title>

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
                  cpfInputRef.current.focus();
                }}
              />
              <Input
                ref={cpfInputRef}
                name="cpf"
                icon="user"
                placeholder="CPF (opcional)"
                autoCapitalize="words"
                onSubmitEditing={() => {
                  formRef.current.submitForm();
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
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default RegisterAdoption;
