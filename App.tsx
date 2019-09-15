/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import StickerPickView from './src/sticker/stickerPickView'
import { StickerItem } from './src/sticker/stickerCategory';

const App = () => {
  return (
    <Fragment>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, flexDirection: 'column' }} >
          <View style={{ flex: 1, backgroundColor: '#424A5F' }} />
          <StickerPickView
            style={styles.stickerPicker}
            height={240}
            itemSize={85}
            onPickSticker={(category: StickerItem) => {
              console.log('category', category);
            }} />
        </View>
      </SafeAreaView>
    </Fragment >
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lighter,
    flex: 1,
    flexDirection: 'column'
  },
  stickerPicker: {
    flexDirection: 'row',
  }

});

export default App;
