import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVerifyEmailMutation } from '@store/services/auth';
import { useAppDispatch } from '../hooks/useApp';
import { setCredentials } from '@store/slices/authSlice';
import { Skeleton, useToast } from '@chakra-ui/react';
import { setUserDetails } from '@store/slices/userSlice';

function Verify() {
  // extarct the query from url
  const navigate = useNavigate();
  const toast = useToast();
  const [verify, { isLoading, isUninitialized }] = useVerifyEmailMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const parmas = new URLSearchParams(window.location.search);
    const token = parmas.get('token')!;
    //    console.log('-----token------>', { token });
    verify({ token })
      .unwrap()
      .then((data) => {
        console.log('------verify--------->', { data });
        toast({
          title: 'Verification',
          description: 'your account has been verified',
          status: 'success',
          variant: 'subtle',
          position: 'bottom',
        });
        dispatch(setCredentials({ accessToken: token }));
        dispatch(setUserDetails(data));
        navigate('/dashboard');
      })
      .catch((err) => {
        console.log('--------------->', 'background: red', { err: err.data });
        toast({
          title: 'Verification',
          description: 'your account has not been veified, please try again',
          status: 'error',
          variant: 'subtle',
          position: 'bottom',
        });
      })
      .finally(() => {
        console.log('%c------------resolved------------->', 'background:green');
      });
  }, [isUninitialized]);

  return <Skeleton size="lg" isLoaded={isUninitialized || !isLoading} />;
}

export default Verify;
