import React, { useState } from 'react';
import { Navigate, RouteProps, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAppSelector } from '@hooks/useApp';
import { selectIsAuthenticated, selectUserDetails } from '@store/selectors';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
  Text,
} from '@chakra-ui/react';
import CallToAction from './Buttons/CallToAction';

const ProtectedRoute: React.FC<RouteProps> = ({
  element: Component,
  ...rest
}) => {
  const { isAuthenticated } = useAuth();
  const userDetails = useAppSelector(selectUserDetails);
  const location = useLocation();
  const isGuest = userDetails?.roles === 'guest';
  const mongoIdRegex = new RegExp(('(?<=editor/)[^/]+'));
  const redirect = location.pathname.match(mongoIdRegex);

  if (!isAuthenticated && location.pathname.startsWith('/editor')) {
    return <TryoutModal isOpen={true} redirect={redirect ? redirect[0] : ''} />;
  }

  if (isGuest && !location.pathname.startsWith('/editor')) {
    return (
      <Navigate replace to={`/editor/${localStorage.getItem('project_id')}`} />
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{Component}</>;
};

type Props = {
  isOpen: boolean;
  redirect: string;
};

function TryoutModal({ isOpen: _isOpen, redirect }: Props) {
  const [isOpen, setIsOpen] = useState(_isOpen);
  const navigate = useNavigate();
  const handleClose = () => {
    setIsOpen(false)
    navigate('/');
  }

  console.log('0x00', { isOpen, redirect });
  if (!redirect) {
    // invlid redirect string
    navigate('/');
    return;
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent className='bg-brand'>
        <ModalHeader>Try out</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text className='text-gray-500'>
            Welcome to the Tryout mode! You can play around with the editor and
            share your work with others. But remember to unlock the full features
            you need to sign in.
          </Text>
        </ModalBody>

        <ModalFooter className='bg-slate-50'>
          <Button bg='unset' mr={3} onClick={handleClose}
          >
            cancel
          </Button>
          <CallToAction className='!bg-brand-400' _redirect={redirect} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ProtectedRoute;
