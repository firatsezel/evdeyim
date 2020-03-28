import AsyncStorage from '@react-native-community/async-storage';

const setDate = (date) => {
  AsyncStorage.setItem('date', date);
};

async function getDate() {
  let date = "0";
  await AsyncStorage.getItem('date').then((response) => {
    if (response) {
        date = response;
    }
  });
  return date;
}

module.exports = {
  setDate,
  getDate,
};
