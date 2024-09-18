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
          <Panel defaultSize={20} minSize={20} maxSize={50}>
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
            <PanelGroup direction="vertical">
              <Panel>
                <CodeEditor project={project} ydoc={ydoc} />
              </Panel>
              {panelVisiblity && (
                <>
                  <PanelResizeHandle
                    style={{
                      backgroundColor: 'grey', height: '2px',
                      opacity: '1', cursor: 'row-resize', bottom: '0'
                    }}
                  />
                  <Panel className='!overflow-hidden !bottom-0'
                    style={{ minHeight: '100px', maxHeight: '50vh' }}
                  >
                    <Console
                      output={output}
                      setOutput={setOutput}
                      onClose={() => setShowConsole(false)}
                    />
                  </Panel>
                </>
              )}

            </PanelGroup>
          </Panel>
        </PanelGroup>
      </GridItem>
    </Grid>
  </GridItem>
</Grid>
