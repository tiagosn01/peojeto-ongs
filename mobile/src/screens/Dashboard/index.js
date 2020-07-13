import React, { useState, useEffect, useCallback } from 'react';

import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { ScrollView } from 'react-native';
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
  const [admins, setAdmins] = useState([]);

  const { user } = useAuth();
  const { navigate } = useNavigation();

  const navigateToAnimals = useCallback(
    institutionId => {
      navigate('Animals', { institutionId });
    },
    [navigate],
  );

  useEffect(() => {
    api.get('/institutions/admin').then(response => {
      setAdmins(response.data);
    });
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

      <ScrollView style={{ flex: 1 }}>
        {admins &&
          admins.map(item => (
            <InstitutionAdmin key={item.institution.id}>
              <ListsTitle>Sua instituição</ListsTitle>
              <InstitutionContainer
                onPress={() => navigateToAnimals(item.institution.id)}
              >
                <InstitutionAvatar
                  source={{ uri: item.institution.avatar.url }}
                />

                <InstitutionInfo>
                  <InstitutionName>{item.institution.name}</InstitutionName>

                  <InstitutionDetail>
                    <Icon name="map-pin" size={14} color="#ff9000" />
                    <InstitutionDetailText>
                      {item.institution.city} - {item.institution.state}
                    </InstitutionDetailText>
                  </InstitutionDetail>

                  <InstitutionDetail>
                    <Icon name="mail" size={14} color="#ff9000" />
                    <InstitutionDetailText>
                      {item.institution.email}
                    </InstitutionDetailText>
                  </InstitutionDetail>
                </InstitutionInfo>
              </InstitutionContainer>
            </InstitutionAdmin>
          ))}

        {admins.length > 0 && <DrawView />}
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
