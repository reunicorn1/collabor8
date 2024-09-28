//import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Box, useMediaQuery, useToast } from '@chakra-ui/react';
//import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
//import FileTree from '../components/FileTree/FileTree';
import { EditorProvider } from '../context/EditorContext';
import CodeEditor from '../components/CodeEditor/CodeEditor';
//import Shares from '../components/Bars/Shares';
import MenuBar from '../components/Bars/MenuBar';
//import Tree from '../components/FileTree/Tree';
import Console from '../components/Console';
import { useGetProjectByIdQuery } from '@store/services/project';
import NotFoundPage from './404_page';
import ThemedLoader from '../utils/Spinner';
import { useAppSelector } from '@hooks/useApp';
import { selectPanelVisiblity } from '@store/selectors/fileSelectors';
//import { Singleton } from '../constants';
import Shares from '@components/Bars/Shares';
import Tree from '@components/FileTree/Tree';

export default function Editor() {
  const [isLessThan768] = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const toast = useToast();
  const panelVisiblity = useAppSelector(selectPanelVisiblity);

  // Fetch the project data based on the ID
  const { data, isUninitialized, isLoading, error } = useGetProjectByIdQuery(
    projectId! && typeof projectId == 'string' ? projectId : '',
    { refetchOnReconnect: true },
  );

  //console.log('0x01=============>:', {projectId})
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
      setTimeout(() => {
        navigate('/dashboard');
      }, 5000);
    }
  }, [error, navigate, toast]);

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
        className={`
        relative overflow-hidden
        md:grid md:grid-cols-[auto_30%_1fr] md:grid-rows-[auto_auto_1fr]
        lg:grid-cols-[auto_25%_1fr]
        `}
      >
        {!isLessThan768 && (
          <>
            <Shares
              className={`
              flex flex-col max-h-96 overflow-auto bg-brand
              md:max-h-none md:row-span-full md:border-r md:border-purple-900
              `}
              project={data}
            />
            <Tree
              className="flex flex-col row-span-full border-r border-t border-purple-900 md:row-start-2"
              name={data.project_name}
            />
          </>
        )}
        <MenuBar
          className="md:col-start-2 md:-col-end-1 md:row-start-1 md:row-end-2"
          project={data}
        />
        <CodeEditor className="overflow-auto" project={data} />
        <Box className="absolute w-full bottom-0 col-start-3 col-end-4">
          {panelVisiblity && <Console />}
        </Box>
      </Box>
    </EditorProvider>
  );
}
