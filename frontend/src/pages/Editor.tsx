import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Grid, GridItem, Box, Text, Divider, useToast } from '@chakra-ui/react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
//import FileTree from '../components/FileTree/FileTree';
import { EditorProvider } from '../context/EditorContext';
import CodeEditor from '../components/CodeEditor/CodeEditor';
//import Shares from '../components/Bars/Shares';
import MenuBar from '../components/Bars/MenuBar';
//import Tree from '../components/FileTree/Tree';
import Console from '../components/Console';
//import * as Y from 'yjs';
import { useGetProjectByIdQuery } from '@store/services/project';
import NotFoundPage from './404_page';
import ThemedLoader from '../utils/Spinner';
import { useAppSelector } from '@hooks/useApp';
import { selectPanelVisiblity } from '@store/selectors/fileSelectors';
import { Singleton } from '../constants';

//const ydoc = new Y.Doc();

export default function Editor() {
  //const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  //const [project, setProject] = useState<any>(null); // State to hold project data
  //const projectRef = useRef<any>(null);
  const toast = useToast();
  const panelVisiblity = useAppSelector(selectPanelVisiblity);

  // Fetch the project data based on the ID
  const {
    data,
    isUninitialized,
    isLoading,
    isSuccess,
    //refetch,
    error,
  } = useGetProjectByIdQuery(
    projectId! && typeof projectId == 'string' ? projectId : '',
    { refetchOnReconnect: true },
  );

  useEffect(() => {
    if (error && 'status' in error && error.status === 404) {
      toast({
        title: 'Project Not Found',
        description:
          '👨‍💻 The project you are looking for is missing. Redirecting you to the dashboard...',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      setTimeout(() => navigate('/dashboard'), 5000);
    }
  }, [error, navigate, toast]);

  //useEffect(() => {
  //  console.log('-----Location State---->: ', location.state);
  //  if (location.state) {
  //    setProject(location.state);
  //  } else if (projectId) {
  //    refetch();
  //  }
  //}, [location.state, projectId, refetch]);

  //useEffect(() => {
  //  console.log('-----Data---->: ', data);
  //  if (data) {
  //    setProject(data);
  //    projectRef.current = data;
  //  }
  //}, [data]);

  if (error) {
    return <NotFoundPage />;
  }

  if (isLoading || isUninitialized) {
    return <ThemedLoader />;
  }

  return (
    <EditorProvider>
      <Box
        bg="brand.900"
        borderBottom="0.5px solid rgba(128, 128, 128, 0.5)"
        className="relative"
      >
        <MenuBar
          isSuccess={isSuccess}
          isLoading={isLoading}
          project={data}
        />
        <CodeEditor project={data} ydoc={Singleton.getYdoc()} />
      </Box>
      <Box className='absolute w-full bottom-0'>
        {panelVisiblity && <Console />}
      </Box>
    </EditorProvider>
  );
}
