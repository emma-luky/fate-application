/*
    Author: Felisitas Michella Purnomo
    Reviewed By: Emma Luk
    Date: Summer 2024
    Course:  Seeds

    Description: Allows new users to sign up and sign in.
*/

import { useState } from 'react';
import { Alert, Button } from 'react-native';
import { router, Stack } from 'expo-router';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore/lite';
import { Input, TamaguiProvider, Text } from 'tamagui';

import { SchoolDropdown } from '../components/SchoolDropdown';
import tamaguiConfig from '../config/tamagui.config';
import { db } from '../support/firebase';

/**
 * Renders a form for a user to sign up that has the values that a user object needs
 * @returns new user form to sign up
 */
export default function App() {
  const auth = getAuth();
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    school: '',
  });

  //Once submitted create a new user in auth and in the users' collection
  const onSubmit = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );
      const user = userCredential.user;
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        username: values.username,
        school: values.school,
        email: values.email,
        phoneNumber: values.phoneNumber,
        savedPosts: [],
      });
      Alert.alert('Success', 'User registered successfully!');
      router.replace('/post');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'This email address is already in use.');
      } else {
        Alert.alert('Error signing up');
      }
    }
  };

  return (
    <>
      <TamaguiProvider config={tamaguiConfig}>
      <Stack.Screen options={{ title: 'Sign Up' }} />
        <Text> Username </Text>
        <Input
          onChangeText={(username) =>
            setValues({ ...values, username: username })
          }
          value={values.username}
          autoCapitalize="none"
        />

        <Text> Email </Text>
        <Input
          onChangeText={(email) => setValues({ ...values, email: email })}
          value={values.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <Text> Phone Number </Text>
        <Input
          onChangeText={(phoneNumber) =>
            setValues({ ...values, phoneNumber: phoneNumber })
          }
          value={values.phoneNumber}
          keyboardType="phone-pad"
        />

        <Text> School </Text>
        <SchoolDropdown
          onSchoolSelect={(school) => setValues({ ...values, school: school })}
        />

        <Text> Password </Text>
        <Input
          onChangeText={(password) =>
            setValues({ ...values, password: password })
          }
          value={values.password}
          secureTextEntry
        />

        <Button title="Sign Up" onPress={onSubmit} />
        <Button
          title="Already have an account? Sign In"
          onPress={() => {
            console.log('Switching to Sign up');
            router.replace('/signin');
          }}
        />
      </TamaguiProvider>
    </>
  );
}
