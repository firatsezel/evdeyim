import AsyncStorage from '@react-native-community/async-storage';

const setLocation = (location) => {
  const cacheLocation = `${String(location.latitude)},${String(location.longitude)}`;
  AsyncStorage.setItem('location', cacheLocation);
};

async function getLocation() {
  const location = {
    latitude: 0, // Number(JSON.parse(Config.INITIAL_REGION).latitude), gelecek
    longitude: 0, // Number(JSON.parse(Config.INITIAL_REGION).longitude), gelecek
  };
  await AsyncStorage.getItem('location').then((response) => {
    if (response) {
      const cacheLocation = response.split(',');
      location.latitude = Number(cacheLocation[0]);
      location.longitude = Number(cacheLocation[1]);
    }
  });
  return location;
}

module.exports = {
  setLocation,
  getLocation,
};
