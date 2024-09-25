import {
  useGetGuestIPQuery,
  useLazyGetGuestProjectQuery,
  useLoginGuestMutation,
} from '@store/services/auth';
//import { useCreateProjectMutation } from '@store/services/project';
import {
  Flex,
  Button,
} from '@chakra-ui/react';
//import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import { useAppDispatch } from '@hooks/useApp';
//import { setUserDetails } from '@store/slices/userSlice';

export default function CallToAction() {
  const { data } = useGetGuestIPQuery();
  //const dispatch = useAppDispatch();
  const [getProject] = useLazyGetGuestProjectQuery();
  const [loginGuest] = useLoginGuestMutation();
  //const [createProject] = useCreateProjectMutation();
  //const [id, setId] = useState('');
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
    <>
      <Flex
        justifyContent='center'
      >
        <Button
          onClick={handleTryItOut}
          colorScheme='white'
          variant='solid'
          size='lg'
          color='black'
          shadow='md'
          bgColor={'brand.400'}
        >
          Try it out!
        </Button>
      </Flex>
    </>
  );

  /*
   <Link
                    onClick={() => {
                      loginGuest().then(async (res) => {
                        const project = await createProject({ project_name: 'Untitled', description: '' }).unwrap();
                        setId(project._id);
                      }
                      );
                    }}
                    to={`/editor/${id}`}
                  >
  
                    <Heading color="white" fontFamily="mono" ml={5} size="xs">
                      Try it out
                    </Heading>
                  </Link>
  */
}
