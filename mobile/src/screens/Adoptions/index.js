import React, { useState, useEffect, useCallback } from 'react';
import { View, Alert } from 'react-native';

import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import { format, parseISO } from 'date-fns';

import api from '../../services/api';

import {
  Container,
  ContainerAdoptions,
  BackButton,
  Title,
  TextTitle,
  Text,
  AdoptionDetail,
  DeleteButton,
  AdoptionList,
} from './styles';

const Adoptions = () => {
  const route = useRoute();
  const { institutionId } = route.params;

  const { goBack, navigate } = useNavigation();

  const [adoptions, setAdoptions] = useState([]);

  useEffect(() => {
    api.get(`/adoptions/${institutionId}`).then(response => {
      setAdoptions(response.data);
    });
  }, [institutionId]);

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
      'Deseja realmente excluir o registro da adoção? O animal ficara disponível para adoção novamente.',
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
      <BackButton
        onPress={() => {
          goBack();
        }}
      >
        <Icon name="chevron-left" size={24} color="#e2dcdc" />
      </BackButton>

      <Title>Consulta de adoções</Title>

      <AdoptionList
        data={adoptions}
        keyExtractor={adoption => adoption.id.toString()}
        renderItem={({ item }) => (
          <ContainerAdoptions>
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
                <TextTitle>Data:</TextTitle>
                <Text>{format(parseISO(item.created_at), 'dd/MM/yyyy')}</Text>
              </AdoptionDetail>
            </View>
            <DeleteButton
              onPress={() => {
                confirmDelete(item.id);
              }}
            >
              <Icon
                name="trash-2"
                size={24}
                color="red"
                style={{ marginBottom: 80 }}
              />
            </DeleteButton>
          </ContainerAdoptions>
        )}
      />
    </Container>
  );
};

export default Adoptions;
