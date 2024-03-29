import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text, TouchableOpacity, Keyboard } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { TextInput } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';

import api from '../services/api';

const Main = ({ navigation }) => {
  const [devs, setDevs] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [techs, setTechs] = useState('');

  useEffect(() => {
    const loadInitialPosition = async () => {
      const { granted } = await requestPermissionsAsync();

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true,
        });

        const { latitude, longitude } = coords;

        setCurrentRegion({
          latitude,
          longitude,
          longitudeDelta: 0.04,
          latitudeDelta: 0.04,
        });
      }
    };

    loadInitialPosition();

    const keyboardEventHandler = e => {
      setKeyboardHeight(e.endCoordinates.height);
    };

    Keyboard.addListener('keyboardDidShow', keyboardEventHandler);
    Keyboard.addListener('keyboardDidHide', keyboardEventHandler);
  }, []);

  const loadDevs = async () => {
    const { latitude, longitude } = currentRegion;

    const response = await api.get('/search', {
      params: {
        lat: latitude,
        lon: longitude,
        techs,
      },
    });

    setDevs(response.data.devs);
  };

  const handleRegionChanged = region => {
    setCurrentRegion(region);
  };

  if (!currentRegion) return null;

  return (
    <>
      <MapView
        style={styles.map}
        initialRegion={currentRegion}
        onRegionChangeComplete={handleRegionChanged}>
        {devs.map(dev => (
          <Marker
            key={dev._id}
            coordinate={{
              latitude: dev.location.coordinates[0],
              longitude: dev.location.coordinates[1],
            }}>
            <Image style={styles.avatar} source={{ uri: dev.avatar_url }} />

            <Callout
              onPress={() =>
                navigation.push('Profile', {
                  github_username: dev.github_username,
                })
              }>
              <View style={styles.callout}>
                <Text style={styles.devName}>{dev.name}</Text>
                <Text style={styles.devBio}>{dev.bio}</Text>
                <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <View style={[styles.searchForm, { bottom: 20 + keyboardHeight }]}>
        <TextInput
          style={styles.searchInput}
          placeholder='Buscar devs por techs...'
          placeholderTextColor='#999'
          autoCapitalize='words'
          autoCorrect={false}
          onChangeText={setTechs}
        />

        <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
          <MaterialIcons name='my-location' size={20} color='#FFF' />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  avatar: {
    height: 54,
    width: 54,
    borderRadius: 4,
  },
  devName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  devBio: {
    color: '#666',
    marginTop: 5,
  },
  devTechs: {
    marginTop: 5,
  },
  callout: {
    width: 260,
  },
  searchForm: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: 'row',
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#FFF',
    color: '#333',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    elevation: 2,
  },
  loadButton: {
    width: 50,
    height: 50,
    backgroundColor: '#8E4DFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
});

export default Main;
