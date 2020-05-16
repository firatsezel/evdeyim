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
  TouchableHighlight,
  Linking,
  Button,
  PermissionsAndroid,
} from 'react-native';
// import Voice, {
//   SpeechRecognizedEvent,
//   SpeechResultsEvent,
//   SpeechErrorEvent,
// } from '@react-native-community/voice';
import LottieView from 'lottie-react-native';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import FusedLocation from 'react-native-fused-location';
import Dialog, { SlideAnimation, DialogContent } from 'react-native-popup-dialog';
import moment from 'moment';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import receiveuser from './src/services/receiveuser';
import getalldailyusers from './src/services/getalldailyusers';
import { location, date, warning } from './src/lib'; 
// import firebase from 'react-native-firebase';

// const Banner = firebase.admob.Banner;

import pin from './src/resources/pin.png';

let TwitterParameters = '';
let facebookParameters = '';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      total: '0',
      recognized: '',
      started: '',
      results: [],
      bravoVisible: false,
      loading: true,
      disable: false,
      postVisible: false,
      statisticVisible: false,
      cacheLocation: false,
      initialPosition: null,
      oldPosition: null,
      regionSet: false,
      visible: false,
      textVal: '',
      region: null,
      FacebookShareURL: '',
      FacebookShareMessage: 'Evdeyim! HayatEveSığar! EvdeKal! Evdeyim uygulaması ile sende evinde olduğunu bildir ve bir farkındalık yarat! Takip etmek için --> @Evdeyim13 Uygulamayı edinmek için --> https://play.google.com/store/apps/details?id=com.grimphyco.evdeyim',
      TwitterShareURL: '',
      TweetContent: 'Evdeyim! HayatEveSığar! EvdeKal! Evdeyim uygulaması ile sende evinde olduğunu bildir ve bir farkındalık yarat! Takip etmek için --> @Evdeyim13 Uygulamayı edinmek için --> https://play.google.com/store/apps/details?id=com.grimphyco.evdeyim',
    };

    this.handleRegionChangeComplete = this.handleRegionChangeComplete.bind(this);
    this.tweetNow = this.tweetNow.bind(this);
    this.postOnFacebook = this.postOnFacebook.bind(this);
    this.popUpDialog = this.popUpDialog.bind(this);
    this.postOn = this.postOn.bind(this);
    this.statisticDialog = this.statisticDialog.bind(this);
    this.bravoDialog = this.bravoDialog.bind(this);
    this.requestLocationPermission = this.requestLocationPermission.bind(this);
    // this.requestMicPermission = this.requestMicPermission.bind(this);
    this.calcCrow = this.calcCrow.bind(this);
    this.toRad = this.toRad.bind(this);
    this.locationButton = this.locationButton.bind(this);
    // Voice.onSpeechStart = this.onSpeechStart.bind(this);
    // Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    // Voice.onSpeechResults = this.onSpeechResults.bind(this);
  }

  async componentDidMount() {
    await this.requestLocationPermission();
    // await this.requestMicPermission();
    const response = await getalldailyusers();
    if (response.code === 0) {
      this.setState({ total: response.message });
    }
    await warning.getWarning() // Cache Getir
    .then((response) => {
      if (response === "0") {
        this.setState({ visible: true, textVal: 'Evdeyim uygulaması ile evde olduğunu bildirip bu zor günlerde bir farkındalık yaratmaya hazır mısın? \n\nBilmen gereken bazı şeyler; \n\n -Evdeyim uygulaması asla senin konum bilgilerini tutmaz. \n\n -Evdeyim uygulaması asla senin twitter hesabın ile ilgili bilgileri tutmaz.' });
        warning.setWarning("1");
      }
    }).catch((cacheErr) => {
      console.log(cacheErr);
    });

    await location.getLocation() // Cache Getir
    .then((response) => {
      if (response.latitude === 0 && response.longitude === 0) { // location yok
        this.setState({ loading: false });
      } else { // location var - tarihe bakılacak
        this.setState({ loading: false, oldPosition: response });
      }
    }).catch((cacheErr) => {
      this.setState({ loading: false });
      console.log(cacheErr);
    });

    this.animation.play(0, 30);
  }

  /* onSpeechStart(e) {
    this.setState({
      started: '√',
    });
  };

  onSpeechRecognized(e) {
    this.setState({
      recognized: '√',
    });
  };

  onSpeechResults(e) {
    this.setState({
      results: e.value,
    });
  }

  async _startRecognition(e) {
    this.setState({
      recognized: '',
      started: '',
      results: [],
    });
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  } */

  /* async requestMicPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: "Evdeyim Mikrofon İzni",
          message:
            "Evdeyim uygulaması mikrofonunuza ihtiyaç duyuyor. ",
          buttonNeutral: "Daha Sonra Sor",
          buttonNegative: "İptal",
          buttonPositive: "Tamam"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await Voice.start('en-US');
      } else {

      }
    } catch (err) {
      console.warn(err);
    }
  } */

  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Evdeyim Konum İzni",
          message:
            "Evdeyim uygulaması konumunuza ihtiyaç duyuyor. ",
          buttonNeutral: "Daha Sonra Sor",
          buttonNegative: "İptal",
          buttonPositive: "Tamam"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        FusedLocation.setLocationPriority(FusedLocation.Constants.HIGH_ACCURACY);

        const location = await FusedLocation.getFusedLocation();
        this.setState({
          initialPosition: {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0522,
            longitudeDelta: 0.0421,
          }
        });
        this.mapView.animateToRegion(this.state.initialPosition, 100);
        // Geolocation.getCurrentPosition(
        //   position => {
        //     const initialPosition = JSON.stringify(position);
        //     console.log('initialPosition', initialPosition);
            
        //   },
        //   error => console.log('Error', JSON.stringify(error)),
        //   {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
        // );
      } else {

      }
    } catch (err) {
      console.warn(err);
    }
  };

  handleRegionChangeComplete(region) {
    this.setState({ initialPosition: region });
  }

  postDialog() {
    const screen = Dimensions.get('window');
    return (
      <Dialog
        visible={this.state.postVisible}
        dialogStyle={{
          width: screen.width / 1.2,
          backgroundColor: '#4D5065',
          marginBottom: 70,
        }}
        hasOverlay={true}
        dismissOnTouchOutside={true}
      >
        <DialogContent>
          <View style={{
            flexDirection: 'column',
            marginHorizontal: 10,
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderColor: '#4D5065',
            alignItems: 'center',
          }}>
            <Text
              style={{ textDecorationLine: 'underline', fontSize: 18, fontWeight: 'bold', color: 'white', padding: 5 }}
            >Paylaşım</Text>
            <Text
              style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}
            >Evde olduğunu nerede paylaşmak istersin?</Text>
          </View>
          <View style={{
            marginTop: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {/* <TouchableHighlight
              underlayColor="transparent"
              style={{
                borderRadius: 15,
                width: screen.width / 1.4,
                alignItems: 'center',
                justifyContent: 'center',
                height: 40,
                marginTop: 5,
                backgroundColor: '#4267B2',
              }}
              onPress={async () => {
                this.setState({ postVisible: false });
                this.postOn('facebook');
              }}
            >
              <Text style={{ alignSelf: 'center', fontSize: 18, fontWeight: 'bold', color: 'white' }}>Facebook</Text>
            </TouchableHighlight> */}
            <TouchableHighlight
              underlayColor="transparent"
              style={{
                borderRadius: 15,
                width: screen.width / 1.4,
                alignItems: 'center',
                justifyContent: 'center',
                height: 40,
                marginTop: 5,
                backgroundColor: '#1da1f2',
              }}
              onPress={async () => {
                this.setState({ postVisible: false });
                this.postOn('twitter');
              }}
            >
              <Text style={{ alignSelf: 'center', fontSize: 18, fontWeight: 'bold', color: 'white' }}>Twitter</Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="transparent"
              style={{
                borderRadius: 15,
                width: screen.width / 1.4,
                alignItems: 'center',
                justifyContent: 'center',
                height: 40,
                marginTop: 30,
                marginTop: 5,
                backgroundColor: '#F4587E',
              }}
              onPress={async () => {
                this.setState({ postVisible: false });
                this.postOn('none');
              }}
            >
              <Text style={{ alignSelf: 'center', fontSize: 18, fontWeight: 'bold', color: 'white' }}>Paylaşmak İstemiyorum</Text>
            </TouchableHighlight>
          </View>
        </DialogContent>
      </Dialog>
    );
  }

  statisticDialog() {
    const screen = Dimensions.get('window');
    return (
      <Dialog
        visible={this.state.statisticVisible}
        dialogStyle={{
          width: screen.width / 1.2,
          backgroundColor: '#4D5065',
          marginBottom: 70,
        }}
        hasOverlay={true}
        dismissOnTouchOutside={true}
      >
        <DialogContent>
          <View style={{
            flexDirection: 'column',
            marginHorizontal: 10,
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderColor: '#4D5065',
            alignItems: 'center',
          }}>
            <Text
              style={{ textDecorationLine: 'underline', fontSize: 18, fontWeight: 'bold', color: 'white', padding: 5 }}
            >Bilgilendirme</Text>
            <Text
              style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}
            >Bugün {this.state.total} kişi evde olduğunu bildirdi! Sende aralarına katılmak için hemen şimdi evde olduğunu bildir!</Text>
          </View>
          <View style={{
            marginTop: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{width: screen.width / 1.8, height: screen.width / 2.4, alignItems: 'center', justifyContent: 'center' }}>
            <LottieView
              loop={true}
              ref={animation => {
                this.animationHome = animation;
              }}
              autoPlay
              source={require('./src/resources/home3.json')}
            />
          </View>
            <TouchableHighlight
              underlayColor="transparent"
              style={{
                borderRadius: 15,
                width: screen.width / 1.4,
                alignItems: 'center',
                justifyContent: 'center',
                height: 40,
                marginTop: 5,
                backgroundColor: '#F4587E',
              }}
              onPress={async () => {
                this.setState({ statisticVisible: false });
                let now = '0';
            
                await date.getDate() // Cache Getir
                .then((response) => {
                  if (response === "0") { // date yok
                    now = moment(new Date()).format('YYYY-MM-DD'); //todays date
                    this.setState({ postVisible: true });
                  } else { // location var - tarihe bakılacak
                    now = moment(new Date(), 'YYYY-MM-DD'); //todays date
                    var end = moment(response, 'YYYY-MM-DD'); // old date
                    var days = moment.duration(now.diff(end)).asDays();
                    if (days >= 1 ) {
                      this.setState({ postVisible: true });
                    } else {
                      this.setState({ visible: true, textVal: 'Bugün için evinde olduğunu bildirdin! Yarın tekrar bildirmek için fırsatın olacak!' });
                    }
                  }
                }).catch((cacheErr) => {
                  this.setState({ visible: true, textVal: 'Bir sorun oluştu. Lütfen tekrar deneyin.' });
                });
              }}
            >
              <Text
                style={{ alignSelf: 'center', fontSize: 18, fontWeight: 'bold', color: 'white' }}
              >Evdeyim</Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="transparent"
              style={{
                borderRadius: 15,
                width: screen.width / 1.4,
                alignItems: 'center',
                justifyContent: 'center',
                height: 40,
                marginTop: 5,
                backgroundColor: 'white',
              }}
              onPress={() => { this.setState({ statisticVisible: false }); }}>
                <Text
                  style={{ alignSelf: 'center', fontSize: 18, fontWeight: 'bold', color: '#F4587E' }}
                >Şimdi Değil</Text>
            </TouchableHighlight>
          </View>
        </DialogContent>
      </Dialog>
    );
  }

  bravoDialog() {
    const screen = Dimensions.get('window');    
    return (
      <Dialog
        visible={this.state.bravoVisible}
        dialogStyle={{
          width: screen.width / 1.2,
          backgroundColor: '#4D5065',
          marginBottom: 70,
        }}
        hasOverlay={true}
      >
        <DialogContent>
          <View style={{
            flexDirection: 'column',
            marginHorizontal: 10,
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderColor: '#4D5065',
            alignItems: 'center',
          }}>
            <Text
              style={{ textDecorationLine: 'underline', fontSize: 18, fontWeight: 'bold', color: 'white', padding: 5 }}
            >Bravo!</Text>
            <Text
              style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}
            >Bugün için evde olduğunuzu başarı ile bildirdiniz. Yarın tekrar görüşmek üzere!</Text>
          </View>
          <View style={{
            marginTop: 5,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}>
          <View style={{ width: screen.width / 1.8, height: screen.width / 2.4, alignItems: 'center', justifyContent: 'center' }}>
            <LottieView
              loop={true}
              ref={animation => {
                this.animationHand = animation;
              }}
              autoPlay
              source={require('./src/resources/hand.json')}
            />
          </View>
            <TouchableHighlight
              underlayColor="transparent"
              style={{
                borderRadius: 15,
                width: screen.width / 1.4,
                alignItems: 'center',
                justifyContent: 'center',
                height: 40,
                marginTop: 5,
                backgroundColor: '#F4587E',
              }}
              onPress={() => { this.setState({ bravoVisible: false }); }}
            >
              <Text
                style={{ alignSelf: 'center', fontSize: 18, fontWeight: 'bold', color: 'white' }}
              >Tamam</Text>
            </TouchableHighlight>
          </View>
        </DialogContent>
      </Dialog>
    );
  }

  popUpDialog() {
    const screen = Dimensions.get('window');
    return (
      <Dialog
        visible={this.state.visible}
        dialogStyle={{
          width: screen.width / 1.2,
          backgroundColor: '#4D5065',
          marginBottom: 70,
        }}
        hasOverlay={true}
        dismissOnTouchOutside
      >
        <DialogContent>
          <View style={{
            flexDirection: 'column',
            marginHorizontal: 10,
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderColor: '#4D5065',
            alignItems: 'center',
          }}>
            <Text
              style={{ textDecorationLine: 'underline', fontSize: 18, fontWeight: 'bold', color: 'white', padding: 5 }}
            >Bilgilendirme</Text>
            <Text
              style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}
            >{this.state.textVal ? this.state.textVal : 'Bugün için evinde olduğunu bildirdin! Yarın tekrar bildirmek için fırsatın olacak!'}</Text>
          </View>
          <View style={{
            marginTop: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <TouchableHighlight
              underlayColor="transparent"
              style={{
                borderRadius: 15,
                width: screen.width / 1.4,
                alignItems: 'center',
                justifyContent: 'center',
                height: 40,
                marginTop: 5,
                backgroundColor: '#F4587E',
              }}
              onPress={() => { this.setState({ visible: false }); }}
            >
              <Text
                style={{ alignSelf: 'center', fontSize: 18, fontWeight: 'bold', color: 'white' }}
              >Tamam</Text>
            </TouchableHighlight>
          </View>
        </DialogContent>
      </Dialog>
    );
  }

  calcCrow(lat1, lon1, lat2, lon2) 
  {
    var R = 6371; // km
    var dLat = this.toRad(lat2-lat1);
    var dLon = this.toRad(lon2-lon1);
    var lat1 = this.toRad(lat1);
    var lat2 = this.toRad(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
  }

  toRad(Value) 
  {
      return Value * Math.PI / 180;
  }

  choosePost() {

  }

  async postOn(type) {
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
          this.setState({ visible: true, textVal: 'Bugün için evinde olduğunu bildirdin! Yarın tekrar bildirmek için fırsatın olacak!' });
          bool = false;
        }
      }
    }).catch((cacheErr) => {
      this.setState({ visible: true, textVal: 'Bir sorun oluştu. Lütfen tekrar deneyin.' });
    });

    if (type === 'none') {
      if (this.state.oldPosition && this.state.initialPosition) {
        // lokasyonları kontrol et
        const { oldPosition, initialPosition } = this.state;
        const distance = this.calcCrow(oldPosition.latitude, oldPosition.longitude, initialPosition.latitude, initialPosition.longitude) * 1000;
        if (distance < 400) {
          if (now && this.state.initialPosition) {
            now = moment(new Date()).format('YYYY-MM-DD'); //todays date
            location.setLocation(this.state.initialPosition);
            date.setDate(now);
            await receiveuser();
            this.setState({ bravoVisible: true });
          } else {
            this.setState({ visible: true, textVal: 'Bir sorun oluştu. Lütfen tekrar deneyin.' });
          }
        } else {
          this.setState({ visible: true, textVal: 'Evinin yakınında değilsin. Farkındalık yaratmak için lütfen bize daha önce bildirdiğin evinin konumunda ol.'})
        }
      } else {
        if (now && this.state.initialPosition) {
          now = moment(new Date()).format('YYYY-MM-DD'); //todays date
          location.setLocation(this.state.initialPosition);
          date.setDate(now);
          await receiveuser();
          this.setState({ bravoVisible: true });
        } else {
          this.setState({ visible: true, textVal: 'Bir sorun oluştu. Lütfen tekrar deneyin.' });
        }
      }
    }

    if (bool && type !== 'none') {
      if (this.state.oldPosition && this.state.initialPosition) {
        // lokasyonları kontrol et
        const { oldPosition, initialPosition } = this.state;
        const distance = this.calcCrow(oldPosition.latitude, oldPosition.longitude, initialPosition.latitude, initialPosition.longitude) * 1000;
        if (distance < 400) {
          await receiveuser();
          let url = type === 'facebook' ? this.postOnFacebook() : this.tweetNow();
          Linking.openURL(url)
            .then(data => {
              if (now && this.state.initialPosition) {
                now = moment(new Date()).format('YYYY-MM-DD'); //todays date
                location.setLocation(this.state.initialPosition);
                date.setDate(now);
                
                this.setState({ bravoVisible: true });
              } else {
                this.setState({ visible: true, textVal: 'Bir sorun oluştu. Lütfen tekrar deneyin.' });
              }
            })
            .catch(() => {
              this.setState({ visible: true, textVal: 'Bir sorun oluştu. Lütfen tekrar deneyin.' });
            });
        } else {
          this.setState({ visible: true, textVal: 'Evinin yakınında değilsin. Farkındalık yaratmak için lütfen bize daha önce bildirdiğin evinin konumunda ol.'})
        }
      } else {
        let url = type === 'facebook' ? this.postOnFacebook() : this.tweetNow();
        await receiveuser();
        Linking.openURL(url)
          .then(data => {
            if (now && this.state.initialPosition) {
              now = moment(new Date()).format('YYYY-MM-DD'); //todays date
              location.setLocation(this.state.initialPosition);
              date.setDate(now);
              this.setState({ bravoVisible: true });
            } else {
              this.setState({ visible: true, textVal: 'Bir sorun oluştu. Lütfen tekrar deneyin.' });
            }
          })
          .catch(() => {
            this.setState({ visible: true, textVal: 'Bir sorun oluştu. Lütfen tekrar deneyin.' });
          });
      }
    }
    const response = await getalldailyusers();
    if (response.code === 0) {
      this.setState({ total: response.message });
    }
  }

  postOnFacebook() {
      let FacebookShareURL = this.state.FacebookShareURL;
      let FacebookShareMessage = this.state.FacebookShareMessage;
      if(this.state.FacebookShareURL != undefined)
      {
          if(facebookParameters.includes("?") == false)
          {
              facebookParameters = facebookParameters+"?u="+encodeURI(this.state.FacebookShareURL);
          }else{
              facebookParameters = facebookParameters+"&u="+encodeURI(this.state.FacebookShareURL);
          }
      }
      if(this.state.FacebookShareMessage != undefined)
      {
          if(facebookParameters.includes("?") == false)
          {
              facebookParameters = facebookParameters+"?quote="+encodeURI(this.state.FacebookShareMessage);
          }else{
              facebookParameters = facebookParameters+"&quote="+encodeURI(this.state.FacebookShareMessage);
          }
      }
      const url = 'https://www.facebook.com/sharer/sharer.php'+facebookParameters;
      return url;
  }

  tweetNow() {
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
    
    const url = 'https://twitter.com/intent/tweet' + TwitterParameters;
    return url;
  };

  locationButton() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.requestLocationPermission();
          this.animation.play(0, 120);
        }}
        style={{ elevation: 10, zIndex: 9999, position: 'absolute', right: 15, top: 75, alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 20, backgroundColor: 'white' }}>
        <LottieView
          loop={false}
          ref={animation => {
            this.animation = animation;
          }}
          source={require('./src/resources/locate.json')}
        />
      </TouchableOpacity>
    );
  }

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
              ref={(ref) => { this.mapView = ref; }}
              initialRegion={this.state.initialPosition ? this.state.initialPosition : {
                latitude: 39.924805,
                longitude: 32.837126,
                latitudeDelta: 0.4922,
                longitudeDelta: 0.0421,
              }}
            />
            
            {this.locationButton()}
            {this.popUpDialog()}
            {this.statisticDialog()}
            {this.postDialog()}
            {this.bravoDialog()}
            <View style={{
              position: 'absolute',
              left: screen.width / 2 - 10,
              right: screen.width / 2,
              top: screen.height / 2 - 30,
            }}>
              <Image source={pin} style={{ width: 32, height: 32, resizeMode: 'stretch' }}></Image>
            </View>
            {/* <View style={{
              position: 'absolute',
              width: 320,
              height: 50,
              top: 20,
            }}>
                <Banner
                    style={{
                      width: 320,
                      height: 50,
                    }}
                    size={"BANNER"}
                    unitId="ca-app-pub-1281059693420479/8493565247"
                />
            </View> */}
            <TouchableOpacity
              onPress={() => { this.setState({ statisticVisible: true }); }}
              style={{
                position: 'absolute',
                width: 60,
                height: 60,
                borderRadius: 30,
                top: 65,
                left: 15,
                backgroundColor: '#1da1f2',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ color: 'white', padding: 5, fontSize: 42, alignSelf: 'center', textAlign: 'center' }}>{this.state.total}</Text>
            </TouchableOpacity>
           
            {this.state.results.map((result, index) => <Text style={styles.transcript}> {result}</Text>)}
         
            {/* <Button style={styles.transcript}
        onPress={this._startRecognition.bind(this)}
        title="Start"></Button> */}
            <TouchableOpacity
              onPress={async () => { 
                let bool = false;
                let now = "0";
            
                await date.getDate() // Cache Getir
                .then((response) => {
                  if (response === "0") { // date yok
                    now = moment(new Date()).format('YYYY-MM-DD'); //todays date
                    this.setState({ postVisible: true });
                  } else { // location var - tarihe bakılacak
                    now = moment(new Date(), 'YYYY-MM-DD'); //todays date
                    var end = moment(response, 'YYYY-MM-DD'); // old date
                    var days = moment.duration(now.diff(end)).asDays();
                    if (days >= 1 ) {
                      this.setState({ postVisible: true });
                    } else {
                      this.setState({ visible: true, textVal: 'Bugün için evinde olduğunu bildirdin! Yarın tekrar bildirmek için fırsatın olacak!' });
                      bool = false;
                    }
                  }
                }).catch((cacheErr) => {
                  this.setState({ visible: true, textVal: 'Bir sorun oluştu. Lütfen tekrar deneyin.' });
                });
               }}
              style={{
                elevation: 10,
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
  transcript: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
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
