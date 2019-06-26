import React, {Component} from 'react';
import {Button, TextInput, StyleSheet, Text, View} from 'react-native';
import { Auth } from 'aws-amplify'

const INPUT = { height: 35, width: 200, backgroundColor: '#ddd', marginBottom: 10 }

class App extends Component {
  state = {
    loading: true, confirmationCode: '', username: '', password: '', email: '', formState: 'signUp'
  }
  componentDidMount() {
    Auth.currentAuthenticatedUser()
      .then(userInfo => {
        this.setState({ formState: 'signedIn', loading: false })
      })
      .catch(err => {
        this.setState({ formState: 'signUp', loading: false })
      });
  }
  onChange = (key, value) => { this.setState({ [key]: value })}
  signUp = () => {
    const { username,password, email } = this.state
    Auth.signUp({
      username,
      password,
      attributes: {
        email
      }
      })
      .then(data => {
        console.log("Success: ", data)
        this.setState({ formState: 'confirmSignUp' })
      })
      .catch(err => console.log(err));
  }
  confirmSignUp = () => {
    const { username, confirmationCode } = this.state
    Auth.confirmSignUp(username, confirmationCode)
      .then(data => {
        console.log('successfully confirmed sign up')
        this.setState({ formState: 'signIn' })
      })
      .catch(err => console.log(err));
  }
  signIn = () => {
    const { username, password } = this.state
    Auth.signIn(username, password)
      .then(user => {
        console.log('user: ', user)
        this.setState({ formState: 'signedIn' })
      })
      .catch(err => console.log(err));
  }
  showSignIn = () => {
    this.setState({ formState: 'signIn' })
  }
  render() {
    const { formState, loading } = this.state
    if (loading) return <Text>Loading...</Text>
    return (
      <View style={styles.container}>
        {
           formState === 'signedIn' && (
            <Text style={{marginTop: 100}}>Hello World</Text>
           )
        }
        {
          formState === 'signIn' && (
            <View>
              <Text>Hello from sign in</Text>
              <TextInput
                style={INPUT}
                placeholder='username'
                onChangeText={val => this.onChange('username', val)}
              />
              <TextInput
                secureTextEntry={true}
                style={INPUT}
                placeholder='password'
                onChangeText={val => this.onChange('password', val)}
              />
              <Button
                title="Sign In" onPress={this.signIn}
              />
            </View>
          )
        }
        {
          formState === 'signUp' && (
            <View>
              <TextInput
                style={INPUT}
                placeholder='username'
                onChangeText={val => this.onChange('username', val)}
              />
              <TextInput
                style={INPUT}
                placeholder='email'
                onChangeText={val => this.onChange('email', val)}
              />
              <TextInput
                secureTextEntry={true}
                style={INPUT}
                placeholder='password'
                onChangeText={val => this.onChange('password', val)}
              />
              <Button
                title="Sign Up" onPress={this.signUp}
              />
            </View>
          )
        }
        {
          formState === 'confirmSignUp' && (
            <View>
              <TextInput
                style={INPUT}
                placeholder='confirmationCode'
                onChangeText={val => this.onChange('confirmationCode', val)}
              />
              <Button
                title="Confirm Sign Up" onPress={this.confirmSignUp}
              />
            </View>
          )
        }
        <Button
          title="Show Sign In" onPress={this.showSignIn}
        />
        <Button
          title="Sign Out" onPress={() => {
            Auth.signOut()
            this.setState({ formState: 'signIn' })
          }}
        />
      </View>
    );
  }
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
