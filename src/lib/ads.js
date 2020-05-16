import React from 'react';
import { View } from 'react-native';
// import firebase from 'react-native-firebase';

// const Banner = firebase.admob.Banner;
// Banner

function BannerView() {
    return (
        <View style={{
            position: 'absolute',
            width: 320,
            height: 50,
            top: 50,
            backgroundColor: 'blue',
        }}>
            {/* <Banner
                style={{
                    marginTop: 25,
                    width: 320,
                    zIndex: 99999,
                    height: 50,
                    alignSelf: 'center',
                }}
                size={"BANNER"}
                unitId={"ca-app-pub-1281059693420479/8493565247"}
            /> */}
        </View>
    );
}

module.exports = {
    BannerView,
};
