import Voice from 'react-native-voice';
import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  Linking,
  ScrollView,
  Platform,
} from 'react-native';

class Record extends React.Component {
  state = {
    error: '',
    stop: '',
    listening: '',
    results: [],
  };

  constructor(props) {
    super(props);
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechEnd = e => {
    console.log('onSpeechEnd: ', e);
    this.setState({
      stop: '√',
      listening: '',
    });
  };

  onSpeechError = e => {
    console.log('onSpeechError: ', e);
    this.setState({
      error: JSON.stringify(e.error),
      listening: '',
    });
  };

  onSpeechResults = e => {
    console.log('onSpeechResults: ', e);
    this.setState({
      results: e.value,
    });
  };

  _startRecognizing = async () => {
    this.setState({
      error: '',
      listening: '√',
      results: [],
      stop: '',
    });

    try {
      await Voice.start('en-US', {
        // EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS: 20000,
        // EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS: 20000,
        // EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 20000,
      });
    } catch (e) {
      console.error(e);
    }
  };

  _stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    const {email} = this.props;

    const sig = `
      
      Sent with TalkJot app
      https://talkjot.co`;

    const subject = 'TalkJot – Note to Self';

    const helpSubject = 'TalkJot – Help / Feedback';

    return (
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{alignItems: 'center'}}>
        <Image style={styles.logo} source={require('./logo.png')} />

        {this.state.listening === '' && (
          <TouchableOpacity
            style={styles.startButton}
            onPress={this._startRecognizing}>
            <Text style={styles.startText}>Start New Voice Note</Text>
          </TouchableOpacity>
        )}

        {this.state.listening !== '' && Platform.OS === 'ios' && (
          <TouchableOpacity
            style={styles.stopButton}
            onPress={this._stopRecognizing}>
            <Text style={styles.stopText}>Stop Listening</Text>
          </TouchableOpacity>
        )}

        {this.state.stop !== '' && (
          <Text style={styles.yourResultsText}>YOUR RESULTS:</Text>
        )}

        {this.state.listening !== '' && (
          <Text style={styles.yourResultsText}>LISTENING...</Text>
        )}

        {this.state.error !== '' && (
          <Text style={styles.fail}>
            There was an error. Please try again, making sure that (1) you have
            given the app permission to use your device's microphone and
            built-in speech recognition functionality, (2) your device is
            connected to the internet, and (3) you are speaking loudly, clearly,
            and directly into the microphone.
          </Text>
        )}

        {this.state.results[0] !== undefined && (
          <View style={styles.resultsView}>
            <Text style={styles.results}>{this.state.results[0]}</Text>
          </View>
        )}

        {this.state.stop !== '' && (
          <TouchableOpacity
            style={styles.sendEmailButton}
            onPress={() => {
              Linking.openURL(
                `mailto:${email}?subject=${subject}&body=${
                  this.state.results[0]
                }${sig}`,
              );
            }}>
            <View>
              <Text style={styles.buttonText}>Send Results to Email</Text>
            </View>
          </TouchableOpacity>
        )}

        {this.state.listening === '' && (
          <View style={styles.greyButtonsView}>
            <TouchableOpacity
              style={styles.changeEmailButton}
              onPress={this.props.handleToEmail}>
              <View>
                <Text style={styles.changeEmailText}>Change Email</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.helpButton}
              onPress={() => {
                Linking.openURL(
                  `mailto:hello@talkjot.co?subject=${helpSubject}`,
                );
              }}>
              <View>
                <Text style={styles.changeEmailText}>Help / Feedback</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.bottom} />
      </ScrollView>
    );
  }
}

//STYLES
const width = '90%';
let buttonHeight;
Platform.OS === 'ios' ? (buttonHeight = 50) : (buttonHeight = 60);
const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  logo: {
    width: 225,
    height: 64,
    marginTop: 32,
    marginBottom: 24,
  },
  greyButtonsView: {
    display: 'flex',
    flexDirection: 'row',
    width: width,
  },
  changeEmailButton: {
    backgroundColor: '#aaaaaadd',
    borderRadius: 5,
    height: buttonHeight - 18,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  helpButton: {
    backgroundColor: '#aaaaaadd',
    borderRadius: 5,
    height: buttonHeight - 18,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  changeEmailText: {
    color: '#000000cc',
    fontSize: 14,
  },
  startButton: {
    backgroundColor: '#bbffbb99',
    height: buttonHeight,
    paddingHorizontal: 15,
    marginBottom: 24,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    width: width,
  },
  stopButton: {
    backgroundColor: '#aa3333bb',
    height: buttonHeight,
    paddingHorizontal: 15,
    marginBottom: 24,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    width: width,
  },
  startText: {
    fontWeight: 'bold',
    color: '#000000cc',
    textAlign: 'center',
    fontSize: 16,
  },
  stopText: {
    fontWeight: 'bold',
    color: '#ffffffcc',
    textAlign: 'center',
    fontSize: 16,
  },
  resultsView: {
    alignItems: 'center',
    width: width,
  },
  yourResultsText: {
    color: '#ffffffbb',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 18,
  },
  results: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 32,
    fontWeight: 'bold',
  },
  fail: {
    color: '#ffffff',
    fontSize: 18,
    marginBottom: 24,
    width: width,
    textAlign: 'center',
  },
  sendEmailButton: {
    backgroundColor: '#aaddff99',
    height: buttonHeight,
    paddingHorizontal: 15,
    marginBottom: 24,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    width: width,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#000000cc',
    textAlign: 'center',
    fontSize: 16,
  },
  bottom: {
    height: 40,
  },
});

export default Record;
