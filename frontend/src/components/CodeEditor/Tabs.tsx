import { Box, Text, Image, Spacer, CloseButton } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { LanguageCode } from '@utils/codeExamples';
import { useFile } from '@context/EditorContext';
import { FileType } from '@context/EditorContext';
import { setFile, clearFile } from '@store/slices/fileSlice';
import { useDispatch } from 'react-redux';

export default function Tabs() {
  const tabRef = useRef<HTMLDivElement>(null);
  const [tabslist, setTabsList] = useState<FileType[]>([]);
  const { fileSelected, setFileSelected } = useFile()!;
  const dispatch = useDispatch();
  const languageModes: Record<LanguageCode, string> = {
    javascript: 'javascript.png',
    python: 'python.png',
    c: 'c.png',
    typescript: 'typescript.png',
    markdown: 'markdown.png',
    html: 'html.png',
    unknown: 'unknown.png',
  };

  useEffect(() => {
    if (!fileSelected) return;
    const foundTab = tabslist.find((tab) => tab.id === fileSelected.id);
    if (!foundTab) {
      setTabsList([...tabslist, fileSelected]);
    } else {
      setFileSelected(foundTab);
      dispatch(setFile({ file_id: foundTab.id, language: foundTab.language }));
    }
  }, [fileSelected, setFileSelected, tabslist]);

  const handleClick = (file: FileType) => {
    console.log(tabslist);
    setFileSelected(file);
    dispatch(setFile({ file_id: file.id, language: file.language }));
    // TODO: create a state for the selected file that includes language
    // TODO: Create service to execute code
    // {
    //   fileId filex
    // language
    // }
  };

  const handleClose = (file: FileType, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedFile = tabslist.filter((tab) => tab.id !== file.id);
    setTabsList(updatedFile);
    if (updatedFile.length > 0) {
      const file = updatedFile[updatedFile.length - 1];
      setFileSelected(file);
      dispatch(setFile({ file_id: file.id, language: file.language }));
    } else {
      setFileSelected(null); // type error -_-
      dispatch(clearFile());
    }
  };

  // effects to insert css rules for the editor height
  // on each render of the component
  useEffect(() => {
    const styleElement = document.createElement('style');
    document.head.appendChild(styleElement);
    const styleSheet = styleElement.sheet;

    // If there is a tab, set the height of the editor to the height of the window minus
    // the height of the menubar and the height of the tab bar
    if (tabRef.current) {
      styleSheet.insertRule(
        `.CodeMirror { min-height: calc(100vh - var(--menubar-height) - ${tabRef.current.clientHeight}px - 6px); }`,
        styleSheet.cssRules.length,
      );
    } else {
      styleSheet.insertRule(
        `.CodeMirror { min-height: calc(100vh - var(--menubar-height) - 3px); }`,
        styleSheet.cssRules.length,
      );
    }
  });

  return (
    <>
      <Box
        bg="brand.900"
        borderBottom="2px solid #524175"
        className="flex overflow-x-auto"
      >
        {tabslist.map((file) => (
          <Box
            ref={tabRef}
            key={file.id}
            bg="brand.900"
            className="py-2 flex cursor-pointer shrink-0"
            onClick={() => handleClick(file)}
            borderTop={
              fileSelected && fileSelected.id === file.id
                ? '2px solid yellow'
                : '0.5px solid rgba(128, 128, 128, 0.5)'
            }
            borderRight="0.5px solid rgba(128, 128, 128, 0.5)"
            borderBottom="0.5px solid rgba(128, 128, 128, 0.5)"
            borderLeft="0.5px solid rgba(128, 128, 128, 0.5)"
            alignContent="center"
            alignItems="center"
            overflow="hidden"
            textOverflow="ellipsis"
            pl={6}
          >
            <Image
              src={`/lang-logo/${languageModes[file.language as LanguageCode] || 'unknown.png'}`}
              boxSize="15px"
              mr={2}
            />
            <Text color="white" fontSize="xs" fontFamily="mono">
              {file.name}
            </Text>
            <Spacer />

            <CloseButton
              color="white"
              size="sm"
              _hover={{ bg: '#323232', color: 'white' }}
              mr={2}
              onClick={(e) => handleClose(file, e)}
            />
          </Box>
        ))}
      </Box>
    </>
  );
}
