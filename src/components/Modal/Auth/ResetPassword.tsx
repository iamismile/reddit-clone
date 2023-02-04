import React, { useState } from 'react';
import { Button, Flex, Icon, Input, Text } from '@chakra-ui/react';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import { BsDot, BsReddit } from 'react-icons/bs';
import { auth } from '@/firebase/clientApp';
import { useAuthModalActions } from '@/store/useAuthModalStore';

const ResetPassword: React.FC = () => {
  const { setView } = useAuthModalActions();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [sendPasswordResetEmail, loading, error] = useSendPasswordResetEmail(auth);

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await sendPasswordResetEmail(email);
    setSuccess(true);
  };

  return (
    <Flex direction="column" alignItems="center" width="100%">
      <Icon as={BsReddit} color="brand.100" fontSize={40} mb={2} />
      <Text fontWeight={700} mb={2}>
        Reset your password
      </Text>
      {success ? (
        <Text mb={4}>Check your email :)</Text>
      ) : (
        <>
          <Text fontSize="sm" textAlign="center" mb={2}>
            Enter the email associated with your account and we will send you a reset link
          </Text>
          <form onSubmit={onFormSubmit} style={{ width: '100%' }}>
            <Input
              required
              name="email"
              placeholder="email"
              type="email"
              mb={2}
              onChange={(e) => setEmail(e.target.value)}
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
            <Text textAlign="center" fontSize="10pt" color="red">
              {error?.message}
            </Text>
            <Button type="submit" isLoading={loading} width="100%" height="36px" mb={2} mt={2}>
              Reset Password
            </Button>
          </form>
        </>
      )}
      <Flex alignItems="center" fontSize="9pt" color="blue.500" fontWeight={700} cursor="pointer">
        <Text onClick={() => setView('login')}>LOGIN</Text>
        <Icon as={BsDot} />
        <Text onClick={() => setView('signup')}>SIGN UP</Text>
      </Flex>
    </Flex>
  );
};
export default ResetPassword;
