/* eslint-disable react/jsx-indent */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Alert, ScrollView, RefreshControl } from 'react-native';

import { useRoute, useNavigation } from '@react-navigation/native';
import { format, parseISO } from 'date-fns';
import { Form } from '@unform/mobile';

import Icon from 'react-native-vector-icons/Feather';
import Input from '../../components/Input';
import api from '../../services/api';

import {
  Container,
  ContainerForm,
  ButtonForm,
  ContainerAdoptions,
  BackButton,
  Title,
  TextTitle,
  Text,
  AdoptionDetail,
  DeleteButton,
} from './styles';

const Adoptions = () => {
  const route = useRoute();
  const { institutionId } = route.params;

  const formRef = useRef();

  const [search, setSearch] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const { goBack, navigate } = useNavigation();

  const [adoptions, setAdoptions] = useState([]);

  const onRefresh = useCallback(() => {
    setRefresh(true);

    setTimeout(() => {
      api.get(`/adoptions/${institutionId}`).then(response => {
        setAdoptions(response.data);
        setSearch('');
      });
    }, 1000);
    setRefresh(false);
  }, [institutionId]);

  useEffect(() => {
    api.get(`/adoptions/${institutionId}`).then(response => {
      setAdoptions(response.data);
      setSearch('');
    });
  }, [institutionId]);

  const handleSearch = useCallback(
    async data => {
      try {
        const response = await api.post(
          `/adoption-search/${institutionId}`,
          data,
        );

        if (response.data !== '') {
          setSearch(response.data);
        }
      } catch (err) {
        Alert.alert('Erro na busca', 'Nenhuma adoção encontrada');
        throw new Error('Nenhum resultado encontrado.');
      }
    },
    [institutionId],
  );

  const handleDeleteAdoption = useCallback(
    async id => {
      try {
        await api.delete(`/adoptions/${id}`);

        Alert.alert('Registro de adoção deletado com sucesso!');
        return navigate('Animals');
      } catch (err) {
        return Alert.alert(
          'Erro!',
          'Erro ao deletar registro cheque os dados.',
        );
      }
    },
    [navigate],
  );

  const confirmDelete = id => {
    Alert.alert(
      'Excluir Adoção',
      'O animal voltara para a lista de disponíveis, deseja realmente cancelar a adoção?',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: () => {
            handleDeleteAdoption(id);
          },
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <Container>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
      >
        <BackButton
          onPress={() => {
            goBack();
          }}
        >
          <Icon name="chevron-left" size={24} color="#e2dcdc" />
        </BackButton>

        <Title>Consulta de adoções</Title>

        <Form onSubmit={handleSearch} ref={formRef}>
          <ContainerForm>
            <Input
              icon="chevrons-right"
              name="rg"
              placeholder="Consultar pelo RG"
            />
            <ButtonForm
              onPress={() => {
                formRef.current.submitForm();
              }}
            >
              <Icon name="search" size={18} color="#ff9000" />
            </ButtonForm>
          </ContainerForm>
        </Form>

        {search
          ? search.map(item => (
              <ContainerAdoptions key={item.id}>
                <View>
                  <AdoptionDetail>
                    <TextTitle>Nome:</TextTitle>
                    <Text>{item.name}</Text>
                  </AdoptionDetail>

                  <AdoptionDetail>
                    <TextTitle>Email:</TextTitle>
                    <Text>{item.email}</Text>
                  </AdoptionDetail>

                  <AdoptionDetail>
                    <TextTitle>Celular:</TextTitle>
                    <Text>{item.celphone}</Text>
                  </AdoptionDetail>

                  <AdoptionDetail>
                    <TextTitle>RG:</TextTitle>
                    <Text>{item.rg}</Text>
                  </AdoptionDetail>

                  <AdoptionDetail>
                    <TextTitle>CPF:</TextTitle>
                    <Text>{item.cpf}</Text>
                  </AdoptionDetail>

                  <AdoptionDetail>
                    <TextTitle>Voluntário:</TextTitle>
                    <Text>{item.voluntary}</Text>
                  </AdoptionDetail>

                  <AdoptionDetail>
                    <TextTitle>Animal:</TextTitle>
                    <Text>{item.animal.name}</Text>
                  </AdoptionDetail>

                  <AdoptionDetail>
                    <TextTitle>Data da adoção:</TextTitle>
                    <Text>
                      {format(parseISO(item.created_at), 'dd/MM/yyyy')}
                    </Text>
                  </AdoptionDetail>

                  {item.canceled_at && (
                    <AdoptionDetail>
                      <TextTitle>Data de devolução:</TextTitle>
                      <Text style={{ color: '#d56' }}>
                        {format(parseISO(item.canceled_at), 'dd/MM/yyyy')}
                      </Text>
                    </AdoptionDetail>
                  )}
                </View>
                {item.canceled_at ? null : (
                  <DeleteButton
                    onPress={() => {
                      confirmDelete(item.id);
                    }}
                  >
                    <Icon
                      name="trash-2"
                      size={24}
                      color="red"
                      style={{ marginBottom: 90 }}
                    />
                  </DeleteButton>
                )}
              </ContainerAdoptions>
            ))
          : adoptions &&
            adoptions.map(item => (
              <ContainerAdoptions key={item.id}>
                <View>
                  <AdoptionDetail>
                    <TextTitle>Nome:</TextTitle>
                    <Text>{item.name}</Text>
                  </AdoptionDetail>

                  <AdoptionDetail>
                    <TextTitle>Email:</TextTitle>
                    <Text>{item.email}</Text>
                  </AdoptionDetail>

                  <AdoptionDetail>
                    <TextTitle>Celular:</TextTitle>
                    <Text>{item.celphone}</Text>
                  </AdoptionDetail>

                  <AdoptionDetail>
                    <TextTitle>RG:</TextTitle>
                    <Text>{item.rg}</Text>
                  </AdoptionDetail>

                  <AdoptionDetail>
                    <TextTitle>CPF:</TextTitle>
                    <Text>{item.cpf}</Text>
                  </AdoptionDetail>

                  <AdoptionDetail>
                    <TextTitle>Voluntário:</TextTitle>
                    <Text>{item.voluntary}</Text>
                  </AdoptionDetail>

                  <AdoptionDetail>
                    <TextTitle>Animal:</TextTitle>
                    <Text>{item.animal.name}</Text>
                  </AdoptionDetail>

                  <AdoptionDetail>
                    <TextTitle>Data da adoção:</TextTitle>
                    <Text>
                      {format(parseISO(item.created_at), 'dd/MM/yyyy')}
                    </Text>
                  </AdoptionDetail>

                  {item.canceled_at && (
                    <AdoptionDetail>
                      <TextTitle>Data de devolução:</TextTitle>
                      <Text style={{ color: '#d56' }}>
                        {format(parseISO(item.canceled_at), 'dd/MM/yyyy')}
                      </Text>
                    </AdoptionDetail>
                  )}
                </View>
                {item.canceled_at ? null : (
                  <DeleteButton
                    onPress={() => {
                      confirmDelete(item.id);
                    }}
                  >
                    <Icon
                      name="trash-2"
                      size={24}
                      color="red"
                      style={{ marginBottom: 130 }}
                    />
                  </DeleteButton>
                )}
              </ContainerAdoptions>
            ))}
      </ScrollView>
    </Container>
  );
};

export default Adoptions;
