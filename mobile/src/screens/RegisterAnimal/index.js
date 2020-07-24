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
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../hooks/auth';

import api from '../../services/api';

import Button from '../../components/Button';
import Input from '../../components/Input';
import Checkbox from '../../components/Checkbox';

import {
  Container,
  BackButton,
  Title,
  ProfileButton,
  UserAvatar,
  Header,
  HeaderText,
  CheckboxText,
} from './styles';

const RegisterAnimal = () => {
  const { user } = useAuth();
  const formRef = useRef();

  const sexInputRef = useRef();
  const detailInputRef = useRef();

  const { navigate, goBack } = useNavigation();

  const checkboxOptions1 = [
    { value: 'Cão', label: 'Cão' },
    { value: 'Gato', label: 'Gato' },
  ];

  const checkboxOptions2 = [
    { value: 'Macho', label: 'Macho' },
    { value: 'Fêmea', label: 'Fêmea' },
  ];

  const checkboxOptions3 = [
    { value: 'true', label: 'Disponível para adoção' },
    { value: 'false', label: 'Em tratamento' },
  ];

  const handleSubmit = useCallback(
    async data => {
      try {
        formRef.current.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          sex: Yup.array().required('Sexo obrigatório'),
          type: Yup.array().required('Espécie obrigatório'),
          detail: Yup.string().required('Detalhes obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const response = await api.post('/animals', data);

        const { id } = response.data;
        const animalId = id;
        Alert.alert('Cadastro do animal realizado com sucesso!');

        navigate('AvatarAnimal', { animalId });
      } catch (err) {
        Alert.alert(
          'Erro no cadastro',
          'Ocorreu um erro ao fazer o cadastro, cheque os dados e tente novamente',
        );
      }
    },
    [navigate],
  );

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
            <Icon name="chevron-left" size={24} color="#e2dcdc" />
          </BackButton>
          <HeaderText>Voltar</HeaderText>

          <ProfileButton
            onPress={() => {
              navigate('ProfileUser');
            }}
          >
            <UserAvatar source={{ uri: user.avatar.url }} />
          </ProfileButton>
        </Header>

        <ScrollView style={{ flex: 1 }}>
          <Container>
            <View>
              <Title>Cadastrar animal</Title>
            </View>

            <Form onSubmit={handleSubmit} ref={formRef}>
              <CheckboxText>Espécie:</CheckboxText>
              <View style={{ flexDirection: 'row' }}>
                <Checkbox name="type" options={checkboxOptions1} />
              </View>

              <CheckboxText>Sexo:</CheckboxText>
              <View style={{ flexDirection: 'row' }}>
                <Checkbox name="sex" options={checkboxOptions2} />
              </View>

              <CheckboxText>Status do animal:</CheckboxText>
              <View style={{ flexDirection: 'row', marginBottom: 18 }}>
                <Checkbox name="available" options={checkboxOptions3} />
              </View>

              <Input
                name="name"
                icon="chevrons-right"
                placeholder="Nome"
                returnKeyType="next"
                autoCapitalize="words"
                onSubmitEditing={() => {
                  sexInputRef.current.focus();
                }}
              />

              <Input
                name="photos"
                icon="chevrons-right"
                placeholder="Link para fotos do animal"
                returnKeyType="next"
                onSubmitEditing={() => {
                  sexInputRef.current.focus();
                }}
              />

              <Input
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
                Cadastrar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default RegisterAnimal;
