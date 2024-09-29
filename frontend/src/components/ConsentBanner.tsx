import { useEffect, useReducer } from 'react';
import { Box, Button, Checkbox, Flex, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

// State management using useReducer
const initialState = {
  showCookieConsent: false,
  consentOptions: {
    necessary: true,
    analytics: true,
    preferences: true,
    marketing: true,
  },
  userChangedConsent: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SHOW_BANNER':
      return { ...state, showCookieConsent: true };
    case 'HIDE_BANNER':
      return { ...state, showCookieConsent: false };
    case 'SET_CONSENT_OPTIONS':
      return {
        ...state,
        consentOptions: action.payload,
        userChangedConsent: true,
      };
    default:
      return state;
  }
};

const CookieConsentBanner = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  useEffect(() => {
    const storedConsent = localStorage.getItem('consentMode');
    if (!storedConsent) {
      dispatch({ type: 'SHOW_BANNER' });
    }
  }, []);

  const handleAcceptAll = () => {
    const consent = {
      necessary: true,
      analytics: state.userChangedConsent
        ? state.consentOptions.analytics
        : true,
      preferences: state.userChangedConsent
        ? state.consentOptions.preferences
        : true,
      marketing: state.userChangedConsent
        ? state.consentOptions.marketing
        : true,
    };
    setConsentMode(consent);
    dispatch({ type: 'HIDE_BANNER' });
  };

  const handleRejectAll = () => {
    const consent = {
      necessary: true,
      analytics: false,
      preferences: false,
      marketing: false,
    };
    setConsentMode(consent);
    dispatch({ type: 'HIDE_BANNER' });
  };

  const handleConsentChange = (option) => {
    dispatch({
      type: 'SET_CONSENT_OPTIONS',
      payload: {
        ...state.consentOptions,
        [option]: !state.consentOptions[option],
      },
    });
  };

  const setConsentMode = (consent) => {
    const consentMode = {
      functionality_storage: consent.necessary ? 'granted' : 'denied',
      analytics_storage: consent.analytics ? 'granted' : 'denied',
      preferences_storage: consent.preferences ? 'granted' : 'denied',
      marketing_storage: consent.marketing ? 'granted' : 'denied',
    };
    localStorage.setItem('consentMode', JSON.stringify(consentMode));
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'consentUpdate', consent: consentMode });
  };

  if (!state.showCookieConsent) return null;

  const handleGoPolicy = () => {
    navigate('/cookie-policy');
  };

  return (
    <Box
      position="fixed"
      left="0"
      bottom="0"
      width="100%"
      bg="gray.900"
      color="white"
      py={6}
      px={4}
      zIndex={50}
      fontFamily="mono"
      boxShadow="0 4px 15px rgba(0, 0, 0, 0.3)"
      borderTop="4px solid #E86044"
    >
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        justify="space-between"
        align="start"
        className="p-4"
      >
        <Box mb={{ base: 4, lg: 0 }} textAlign={{ base: 'center', lg: 'left' }}>
          <Text fontSize="2xl" fontWeight="bold" mb={1}>
            Cookie Settings
          </Text>
          <Text fontSize="md" lineHeight="1.6">
            We use cookies to enhance your experience, analyze traffic, and for
            marketing purposes. You can choose your preferences. For more
            details, see our{' '}
            <Text
              as="span"
              textDecoration="underline"
              color="orange.400"
              _hover={{
                textDecoration: 'none',
                color: 'orange.300',
                cursor: 'pointer',
              }}
              onClick={handleGoPolicy}
            >
              Cookie Policy
            </Text>
            .
          </Text>
        </Box>

        <Flex
          direction="column"
          gap={4}
          mt={{ base: 4, lg: 0 }}
          alignItems={{ base: 'center', lg: 'flex-start' }}
        >
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            gap={2}
            alignItems="left"
          >
            <Checkbox
              isChecked={state.consentOptions.analytics}
              onChange={() => handleConsentChange('analytics')}
              fontFamily="mono"
              colorScheme="orange"
              size="lg"
            >
              Analytics
            </Checkbox>
            <Checkbox
              isChecked={state.consentOptions.preferences}
              onChange={() => handleConsentChange('preferences')}
              fontFamily="mono"
              colorScheme="orange"
              size="lg"
            >
              Preferences
            </Checkbox>
            <Checkbox
              isChecked={state.consentOptions.marketing}
              onChange={() => handleConsentChange('marketing')}
              fontFamily="mono"
              colorScheme="orange"
              size="lg"
            >
              Marketing
            </Checkbox>
          </Flex>

          <Flex
            direction={{ base: 'column', lg: 'row' }}
            gap={4}
            mt={4}
            alignItems="center"
          >
            <Button
              bg="orange.600"
              _hover={{
                bg: 'orange.700',
                transform: 'scale(1.05)',
                transition: 'all 0.2s',
              }}
              color="white"
              px={6}
              py={2}
              borderRadius="lg"
              onClick={handleAcceptAll}
              fontFamily="mono"
              fontWeight="bold"
              boxShadow="0 2px 10px rgba(0, 0, 0, 0.2)"
            >
              {state.userChangedConsent ? 'Save Changes' : 'Accept All'}
            </Button>
            <Button
              bg="red.600"
              _hover={{
                bg: 'red.700',
                transform: 'scale(1.05)',
                transition: 'all 0.2s',
              }}
              color="white"
              px={6}
              py={2}
              borderRadius="lg"
              onClick={handleRejectAll}
              fontFamily="mono"
              fontWeight="bold"
              boxShadow="0 2px 10px rgba(0, 0, 0, 0.2)"
            >
              Reject All
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default CookieConsentBanner;
