import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron, { asyncStorage } from 'reactotron-react-native';

if (__DEV__) {
  Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
    .configure() // controls connection & communication settings
    .useReactNative() // add all built-in react native plugins
    .setAsyncStorageHandler(AsyncStorage)
    .connect(); // let's connect!
}
