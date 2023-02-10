import { auth, firestore } from '@/firebase/clientApp';
import { FIREBASE_ERRORS } from '@/firebase/error';
import { useAuthModalActions } from '@/store/useAuthModalStore';
import { Button, Flex, Input, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';

const Signup: React.FC = () => {
  const { setView } = useAuthModalActions();
  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [createUserWithEmailAndPassword, userCred, loading, userError] =
    useCreateUserWithEmailAndPassword(auth);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (error) setError('');
    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    createUserWithEmailAndPassword(signupForm.email, signupForm.password);
  };

  const createUserDocument = async (user: User) => {
    const userDocRef = doc(firestore, 'users', user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      providerData: user.providerData,
    });
  };

  useEffect(() => {
    if (userCred) {
      createUserDocument(userCred.user);
    }
  }, [userCred]);

  return (
    <form onSubmit={onFormSubmit}>
      <Input
        type="email"
        placeholder="email"
        name="email"
        required
        onChange={onInputChange}
        mb={2}
        fontSize="10pt"
        _placeholder={{ color: 'gray.500' }}
        _hover={{
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        _focus={{
          outline: 'none',
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        bg="gray.50"
      />
      <Input
        type="password"
        placeholder="password"
        name="password"
        required
        onChange={onInputChange}
        mb={2}
        fontSize="10pt"
        _placeholder={{ color: 'gray.500' }}
        _hover={{
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        _focus={{
          outline: 'none',
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        bg="gray.50"
      />
      <Input
        type="password"
        placeholder="confirm password"
        name="confirmPassword"
        required
        onChange={onInputChange}
        mb={2}
        fontSize="10pt"
        _placeholder={{ color: 'gray.500' }}
        _hover={{
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        _focus={{
          outline: 'none',
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        bg="gray.50"
      />

      <Text fontSize="10pt" textAlign="center" color="red">
        {error || FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}
      </Text>
      <Button type="submit" isLoading={loading} width="100%" height="36px" mt={2} mb={2}>
        Sign Up
      </Button>

      <Flex fontSize="9pt" justify="center">
        <Text mr={1}>Already a redditor?</Text>
        <Text
          color="blue.500"
          fontWeight={700}
          cursor="pointer"
          onClick={() => {
            setView('login');
          }}
        >
          LOG IN
        </Text>
      </Flex>
    </form>
  );
};

export default Signup;
