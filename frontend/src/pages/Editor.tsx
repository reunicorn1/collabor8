import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Grid, GridItem, Box, Text, Divider, useToast } from '@chakra-ui/react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
// import FileTree from '../components/FileTree/FileTree';
import { EditorProvider } from '../context/EditorContext';
import CodeEditor from '../components/CodeEditor/CodeEditor';
import Shares from '../components/Bars/Shares';
import MenuBar from '../components/Bars/MenuBar';
import Tree from '../components/FileTree/Tree';
import * as Y from 'yjs';
import { useGetProjectByIdQuery } from '@store/services/project';
import React from 'react';
import { Mapped } from '../components/Audio/Modal';
import NotFoundPage from './404_page';
import ThemedLoader from '../utils/Spinner';
// retrieve project name from state of navigate eg.
//  navigate(`/editor/${id}`, { state: { project_name } });
//

const ydoc = new Y.Doc();

export default function Editor() {
  // The only thing to fix my issues is to avoid using context and use direct passing instead

  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<any>(null); // State to hold project data
  const projectRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  // Fetch the project data based on the ID
  const {
    data,
    refetch,
    error: fetchError,
  } = useGetProjectByIdQuery(
    projectId! && typeof projectId == 'string' ? projectId : '',
    { refetchOnReconnect: true },
  );

  useEffect(() => {
    if (fetchError && 'status' in fetchError && fetchError.status === 404) {
      setError('Project not found');
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
  }, [fetchError, navigate, toast]);

  useEffect(() => {
    if (location.state) {
      setProject(location.state);
    } else if (projectId) {
      refetch();
    }
  }, [location.state, projectId, refetch]);

  useEffect(() => {
    if (data) {
      setProject(data);
      projectRef.current = data;
    }
  }, [data]);

  if (error) {
    return <NotFoundPage />;
  }

  if (!project) {
    return <ThemedLoader />;
  }

  return (
    <EditorProvider>
      <Grid templateColumns="1fr 20fr" h="100vh">
        {/* First Section */}
        <GridItem
          background="linear-gradient(to bottom, #001845, #524175)"
          h="100%"
          borderRight="2px solid #524175"
        >
          <Shares project={project} />
        </GridItem>

        {/* Second Section */}
        <GridItem>
          <Grid templateRows="auto 1fr" h="100%">
            {/* Banner */}
            <GridItem
              bg="brand.900"
              borderBottom="0.5px solid rgba(128, 128, 128, 0.5)"
              p={1}
            >
              <MenuBar />
            </GridItem>

            {/* Content */}
            <GridItem bg="gray.100">
              <PanelGroup direction="horizontal">
                {/* Top Panel Group with horizontal panels */}
                <Panel
                  defaultSize={20}
                  minSize={20}
                  maxSize={50}
                  style={{ overflow: 'scroll' }}
                >
                  {/* <FileTree /> */}
                  <Tree ydoc={ydoc} name={project.project_name} />
                </Panel>
                <PanelResizeHandle
                  style={{
                    backgroundColor: 'grey',
                    width: '1px',
                    opacity: '1',
                  }}
                />
                <Panel>
                  <PanelGroup
                    direction="vertical"
                    style={{
                      minHeight: '100%',
                      maxHeight: '100%',
                      minWidth: '100%',
                      maxWidth: '650px',
                      overflow: 'hidden',
                    }}
                  >
                    <Panel minSize={20}>
                      <CodeEditor project={project} ydoc={ydoc} />
                    </Panel>
                    <PanelResizeHandle
                      style={{ backgroundColor: 'grey', height: '2px' }}
                    />
                  </PanelGroup>
                </Panel>

                {/* Bottom Panel */}
              </PanelGroup>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </EditorProvider>
  );
}
