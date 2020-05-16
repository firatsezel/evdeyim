import AsyncStorage from '@react-native-community/async-storage';

const setWarning = (warning) => {
  AsyncStorage.setItem('warning', warning);
};

async function getWarning() {
  let warning = "0";
  await AsyncStorage.getItem('warning').then((response) => {
    if (response) {
        warning = response;
    }
  });
  return warning;
}

module.exports = {
  setWarning,
  getWarning,
};
