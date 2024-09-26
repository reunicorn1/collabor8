import {
  useGetGuestIPQuery,
  useLazyGetGuestProjectQuery,
  useLoginGuestMutation,
} from '@store/services/auth';
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ChevronRightIcon } from '@chakra-ui/icons';

type Props = {
  className?: string;
  [k: string]: any;
};
export default function CallToAction({ className = '', ...rest }: Props) {
  const { data } = useGetGuestIPQuery();
  const [getProject, { isLoading: projectLoading }] = useLazyGetGuestProjectQuery();
  const [loginGuest, { isLoading: loginLoading }] = useLoginGuestMutation();
  const navigate = useNavigate();

  const handleTryItOut = async () => {
    console.log('Trying it out');

    loginGuest().then(async (res) => {
      const { redirect } = await getProject({ IP: data?.ip }).unwrap();
      localStorage.setItem('project_id', redirect);
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
      rightIcon={<ChevronRightIcon className="animate-bounce_r" boxSize={8} />}
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
