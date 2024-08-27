import { useCreateProjectShareMutation, useLazyInviteGuestQuery } from '@store/services/projectShare';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Skeleton } from '@chakra-ui/react';
import SignUp from '@components/Modals/SignUp';
import SignIn from './Modals/SignIn';

function InviteGuest() {
  const [invite,
    {
      isLoading,
      isUninitialized,
    }] = useLazyInviteGuestQuery();
  const [createShareProj, { isLoading: isLoadingMPS, isSuccess }] = useCreateProjectShareMutation();
  const [isSignOpen, setIsSignOpen] = useState(false);
  const [isRegisterOpen, setIsRegiserOpen] = useState(false);
  const navigate = useNavigate();
  const parmas = new URLSearchParams(window.location.search);
  const invitee_email = parmas.get('invitee_email')!;
  const access_level = parmas.get('access_level') as 'write' | 'read';
  const project_id = parmas.get('project_id');

  useEffect(() => {
    console.log('%c------signup----------->', 'background: purple;color:white', { access_level, invitee_email })
    if (access_level && invitee_email) {
      invite({ invitee_email, access_level, project_id })
        .unwrap()
        .then(data => {
          console.log('%c------signup----------->', 'background: purple;color:white', { data })
          if (data.has_account && !isSignOpen) {
            setIsSignOpen(true);
          } else {
            setIsRegiserOpen(true);
          }
        })
        .catch(err => console.log({ err }))
    }
  }, [access_level, project_id])

  if (!invitee_email || !access_level) {
    return null;
  }

  return (
    <Skeleton size="lg" isLoaded={isUninitialized || !isLoading}>
      <Container>
        <SignUp
          isOpen={isRegisterOpen}
          onClose={() => setIsRegiserOpen(false)}
          onSuccess={async (data: any) => {
            // forward user to editor/:project_id
            // ajax create share-projects
            return createShareProj({
              project_id,
              username: data.username,
              access_level,
            })
              .unwrap()
              .then(data => {
                console.log('%c------signup----------->', 'background: purple;color:white')
                console.log('----------------------->', { data })
                //navigate(`editor/${project_id}`);
                //setIsRegiserOpen(false);
              })
              .catch(err => console.log({ err }))
          }}
        />
        <SignIn
          isOpen={isSignOpen}
          onClose={() => setIsSignOpen(false)}
          onSuccess={() => {
            console.log('%c---------signin-------->', 'background: purple;color:white')
            navigate({ pathname: `/editor/${project_id}` });
            //setIsSignOpen(false)
          }}
        />
      </Container>
    </Skeleton>
  );
}

export default InviteGuest;
