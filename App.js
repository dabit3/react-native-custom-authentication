import React, {useReducer, useEffect} from 'react';
import {Button, TextInput, StyleSheet, Text, View} from 'react-native';
import { Auth } from 'aws-amplify'

const INPUT = { height: 35, width: 200, backgroundColor: '#ddd', marginBottom: 10 }
const initialState = {
  loading: true, confirmationCode: '', username: '', password: '', email: '', formState: 'signUp'
}

function reducer(state, action) {
  switch(action.type) {
    case 'SET_INPUT':
      return { ...state, [action.name]: action.value}
    case 'SET_FORM_STATE':
      return { ...state, loading: false, formState: action.formState }
    default:
      return state
  }
}
function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(userInfo => dispatch({ type: 'SET_FORM_STATE', formState: 'signedIn' }))
      .catch(err => dispatch({ type: 'SET_FORM_STATE', formState: 'signUp' }))
  }, [])
  function onChange (name, value) {
    dispatch({ type: 'SET_INPUT', name, value })
  }
  function signUp() {
    const { username,password, email } = state
    Auth.signUp({ username, password, attributes: { email } })
      .then(data => {
        dispatch({ type: 'SET_FORM_STATE', formState: 'confirmSignUp' })
      })
      .catch(err => console.log(err));
  }
  function confirmSignUp() {
    const { username, confirmationCode } = state
    Auth.confirmSignUp(username, confirmationCode)
      .then(data => {
        console.log('successfully confirmed sign up')
        dispatch({ type: 'SET_FORM_STATE', formState: 'signIn' })
      })
      .catch(err => console.log(err));
  }
  function signIn()  {
    const { username, password } = state
    Auth.signIn(username, password)
      .then(user => {
        console.log('user: ', user)
        dispatch({ type: 'SET_FORM_STATE', formState: 'signedIn' })
      })
      .catch(err => console.log(err));
  }
  showSignIn = () => {
    dispatch({ type: 'SET_FORM_STATE', formState: 'signIn' })
  }
  const { formState, loading } = state
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
              onChangeText={val => onChange('username', val)}
            />
            <TextInput
              secureTextEntry={true}
              style={INPUT}
              placeholder='password'
              onChangeText={val => onChange('password', val)}
            />
            <Button
              title="Sign In" onPress={signIn}
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
              onChangeText={val => onChange('username', val)}
            />
            <TextInput
              style={INPUT}
              placeholder='email'
              onChangeText={val => onChange('email', val)}
            />
            <TextInput
              secureTextEntry={true}
              style={INPUT}
              placeholder='password'
              onChangeText={val => onChange('password', val)}
            />
            <Button
              title="Sign Up" onPress={signUp}
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
              onChangeText={val => onChange('confirmationCode', val)}
            />
            <Button
              title="Confirm Sign Up" onPress={confirmSignUp}
            />
          </View>
        )
      }
      <Button
        title="Show Sign In" onPress={showSignIn}
      />
      <Button
        title="Sign Out" onPress={() => {
          Auth.signOut()
          setState({ formState: 'signIn' })
        }}
      />
    </View>
  );
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