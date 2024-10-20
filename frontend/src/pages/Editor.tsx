import { Box, useMediaQuery, useToast } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { EditorProvider } from '@context/EditorContext';
import CodeEditor from '@components/CodeEditor/CodeEditor';
import MenuBar from '@components/Bars/MenuBar';
import Console from '@components/Console';
import { useGetProjectByIdQuery } from '@store/services/project';
import NotFoundPage from './404_page';
import ThemedLoader from '@utils/Spinner';
import { useAppDispatch, useAppSelector } from '@hooks/useApp';
import { selectPanelVisibility, selectUserDetails } from '@store/selectors';
import Shares from '@components/Bars/Shares';
import Tree from '@components/FileTree/Tree';
import usePageTitle from '@hooks/useTitle';

// params type for projectId
type EditorParams = {
  projectId: string;
};

export default function Editor() {
  const [isLessThan768] = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { projectId } = useParams<EditorParams>();
  const toast = useToast();
  const panelVisibility = useAppSelector(selectPanelVisibility);
  const userDetails = useAppSelector(selectUserDetails);

  usePageTitle('Editor - Collabor8');

  const {
    data: project,
    isUninitialized,
    isLoading,
    error,
  } = useGetProjectByIdQuery(projectId ?? '', { refetchOnReconnect: true });

  // Handle project fetch errors
  useEffect(() => {
    if (error && 'status' in error && error.status === 404) {
      const errorMessage =
        userDetails?.roles === 'guest'
          ? 'Redirecting you to the homepage...'
          : 'Redirecting you to the dashboard...';

      toast({
        title: 'Project Not Found',
        description: `👨‍💻 The project you are looking for is missing. ${errorMessage}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
        variant: 'subtle',
      });
      if (userDetails?.roles === 'guest') {
        setTimeout(() => navigate('/'), 4000);
      } else {
        setTimeout(() => navigate('/dashboard'), 4000);
      }
    }
  }, [error, navigate, toast, userDetails, dispatch]);

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
              project={project}
            />
            <Tree
              className="flex flex-col row-span-full border-r border-t border-purple-900 md:row-start-2"
              name={project.project_name}
            />
          </>
        )}
        <MenuBar
          className="md:col-start-2 md:-col-end-1 md:row-start-1 md:row-end-2"
          project={project}
        />
        <CodeEditor className="overflow-auto" project={project} />
        <Box className="absolute w-full bottom-0 col-start-3 col-end-4">
          {panelVisibility && <Console />}
        </Box>
      </Box>
    </EditorProvider>
  );
}
