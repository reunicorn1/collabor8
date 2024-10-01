import { Box, Heading, IconButton, Image, Stack } from '@chakra-ui/react';
import Tree from '@components/FileTree/Tree';
import { CloseIcon } from '@chakra-ui/icons';
import { useEffect, useRef } from 'react';
import Shares from '@components/Bars/Shares';
import { Project, ProjectShares } from '@types';
import { useFile } from '../../context/EditorContext';

interface ModalProps {
  project?: Project | ProjectShares;
  isOpen: boolean;
  onClose: () => void;
}

function ComingSoon({ isOpen, onClose, project }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { awareness } = useFile();

  // effect to close slide menu when clicked outside
  useEffect(() => {
    const handleClose = (e: MouseEvent) => {
      const isMenuBtn =
        (e.target as HTMLButtonElement).getAttribute('aria-label') ===
        'slide menu button';

      if (
        ref.current &&
        !isMenuBtn &&
        !ref.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    window.document.addEventListener('click', handleClose);
    window.document.addEventListener('touchstart', handleClose);

    // cleanup
    return () => {
      window.document.removeEventListener('click', handleClose);
      window.document.removeEventListener('touchstart', handleClose);
    };
  });

  return (
    <Box
      ref={ref}
      className={`
    transition bg-brand
    fixed top-0 bottom-0 z-10 w-3/4 flex flex-col gap-8 bg-[#001845]
    ${isOpen ? 'translate-x-0 shadow-xl shadow-[#524175]' : '-translate-x-full'}
    `}
    >
      <IconButton
        aria-label="close menu"
        onClick={onClose}
        icon={<CloseIcon />}
        variant="unstyled"
        color="white"
        className="absolute top-2 right-2 self-end"
      />
      <Stack>
        <Heading
          color="brand.100"
          className="px-4 !text-2xl !font-mono capitalize"
        >
          file tree
        </Heading>
        <Tree
          className="max-h-[500px] overflow-auto"
          name={project?.project_name}
        />
      </Stack>
      <Stack>
        <Heading
          color="brand.100"
          className="flex items-center px-4 text-white !font-mono capitalize"
        >
          <span className="text-2xl">collaborators</span>
          <span className="flex justify-center items-center ms-auto size-6 border rounded-full text-sm text-yellow-700 bg-yellow-50 bg-opacity-80">
            {awareness?.length}
          </span>
        </Heading>
        <Shares project={project} />
      </Stack>
      <Stack className="mt-auto p-4 opacity-50">
        <Image src="/logo-bb.png" w="100%" />
      </Stack>
    </Box>
  );
}

export default ComingSoon;
