import AsyncStorage from '@react-native-community/async-storage';

const setLocation = (location) => {
  const cacheLocation = `${String(location.latitude)},${String(location.longitude)},${String(location.timestamp)}`;
  AsyncStorage.setItem('location', cacheLocation);
};

async function getLocation() {
  const location = {
    latitude: 0, // Number(JSON.parse(Config.INITIAL_REGION).latitude), gelecek
    longitude: 0, // Number(JSON.parse(Config.INITIAL_REGION).longitude), gelecek
    timestamp: 0,
  };
  await AsyncStorage.getItem('location').then((response) => {
    if (response) {
      const cacheLocation = response.split(',');
      location.latitude = Number(cacheLocation[0]);
      location.longitude = Number(cacheLocation[1]);
      location.timestamp = Number(cacheLocation[2]);
    }
  });
  return location;
}

module.exports = {
  setLocation,
  getLocation,
};
