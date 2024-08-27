import { useCreateProjectShareMutation, useLazyInviteGuestQuery } from '@store/services/projectShare';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Skeleton } from '@chakra-ui/react';
import SignUp from '@components/Modals/SignUp';
import SignIn from './Modals/SignIn';
import { useAppDispatch } from '../hooks/useApp';
import { setUserDetails } from '@store/slices/userSlice';

function InviteGuest() {
  //const [invite,
  //  {
  //    isLoading,
  //    isUninitialized,
  //  }] = useLazyInviteGuestQuery();
  const [createShareProj, { isLoading: isLoadingMPS, isSuccess }] = useCreateProjectShareMutation();
  const [isSignOpen, setIsSignOpen] = useState(false);
  const [isRegisterOpen, setIsRegiserOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const parmas = new URLSearchParams(window.location.search);
  const invitee_email = parmas.get('invitee_email')!;
  const access_level = parmas.get('access_level') as 'write' | 'read';
  const project_id = parmas.get('project_id');
  const has_account = parmas.get('has_account'); // this username/guest or null

  useEffect(() => {
    console.log('%c------effect----------->', 'background: purple;color:white', { access_level, invitee_email })
    if (access_level && invitee_email) {
      if (has_account !== 'null') {
        setIsSignOpen(true);
      } else {
        setIsRegiserOpen(true);
      }
    }
  }, [])

  if (!invitee_email || !access_level) {
    return null;
  }

  return (
    <Skeleton size="lg">
      <Container>
        <SignUp
          is_invited
          isOpen={isRegisterOpen}
          onClose={() => setIsRegiserOpen(false)}
          onSuccess={async (data: any) => {
            // forward user to editor/:project_id
            // ajax create share-projects
            dispatch(setUserDetails(data.user));
            return createShareProj({
              project_id,
              username: data.user.username,
              access_level,
            })
              .unwrap()
              .then(data => {
                console.log('%c------signup----------->', 'background: purple;color:white');
                console.log('----------------------->', { data });
                navigate(`/editor/${project_id}`);
                setIsRegiserOpen(false);
              })
              .catch(err => console.log({ err }))
          }}
        />
        <SignIn
          is_invited
          isOpen={isSignOpen}
          onClose={() => setIsSignOpen(false)}
          onSuccess={() => {
            console.log('%c---------signin-------->', 'background: purple;color:white')
            navigate(`/editor/${project_id}`);
            //setIsSignOpen(false)
          }}
        />
      </Container>
    </Skeleton>
  );
}

export default InviteGuest;
