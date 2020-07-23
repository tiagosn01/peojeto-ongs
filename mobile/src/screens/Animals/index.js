import React, { useState, useEffect, useCallback } from 'react';

import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { ScrollView } from 'react-native';
import { useAuth } from '../../hooks/auth';

import api from '../../services/api';

import Button from '../../components/Button';

import {
  Container,
  Header,
  HeaderTitle,
  BackButton,
  UserAvatar,
  ProfileButton,
  InstitutionContainer,
  InstitutionAvatar,
  InstitutionInfo,
  InstitutionDetail,
  InstitutionName,
  InstitutionDetailText,
  InstitutionAdmin,
  InstitutionTitle,
  AnimalContainer,
  AnimalName,
  AnimalDetailText,
  DrawView,
  ContainerButton,
  DrawVertical,
} from './styles';

const Dashboard = () => {
  const [animals, setAnimals] = useState([]);
  const [institution, setInstitution] = useState({});
  const [admin, setAdmin] = useState({});

  const route = useRoute();
  const { institutionId } = route.params;

  const { user } = useAuth();
  const { navigate, goBack } = useNavigation();

  const navigateToRegisterAdoption = useCallback(() => {
    navigate('RegisterAdoption', { institutionId });
  }, [institutionId, navigate]);

  const navigateToProfileAnimal = useCallback(
    animalId => {
      navigate('ProfileAnimal', { animalId });
    },
    [navigate],
  );

  useEffect(() => {
    async function loadInstitution() {
      await api.get(`/institution-show/${institutionId}`).then(response => {
        setInstitution(response.data);
      });
    }
    loadInstitution();
  }, [institutionId]);

  useEffect(() => {
    api.get(`/isadmins/${institutionId}`).then(response => {
      setAdmin(response.data);
    });
  }, [institutionId]);

  useEffect(() => {
    api.get(`/animals/${institutionId}`).then(response => {
      setAnimals(response.data);
    });
  }, [institutionId]);

  return (
    <Container>
      <Header>
        <BackButton
          onPress={() => {
            goBack();
          }}
        >
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Instituições</HeaderTitle>

        <ProfileButton
          onPress={() => {
            navigate('ProfileUser');
          }}
        >
          <UserAvatar source={{ uri: user.avatar.url }} />
        </ProfileButton>
      </Header>

      <ScrollView style={{ flex: 1 }}>
        <InstitutionAdmin>
          <InstitutionContainer>
            {institution.avatar && (
              <InstitutionAvatar source={{ uri: institution.avatar.url }} />
            )}

            <InstitutionInfo>
              <InstitutionName>{institution.name}</InstitutionName>

              <InstitutionDetail>
                <Icon
                  style={{ marginBottom: 18 }}
                  name="align-justify"
                  size={18}
                  color="#ff9000"
                />
                <InstitutionDetailText>
                  {institution.detail} {'\n'}
                </InstitutionDetailText>
              </InstitutionDetail>

              <InstitutionDetail>
                <Icon
                  style={{ marginBottom: 14 }}
                  name="map-pin"
                  size={18}
                  color="#ff9000"
                />
                <InstitutionDetailText>
                  {institution.city} - {institution.state} {'\n'}
                </InstitutionDetailText>
              </InstitutionDetail>

              <InstitutionDetail>
                <Icon
                  style={{ marginTop: 3 }}
                  name="mail"
                  size={18}
                  color="#ff9000"
                />
                <InstitutionDetailText>
                  {institution.email}
                </InstitutionDetailText>
              </InstitutionDetail>
            </InstitutionInfo>
          </InstitutionContainer>
        </InstitutionAdmin>

        {admin.email && (
          <ContainerButton>
            <Button
              title="animal-register"
              onPress={() => {
                navigate('RegisterAnimal');
              }}
            >
              Cadastrar Animal
            </Button>
            <Button
              title="adoption-register"
              onPress={() => {
                navigateToRegisterAdoption();
              }}
            >
              Cadastrar Adoção
            </Button>
            <Button
              title="adoption-consult"
              onPress={() => {
                navigate('ConsultAdoption');
              }}
            >
              Consultar Adoção
            </Button>
          </ContainerButton>
        )}

        {institution && <DrawView />}

        <InstitutionTitle>Disponíveis para adoção</InstitutionTitle>

        {animals &&
          animals.map(animal =>
            animal.available ? (
              <InstitutionAdmin key={animal.id}>
                <AnimalContainer
                  onPress={() => navigateToProfileAnimal(animal.id)}
                >
                  <InstitutionAvatar source={{ uri: animal.avatar.url }} />

                  <InstitutionInfo>
                    <AnimalName>{animal.name}</AnimalName>

                    <InstitutionDetail>
                      <DrawVertical />
                      <AnimalDetailText>
                        {animal.type} {'\n'}
                        {animal.sex} {'\n'}
                        {animal.detail}
                      </AnimalDetailText>
                    </InstitutionDetail>
                  </InstitutionInfo>
                </AnimalContainer>
              </InstitutionAdmin>
            ) : null,
          )}

        <InstitutionTitle>Em tratamento</InstitutionTitle>

        {animals &&
          animals.map(animal =>
            animal.available ? null : (
              <InstitutionAdmin key={animal.id}>
                <AnimalContainer
                  onPress={() => navigateToProfileAnimal(animal.id)}
                >
                  <InstitutionAvatar source={{ uri: animal.avatar.url }} />

                  <InstitutionInfo>
                    <AnimalName>{animal.name}</AnimalName>

                    <InstitutionDetail>
                      <DrawVertical />
                      <AnimalDetailText>
                        {animal.type} {'\n'}
                        {animal.sex} {'\n'}
                        {animal.detail}
                      </AnimalDetailText>
                    </InstitutionDetail>
                  </InstitutionInfo>
                </AnimalContainer>
              </InstitutionAdmin>
            ),
          )}
      </ScrollView>
    </Container>
  );
};

export default Dashboard;
