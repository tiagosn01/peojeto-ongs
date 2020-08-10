/* eslint-disable react/jsx-indent */
import React, { useState, useEffect, useCallback, Alert, useRef } from 'react';

import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { ScrollView, RefreshControl } from 'react-native';
import { Form } from '@unform/mobile';
import { useAuth } from '../../hooks/auth';

import Input from '../../components/Input';

import api from '../../services/api';

import {
  Container,
  Header,
  HeaderText,
  UserName,
  UserAvatar,
  ProfileButton,
  InstitutionContainer,
  InstitutionAvatar,
  InstitutionInfo,
  InstitutionDetail,
  InstitutionName,
  InstitutionDetailText,
  InstitutionAdmin,
  ListsTitle,
  InstitutionTitle,
  DrawView,
  ContainerForm,
  ButtonForm,
} from './styles';

const Dashboard = () => {
  const formRef = useRef();

  const [institutions, setInstitutions] = useState([]);
  const [search, setSearch] = useState('');
  const [admins, setAdmins] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const { user } = useAuth();
  const { navigate } = useNavigation();

  const onRefresh = useCallback(() => {
    try {
      setRefresh(true);

      setTimeout(() => {
        api.get('/institutions-admin').then(response => {
          setAdmins(response.data.institution);
        });
        setSearch('');
      }, 1000);
      setRefresh(false);
    } catch (err) {
      Alert.alert('Falha ao carregar instituições.');
    }
  }, []);

  const navigateToAnimals = useCallback(
    institutionId => {
      navigate('Animals', { institutionId });
    },
    [navigate],
  );

  useEffect(() => {
    api.get('/institutions-admin').then(response => {
      setAdmins(response.data.institution);
    });
  }, []);

  useEffect(() => {
    api.get('/institutions').then(response => {
      setInstitutions(response.data);
    });
  }, []);

  const handleSearch = useCallback(async data => {
    try {
      const response = await api.post('/institution-search', data);

      if (response.data !== '') {
        setSearch(response.data);
      }
    } catch (err) {
      Alert.alert('Erro na busca', 'Nenhuma instituição encontrada');
      throw new Error('Nenhum resultado encontrado.');
    }
  }, []);

  return (
    <Container>
      <Header>
        <HeaderText>
          Bem vindo, {'\n'}
          <UserName>{user.name}</UserName>
        </HeaderText>

        <ProfileButton
          onPress={() => {
            navigate('ProfileUser');
          }}
        >
          <UserAvatar source={{ uri: user.avatar.url }} />
        </ProfileButton>
      </Header>

      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
      >
        {admins ? (
          <InstitutionAdmin>
            <ListsTitle>Sua instituição</ListsTitle>
            <InstitutionContainer onPress={() => navigateToAnimals(admins.id)}>
              {admins.avatar && (
                <InstitutionAvatar source={{ uri: admins.avatar.url }} />
              )}

              <InstitutionInfo>
                <InstitutionName>{admins.name}</InstitutionName>

                <InstitutionDetail>
                  <Icon name="map-pin" size={14} color="#ff9000" />
                  <InstitutionDetailText>
                    {admins.city} - {admins.state}
                  </InstitutionDetailText>
                </InstitutionDetail>

                <InstitutionDetail>
                  <Icon name="mail" size={14} color="#ff9000" />
                  <InstitutionDetailText>{admins.email}</InstitutionDetailText>
                </InstitutionDetail>
              </InstitutionInfo>
            </InstitutionContainer>
          </InstitutionAdmin>
        ) : null}
        {admins && <DrawView />}

        <InstitutionTitle>Instituições</InstitutionTitle>

        <Form onSubmit={handleSearch} ref={formRef}>
          <ContainerForm>
            <Input
              icon="chevrons-right"
              name="city"
              placeholder="Pesquisar por cidade"
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
          ? search.map(institution => (
              <InstitutionAdmin key={institution.id}>
                <InstitutionContainer
                  onPress={() => navigateToAnimals(institution.id)}
                >
                  <InstitutionAvatar source={{ uri: institution.avatar.url }} />

                  <InstitutionInfo>
                    <InstitutionName>{institution.name}</InstitutionName>

                    <InstitutionDetail>
                      <Icon name="map-pin" size={14} color="#ff9000" />
                      <InstitutionDetailText>
                        {institution.city} - {institution.state}
                      </InstitutionDetailText>
                    </InstitutionDetail>

                    <InstitutionDetail>
                      <Icon name="mail" size={14} color="#ff9000" />
                      <InstitutionDetailText>
                        {institution.email}
                      </InstitutionDetailText>
                    </InstitutionDetail>
                  </InstitutionInfo>
                </InstitutionContainer>
              </InstitutionAdmin>
            ))
          : institutions &&
            institutions.map(institution => (
              <InstitutionAdmin key={institution.id}>
                <InstitutionContainer
                  onPress={() => navigateToAnimals(institution.id)}
                >
                  <InstitutionAvatar source={{ uri: institution.avatar.url }} />

                  <InstitutionInfo>
                    <InstitutionName>{institution.name}</InstitutionName>

                    <InstitutionDetail>
                      <Icon name="map-pin" size={14} color="#ff9000" />
                      <InstitutionDetailText>
                        {institution.city} - {institution.state}
                      </InstitutionDetailText>
                    </InstitutionDetail>

                    <InstitutionDetail>
                      <Icon name="mail" size={14} color="#ff9000" />
                      <InstitutionDetailText>
                        {institution.email}
                      </InstitutionDetailText>
                    </InstitutionDetail>
                  </InstitutionInfo>
                </InstitutionContainer>
              </InstitutionAdmin>
            ))}
      </ScrollView>
    </Container>
  );
};

export default Dashboard;
