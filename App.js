import SplashScreen from 'react-native-splash-screen';
import React from 'react';
import Email from './Components/Email';
import Record from './Components/Record';
import {
  StatusBar,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      view: null,
    };
    this.handleToRecord = this.handleToRecord.bind(this);
    this.handleToEmail = this.handleToEmail.bind(this);
    this.loading = this.loading.bind(this);
  }

  handleToRecord(emailAddressAttempt) {
    this.setState({
      view: 'record',
      email: emailAddressAttempt,
    });
  }

  handleToEmail() {
    this.setState({
      view: 'email',
    });
  }

  loading() {
    // STEP 3 - if email -> record. if none -> email screen
    const handleLoad = email => {
      if (email) {
        this.handleToRecord(email);
      } else {
        this.handleToEmail();
      }
    };

    // STEP 2 - checkStorage checks for local email
    const checkStorage = async () => {
      try {
        let email = await AsyncStorage.getItem('localEmail');
        handleLoad(email);
      } catch (error) {}
    };
    // STEP 1 - call checkStorage
    checkStorage();
  }

  componentWillMount() {
    this.loading();
  }

  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return (
      <ImageBackground
        defaultSource={require('./Components/background.jpg')}
        source={require('./Components/background.jpg')}
        style={styles.backgroundImage}>
        <StatusBar hidden={true} />
        <SafeAreaView style={styles.safe}>
          {this.state.view === 'email' && (
            <Email
              email={this.state.email}
              handleToRecord={this.handleToRecord}
            />
          )}
          {this.state.view === 'record' && (
            <Record
              email={this.state.email}
              handleToEmail={this.handleToEmail}
            />
          )}
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default App;
