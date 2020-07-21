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
  const passwordInputRef = useRef();

  const navigation = useNavigation();
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

  const handleSignUp = useCallback(
    async data => {
      try {
        formRef.current.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um email válido obrigatório'),
          password: Yup.string().min(6, 'No mínimo 6 digitos.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        Alert.alert(
          'Cadastro realizado com sucesso! Você ja pode fazer login na aplicação.',
        );

        navigation.goBack();
      } catch (err) {
        Alert.alert(
          'Erro no cadastro',
          'Ocorreu um erro ao fazer o cadastro, cheque os dados e tente novamente',
        );
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
        <ScrollView style={{ flex: 1 }}>
          <Container>
            <BackButton
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Icon name="chevron-left" size={24} color="#e2dcdc" />
            </BackButton>

            <Title>Escolha o animal</Title>
            <ScrollView
              style={{ maxHeight: 400 }}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              {selectedAnimal.name ? (
                <AnimalItem key={selectedAnimal.id}>
                  <AnimalContainer onPress={() => handleSelectAnimal()}>
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
                animals.map(animal => (
                  <AnimalItem key={animal.id}>
                    <AnimalContainer onPress={() => handleSelectAnimal(animal)}>
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
                ))
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
                  passwordInputRef.current.focus();
                }}
              />
              <Input
                name="cpf"
                icon="user"
                placeholder="CPF (opcional)"
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
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default RegisterAdoption;
