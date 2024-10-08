import { useEffect } from 'react';
import { Box, Button, Checkbox, Flex, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@hooks/useApp';
import {
  showBanner,
  hideBanner,
  updateConsentOptions,
  setConsentMode,
} from '@store/slices/cookieConsentSlice';
import {
  selectShowCookieConsent,
  selectConsentOptions,
  selectUserChangedConsent,
} from '@store/selectors';

const CookieConsentBanner = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const showCookieConsent = useAppSelector(selectShowCookieConsent);
  const consentOptions = useAppSelector(selectConsentOptions);
  const userChangedConsent = useAppSelector(selectUserChangedConsent);

  useEffect(() => {
    const storedConsent = localStorage.getItem('consentMode');
    if (!storedConsent) {
      dispatch(showBanner());
    }
  }, [dispatch]);

  const handleAcceptAll = () => {
    const consent = {
      necessary: true,
      analytics: consentOptions.analytics,
      preferences: consentOptions.preferences,
      marketing: consentOptions.marketing,
    };
    dispatch(setConsentMode(consent));
    dispatch(hideBanner());
  };

  const handleRejectAll = () => {
    const consent = {
      necessary: true,
      analytics: false,
      preferences: false,
      marketing: false,
    };
    dispatch(setConsentMode(consent));
    dispatch(hideBanner());
  };

  const handleConsentChange = (option: keyof typeof consentOptions) => {
    dispatch(
      updateConsentOptions({
        [option]: !consentOptions[option],
      }),
    );
  };

  const handleGoPolicy = () => {
    navigate('/cookie-policy');
  };

  if (!showCookieConsent) return null;

  return (
    <Box
      position="fixed"
      left="0"
      bottom="0"
      width="100%"
      bg="gray.900"
      color="white"
      py={6}
      zIndex={50}
      fontFamily="mono"
      boxShadow="0 4px 15px rgba(0, 0, 0, 0.3)"
      borderTop="4px solid #E86044"
    >
      <Flex gap="4" direction="column">
        <Flex alignItems="center" flexDir="column" gap="2">
          <Text fontSize="2xl" fontWeight="bold">
            Cookie Settings
          </Text>
          <Text
            w="min(700px,100%)"
            textAlign="justify"
            className="text-last-center"
          >
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
        </Flex>

        {/* CHECKBOXES */}
        <Flex justifyContent="center" flexWrap="wrap" gap={3}>
          <Checkbox
            isChecked={consentOptions.analytics}
            onChange={() => handleConsentChange('analytics')}
            fontFamily="mono"
            colorScheme="orange"
          >
            Analytics
          </Checkbox>
          <Checkbox
            isChecked={consentOptions.preferences}
            onChange={() => handleConsentChange('preferences')}
            fontFamily="mono"
            colorScheme="orange"
          >
            Preferences
          </Checkbox>
          <Checkbox
            isChecked={consentOptions.marketing}
            onChange={() => handleConsentChange('marketing')}
            fontFamily="mono"
            colorScheme="orange"
          >
            Marketing
          </Checkbox>
        </Flex>

        {/* ACTION BUTTONS */}
        <Flex gap="3" justifyContent="center">
          <Button
            bg="orange.600"
            _hover={{
              bg: 'orange.700',
              transform: 'scale(1.05)',
              transition: 'all 0.2s',
            }}
            color="white"
            onClick={handleAcceptAll}
            fontFamily="mono"
            fontWeight="bold"
            boxShadow="0 2px 10px rgba(0, 0, 0, 0.2)"
          >
            {userChangedConsent ? 'Save Changes' : 'Accept All'}
          </Button>
          <Button
            bg="red.600"
            _hover={{
              bg: 'red.700',
              transform: 'scale(1.05)',
              transition: 'all 0.2s',
            }}
            color="white"
            onClick={handleRejectAll}
            fontFamily="mono"
            fontWeight="bold"
            boxShadow="0 2px 10px rgba(0, 0, 0, 0.2)"
          >
            Reject All
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default CookieConsentBanner;
