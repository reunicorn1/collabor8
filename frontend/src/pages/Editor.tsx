import { Grid, GridItem, Box, Text, Divider } from '@chakra-ui/react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useParams, useLocation } from 'react-router-dom';
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
// retrieve project name from state of navigate eg.
//  navigate(`/editor/${id}`, { state: { project_name } });
//

const ydoc = new Y.Doc();

export default function Editor() {
  // The only thing to fix my issues is to avoid using context and use direct passing instead

  const [isDragging, setIsDragging] = useState(false);
  const location = useLocation();
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<any>(null); // State to hold project data
  const projectRef = useRef<any>(null);

  // Fetch the project data based on the ID
  const { data, refetch } = useGetProjectByIdQuery(
    projectId! && typeof projectId == 'string' ? projectId : '',
    { refetchOnReconnect: true },
  );

  useEffect(() => {
    // If location.state exists, use it; otherwise, fetch from API
    if (location.state) {
      setProject(location.state);
    } else if (projectId) {
      refetch(); // Refetch if project is not passed in state
    }
  }, [location.state, projectId, refetch]);

  useEffect(() => {
    if (data) {
      setProject(data);
      projectRef.current = data;
    }
  }, [data]);

  if (!project) {
    return <div>Loading...</div>;
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
                <Panel defaultSize={20} minSize={20} maxSize={50}>
                  {/* <FileTree /> */}
                  <Tree ydoc={ydoc} name={project.project_name} />
                </Panel>
                <PanelResizeHandle
                  style={{
                    backgroundColor: isDragging ? 'blue' : 'grey',
                    width: '0.5px',
                    opacity: '1',
                  }}
                  onMouseDown={() => setIsDragging(true)}
                  onMouseUp={() => setIsDragging(false)}
                  onMouseLeave={() => setIsDragging(false)}
                />
                <Panel>
                  <PanelGroup direction="vertical">
                    <Panel minSize={20}>
                      <CodeEditor project={project} ydoc={ydoc} />
                    </Panel>
                    <PanelResizeHandle
                      style={{ backgroundColor: 'grey', height: '2px' }}
                    />
                    <Panel defaultSize={20}>
                      <Box bg="brand.800" h="100%">
                        <Box bg="brand.900">
                          <Text
                            fontSize="xs"
                            color="white"
                            fontFamily="mono"
                            p={3}
                          >
                            Output
                            <Mapped />
                          </Text>
                        </Box>
                        <Divider color="grey" />
                      </Box>
                    </Panel>
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
