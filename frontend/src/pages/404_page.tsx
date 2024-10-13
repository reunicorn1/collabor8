import {
  Box,
  Heading,
  Text,
  Link,
  usePrefersReducedMotion,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import usePageTitle from '@hooks/useTitle';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();
  usePageTitle('404 - Page Not Found');

  // Keyframes for the scanning animation
  const scanAnimation = keyframes`
    0% { background-position: 0 -100vh; }
    35%, 100% { background-position: 0 100vh; }
  `;

  const animation = prefersReducedMotion
    ? undefined
    : `${scanAnimation} 7.5s linear infinite`;

  return (
    <Box
      position="relative"
      bg="#001845"
      color="#E6E85C"
      fontFamily="mono"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      textTransform="uppercase"
      overflow="hidden"
    >
      {/* Background noise effect */}
      <Box
        position="absolute"
        width="100%"
        height="100%"
        backgroundImage="url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')"
        backgroundSize="cover"
        zIndex={-2}
        opacity={0.02}
      />
      {/* Scanning line overlay effect */}
      <Box
        position="absolute"
        width="100%"
        height="100%"
        background="repeating-linear-gradient(180deg, transparent 0, rgba(0, 0, 0, 0.3) 50%, transparent 100%)"
        backgroundSize="auto 4px"
        zIndex={1}
        _before={{
          content: `""`,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          backgroundImage:
            'linear-gradient(0deg, transparent 0%, rgba(32, 128, 32, 0.2) 2%, rgba(32, 128, 32, 0.8) 3%, rgba(32, 128, 32, 0.2) 3%, transparent 100%)',
          backgroundRepeat: 'no-repeat',
          animation: animation,
        }}
      />
      {/* Main content */}
      <Box zIndex={2} p={6} maxWidth="600px">
        <Heading as="h1" size="2xl" color="#E86044" mb={4}>
          Error 404
        </Heading>
        <Text className="output" fontSize="lg" mb={4} color="#E86044">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </Text>
        <Text
          className="output"
          fontSize="lg"
          mb={4}
          color="#E86044"
          _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
          onClick={() => navigate(-1)}
        >
          Go back
        </Text>
        <Text className="output" fontSize="lg" mb={4} color="#E86044">
          or{' '}
          <Link href="/" color="#6BE3E1">
            Return to the homepage
          </Link>
          .
        </Text>
        <Text className="output" fontSize="lg" color="#E86044">
          Good luck.
        </Text>
      </Box>
    </Box>
  );
}
