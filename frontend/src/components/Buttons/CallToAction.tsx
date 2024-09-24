import { useGetGuestIPQuery, useLazyTryoutQuery, useLoginGuestMutation, useTryoutMutation } from '@store/services/auth';
import { useCreateProjectMutation } from '@store/services/project';
import {
  Box,
  Flex,
  Button,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@hooks/useApp';
import { setUserDetails } from '@store/slices/userSlice';

export default function CallToAction() {
  const dispatch = useAppDispatch();
  const { data } = useGetGuestIPQuery();
  const [tryout] = useTryoutMutation();
  const [loginGuest] = useLoginGuestMutation();
  const [createProject] = useCreateProjectMutation();
  const [id, setId] = useState('');
  const navigate = useNavigate();

  const handleTryItOut = async () => {
    console.log('Trying it out');
    const { redirect } = await tryout({ IP: data?.ip }).unwrap();
    navigate(`/editor/${redirect}`);

    //loginGuest().then(async (res) => {
    //  const { redirect } = await tryout({ IP: data?.ip }).unwrap();
    //  //console.log('Project created for guest:', project);
    //  navigate(`/editor/${redirect}`);
    //});
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
