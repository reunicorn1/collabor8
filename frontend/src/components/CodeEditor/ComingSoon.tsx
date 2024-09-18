import { Box, Heading, IconButton } from '@chakra-ui/react';
import Tree from '@components/FileTree/Tree';
import { CloseIcon } from '@chakra-ui/icons';
import { useEffect, useRef } from 'react';

interface ModalProps {
  project?: Record<string, any>;
  isOpen: boolean;
  onClose: () => void;
}

function ComingSoon({ isOpen, onClose, project }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  // effect to close slide menu when clicked outside
  useEffect(() => {
    const handleClose = (e: MouseEvent) => {
      const isMenuBtn =
        (e.target as HTMLButtonElement).getAttribute('aria-label') === 'slide menu button';

      if (
        ref.current &&
        !isMenuBtn &&
        !ref.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    window.document.addEventListener('click', handleClose);

    // cleanup
    return () => {
      window.document.removeEventListener('click', handleClose);
    };
  });

  return (
    <Box
      ref={ref}
      className={`
    transition
    fixed top-0 bottom-0 z-10 w-3/4 flex flex-col gap-4 bg-[#001845]
    ${isOpen ? 'translate-x-0 shadow-xl shadow-[#524175]' : '-translate-x-full'}
    `}
    >
      <IconButton
        aria-label='close menu'
        onClick={onClose}
        icon={<CloseIcon />}
        variant='unstyled'
        color='white'
        className='absolute top-2 right-2 self-end !rounded-full border border-white'
      />
      <Heading color='brand.100' className='px-4 text-white !font-mono capitalize'>
        file tree
      </Heading>
      <Tree name={project?.project_name} />
    </Box>
  );
}

export default ComingSoon;
