import { Grid, GridItem, Flex, IconButton, Spacer } from '@chakra-ui/react';
import { MdBuild } from 'react-icons/md';
import { ChatIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

export default function Editor() {
  return (
    <Grid templateColumns="1fr 19fr" h="100vh">
      {/* First Section */}
      <GridItem bg="tomato" h="100%">
        hi
      </GridItem>

      {/* Second Section */}
      <GridItem>
        <Grid templateRows="auto 1fr" h="100%">
          {/* Banner */}
          <GridItem bg="brand.900" p={1}>
            <Flex justifyContent="space-between" alignItems="center">
              <Flex>
                <Button
                  colorScheme="whiteAlpha"
                  color="white"
                  variant="ghost"
                  size="xs"
                >
                  Theme
                </Button>
                <Button
                  colorScheme="whiteAlpha"
                  color="white"
                  variant="ghost"
                  size="xs"
                  ml={10}
                >
                  Language
                </Button>
              </Flex>
              <Spacer />
              <Button
                leftIcon={<MdBuild />}
                size="xs"
                colorScheme="green"
                variant="solid"
              >
                Run
              </Button>
              <IconButton
                isRound={true}
                variant="outline"
                colorScheme="brand"
                aria-label="Done"
                fontSize="12px"
                size="xs"
                icon={<ChatIcon />}
                ml={4}
              />
              <IconButton
                isRound={true}
                variant="outline"
                colorScheme="brand"
                aria-label="Done"
                fontSize="12px"
                size="xs"
                icon={<ArrowRightIcon />}
              />
            </Flex>
          </GridItem>

          {/* Content */}
          <GridItem bg="gray.100">
            <PanelGroup direction="horizontal">
              {/* Top Panel Group with horizontal panels */}
              <Panel defaultSize={20} minSize={20} maxSize={50}>
                file tree
              </Panel>
              <PanelResizeHandle
                style={{ backgroundColor: 'grey', width: '2px' }}
              />
              <Panel>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={25} minSize={20}>
                    Right Panel
                  </Panel>
                  <PanelResizeHandle
                    style={{ backgroundColor: 'grey', height: '2px' }}
                  />
                  <Panel>Left Panel</Panel>
                </PanelGroup>
              </Panel>
              {/* Bottom Panel */}
            </PanelGroup>
          </GridItem>
        </Grid>
      </GridItem>
    </Grid>
  );
}
