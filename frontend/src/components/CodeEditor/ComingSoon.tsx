import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  Flex,
  DrawerCloseButton,
  Box,
  Center,
  Text,
  Heading,
} from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ComingSoon({ isOpen, onClose }: ModalProps) {
  return (
    <>
      <Drawer onClose={onClose} isOpen={isOpen} size="xs">
        <DrawerOverlay />
        <DrawerContent bg="brand.100">
          <DrawerCloseButton color="white" />
          <DrawerBody>
            <Flex
              justifyContent="center"
              alignItems="center"
              textAlign="center"
              pt={40}
            >
              <Box>
                <Center>
                  <FaGithub fontSize="200px" opacity="0.3" color="white" />
                </Center>
                <Heading
                  mt={7}
                  fontFamily="mono"
                  fontSize="xl"
                  color="white"
                  p={5}
                  opacity="0.6"
                >
                  Version Control is Coming Soon..
                </Heading>
              </Box>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
