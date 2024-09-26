import {
  useGetGuestIPQuery,
  useLazyGetGuestProjectQuery,
  useLoginGuestMutation,
} from '@store/services/auth';
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { useCreateProjectShareMutation } from '@store/services/projectShare';

type Props = {
  className?: string;
  _redirect?: string; // Redirect to a specific project when is invited as guest by link share
  access_level?: 'write' | 'read';
  [k: string]: any;
};
export default function CallToAction({ _redirect = '', access_level = 'write', className = '', ...rest }: Props) {
  const { data } = useGetGuestIPQuery();
  const [getProject, { isLoading: projectLoading }] = useLazyGetGuestProjectQuery();
  const [createProjectShare, { isLoading: PSLoading }] = useCreateProjectShareMutation();
  const [loginGuest, { isLoading: loginLoading }] = useLoginGuestMutation();
  const navigate = useNavigate();

  const handleTryItOut = async () => {
    console.log('Trying it out');

    loginGuest().then(async (res) => {
      const { redirect } = await getProject({ IP: data?.ip }).unwrap();
      localStorage.setItem('project_id', redirect);

      if (_redirect) {
        createProjectShare({ project_id: _redirect, access_level, username: 'guest' })
          .unwrap()
          .then(() => {
            navigate(`/editor/${_redirect}`);
          })
          .catch((err) => {
            console.log({ err });
          });
        return;
      }
      //console.log('Project created for guest:', project);
      navigate(`/editor/${redirect}`);
    });
  };

  return (
    <Button
      isLoading={projectLoading || loginLoading}
      onClick={handleTryItOut}
      textTransform='uppercase'
      className={className}
      rightIcon={
        <ChevronRightIcon
          className='animate-bounce_r'
          boxSize={10}
        />
      }
      {...rest}
      _hover={{
        bg: 'transparent',
        color: 'white',
        transform: 'scale(0.95)',
      }}
      _active={{
        bg: 'transparent',
        color: 'white',
        transform: 'scale(0.95)',
      }}
    >
      Try it out!
    </Button>
  );
}
