import React, { useState, useEffect, useCallback, Alert } from 'react';

import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { ScrollView, RefreshControl } from 'react-native';
import { useAuth } from '../../hooks/auth';

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
} from './styles';

const Dashboard = () => {
  const [institutions, setInstitutions] = useState([]);
  const [admins, setAdmins] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const { user } = useAuth();
  const { navigate } = useNavigation();

  const onRefresh = useCallback(() => {
    setRefresh(true);

    setTimeout(() => {
      api.get('/institutions-admin').then(response => {
        setAdmins(response.data.institution);
      });
    }, 1000);
    setRefresh(false);
  }, []);

  const navigateToAnimals = useCallback(
    institutionId => {
      navigate('Animals', { institutionId });
    },
    [navigate],
  );

  useEffect(() => {
    try {
      api.get('/institutions-admin').then(response => {
        setAdmins(response.data.institution);
      });
    } catch (err) {
      Alert.alert(
        'Erro ao carregar instituição',
        'Erro ao carregar instituição do admin.',
      );
    }
  }, []);

  useEffect(() => {
    api.get('/institutions').then(response => {
      setInstitutions(response.data);
    });
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

        {institutions &&
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
