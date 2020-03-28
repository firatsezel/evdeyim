/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import MapView from 'react-native-maps';
import moment from 'moment';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { location, date } from './src/lib'; 

import pin from './src/resources/pin.png';

let TwitterParameters = '';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      disable: false,
      cacheLocation: false,
      regionSet: false,
      region: null,
      TwitterShareURL: 'https://aboutreact.com',
      TweetContent: 'Evdeyim! HayatEveSığar! EvdeKal! Evdeyim uygulaması ile sende evinde olduğunu bildir ve bir farkındalık yarat! -->',
    };

    this.handleRegionChangeComplete = this.handleRegionChangeComplete.bind(this);
    this.tweetNow = this.tweetNow.bind(this);
  }

  async componentDidMount() {
    await location.getLocation() // Cache Getir
    .then((response) => {
      if (response.latitude === 0 && response.longitude === 0) { // location yok
        this.setState({ loading: false });
        
      } else { // location var - tarihe bakılacak
        if (true) { // 24 saat geçmemiş
          this.setState({ cacheLocation: true, loading: false, disable: true });
        } else { // 24 saat geçmiş
          this.setState({ cacheLocation: true, loading: false, disable: false });
        }
      }
    }).catch((cacheErr) => {
      this.setState({ loading: false });
      console.log(cacheErr);
    });
  }

  handleRegionChangeComplete(region) {
    this.setState({ region });
  }

  async tweetNow() {
    let bool = false;
    let now = "0";

    await date.getDate() // Cache Getir
    .then((response) => {
      if (response === "0") { // date yok
        now = moment(new Date()).format('YYYY-MM-DD'); //todays date
        bool = true;
      } else { // location var - tarihe bakılacak
        now = moment(new Date(), 'YYYY-MM-DD'); //todays date
        var end = moment(response, 'YYYY-MM-DD'); // old date
        var days = moment.duration(now.diff(end)).asDays();
        if (days >= 1 ) {
          bool = true;
        } else {
          bool = false;
        }
      }
    }).catch((cacheErr) => {
      // alert ver ve işlem yaptırma TODO
      console.log(cacheErr);
    });
    

    if (!bool) {
      let TwitterShareURL = this.state.TwitterShareURL;
      let TweetContent = this.state.TweetContent;
      
      if (this.state.TweetContent != undefined) {
        if (TwitterParameters.includes('?') == false) {
          TwitterParameters =
            TwitterParameters + '?text=' + (this.state.TweetContent);
        } else {
          TwitterParameters =
            TwitterParameters + '&text=' + (this.state.TweetContent);
        }
      }
      if (this.state.TwitterShareURL != undefined) {
        if (TwitterParameters.includes('?') == false) {
          TwitterParameters =
            TwitterParameters + '?url=' + encodeURI(this.state.TwitterShareURL);
        } else {
          TwitterParameters =
            TwitterParameters + '&url=' + encodeURI(this.state.TwitterShareURL);
        }
      }
      let url = 'https://twitter.com/intent/tweet' + TwitterParameters;
      Linking.openURL(url)
        .then(data => {
          if (now) {
            now = moment(new Date()).format('YYYY-MM-DD'); //todays date
            date.setDate(now);
          }
          alert('Twitter Opened');
        })
        .catch(() => {
          alert('Something went wrong');
        });
    } else {
      // zamana takıldı aler bas işlem yaptırma
    }
  };

  render() {
    const screen = Dimensions.get('window');
    return (
        <SafeAreaView>
          <View style={{
            ...StyleSheet.absoluteFillObject,
            height: Dimensions.get('window').height,
            width: Dimensions.get('window').width,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
            <MapView
              style={{ ...StyleSheet.absoluteFillObject, }}
              onRegionChangeComplete={this.state.regionSet ? this.handleRegionChangeComplete : null}
              onMapReady={() => { this.setState({ regionSet: true }); }}
              initialRegion={{
                latitude: 39.924805,
                longitude: 32.837126,
                latitudeDelta: 0.4922,
                longitudeDelta: 0.0421,
              }}
            />
            <View style={{
              position: 'absolute',
              left: screen.width / 2 - 10,
              right: screen.width / 2,
              top: screen.height / 2 - 30,
            }}>
              <Image source={pin} style={{ resizeMode: 'stretch' }}></Image>
            </View>
            <TouchableOpacity
              onPress={() => { this.tweetNow(); }}
              style={{
                position: 'absolute',
                width: screen.width - 70,
                height: 60,
                bottom: 40,
                borderRadius: 20,
                alignSelf: 'center',
                backgroundColor : '#FD003A',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ textAlign: 'center', fontSize: 24, color: 'white' }}>Evdeyim</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
    );
  }
  
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
