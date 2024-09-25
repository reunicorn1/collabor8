import { useCreateProjectShareMutation } from '@store/services/projectShare';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Skeleton } from '@chakra-ui/react';
import SignUp from '@components/Modals/SignUp';
import SignIn from '@components/Modals/SignIn';
import { useAppDispatch } from '../hooks/useApp';
import { setUserDetails } from '@store/slices/userSlice';

type AccessLevel = 'write' | 'read';

function InviteGuest() {
  const [createShareProj, { isLoading: isLoadingMPS, isSuccess }] =
    useCreateProjectShareMutation();
  const [isSignOpen, setIsSignOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const inviteeEmail = params.get('invitee_email');
  const accessLevel = params.get('access_level') as AccessLevel;
  const _id = params.get('_id');
  const projectId = params.get('project_id');
  const hasAccount = params.get('has_account'); // this could be 'username', 'guest' or null

  useEffect(() => {
    if (accessLevel && inviteeEmail) {
      if (hasAccount !== 'null') {
        setIsSignOpen(true);
      } else {
        setIsRegisterOpen(true);
      }
    }
  }, [accessLevel, inviteeEmail, hasAccount]);

  if (!inviteeEmail || !accessLevel) {
    return null;
  }

  const handleSignUpSuccess = async (data: { user: { username: string } }) => {
    dispatch(setUserDetails(data.user));
    try {
      await createShareProj({
        project_id: projectId,
        username: data.user.username,
        access_level: accessLevel,
      }).unwrap();

      navigate(`/editor/${_id}`);
      setIsRegisterOpen(false);
    } catch (err) {
      console.error('Error creating project share:', err);
    }
  };

  const handleSignInSuccess = () => {
    navigate(`/editor/${_id}`);
    setIsSignOpen(false);
  };

  return (
    <Skeleton isLoaded={!isLoadingMPS}>
      <Container>
        <SignUp
          is_invited
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          onSuccess={handleSignUpSuccess}
        />
        <SignIn
          is_invited
          isOpen={isSignOpen}
          onClose={() => setIsSignOpen(false)}
          onSuccess={handleSignInSuccess}
        />
      </Container>
    </Skeleton>
  );
}

export default InviteGuest;
