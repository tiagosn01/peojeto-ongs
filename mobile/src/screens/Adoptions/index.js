import React, { useState, useEffect } from 'react';
import { FlatList, View } from 'react-native';

import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

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
} from './styles';

const Adoptions = () => {
  const route = useRoute();
  const { institutionId } = route.params;

  const { goBack } = useNavigation();

  const [adoptions, setAdoptions] = useState([]);

  useEffect(() => {
    api.get(`/adoptions/${institutionId}`).then(response => {
      setAdoptions(response.data);
    });
  }, [institutionId]);

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

      <FlatList
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
            </View>
            <DeleteButton
              onPress={() => {
                goBack();
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
