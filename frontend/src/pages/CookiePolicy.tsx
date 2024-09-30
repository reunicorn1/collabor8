import React from 'react';
import {
  Box,
  Heading,
  Text,
  ListItem,
  UnorderedList,
  OrderedList,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  Divider,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import usePageTitle from '@hooks/useTitle';

const CookiePolicy: React.FC = () => {
  const navigate = useNavigate();
  const handleGoHome = () => {
    navigate('/');
    window.scrollTo(0, 0);
  };

  usePageTitle('Cookie Policy - Collabor8');

  return (
    <Box className="shadow-cookie lg:text-justify bg-brand-900 mono-font">
      <Box
        w="min(100%,1000px)"
        className="container mx-auto px-8 py-14"
        borderRadius="10px"
        transition="all 0.3s"
      >
        <Heading
          as="h1"
          size={{ base: 'xl', lg: '2xl' }}
          mb={8}
          color="whitesmoke"
          fontFamily="mono"
          textAlign={{ lg: 'center' }}
        >
          Cookie Policy 🍪
        </Heading>

        <section className="mb-6">
          <Heading as="h2" size="lg" mb={2} color="#E86044" fontFamily="mono">
            Introduction
          </Heading>
          <Text color="white" fontSize="lg" lineHeight="1.5">
            At{' '}
            <strong>
              collabor<span style={{ color: '#E86044' }}>8</span>
            </strong>
            , we value your privacy and strive to be transparent about the data
            we collect when you interact with our website, including the use of
            cookies. This Cookie Policy explains what cookies are, how we use
            them, your choices regarding their usage, and where you can find
            more information.
          </Text>
        </section>

        <section className="mb-6">
          <Heading as="h2" size="lg" mb={2} color="#E86044" fontFamily="mono">
            What Are Cookies?
          </Heading>
          <Text color="white" fontSize="lg" lineHeight="1.5">
            Cookies are small text files that are stored on your device
            (computer, tablet, smartphone, etc.) when you visit certain
            websites. They help improve your browsing experience by remembering
            your preferences and enabling various features of the site.
          </Text>
          <UnorderedList
            className="list-disc pl-5"
            color="white"
            fontSize="lg"
            lineHeight="1.5"
          >
            <ListItem>
              <strong>Session Cookies</strong>: Temporary cookies that expire
              when you close your browser.
            </ListItem>
            <ListItem>
              <strong>Persistent Cookies</strong>: These remain on your device
              until they expire or are deleted.
            </ListItem>
            <ListItem>
              <strong>First-Party Cookies</strong>: Set by the website you are
              visiting.
            </ListItem>
            <ListItem>
              <strong>Third-Party Cookies</strong>: Set by other domains, often
              for marketing and analytics purposes.
            </ListItem>
          </UnorderedList>
        </section>

        <section className="mb-6">
          <Heading as="h2" size="lg" mb={2} color="#E86044" fontFamily="mono">
            Why Do We Use Cookies?
          </Heading>
          <Text color="white" fontSize="lg" lineHeight="1.5">
            We use cookies for various reasons, such as:
          </Text>
          <OrderedList
            className="list-decimal pl-5"
            color="white"
            fontSize="lg"
            lineHeight="1.5"
          >
            <ListItem>
              <strong>Necessary Cookies</strong>: Essential for the operation of
              our website, enabling services like user authentication.
            </ListItem>
            <ListItem>
              <strong>Analytics Cookies</strong>: Help us understand how
              visitors interact with our website, allowing us to measure
              performance and improve.
            </ListItem>
            <ListItem>
              <strong>Preferences Cookies</strong>: Remember your choices, such
              as language or region, to enhance your experience.
            </ListItem>
            <ListItem>
              <strong>Marketing Cookies</strong>: Deliver personalized
              advertisements based on your browsing behavior.
            </ListItem>
          </OrderedList>
        </section>

        <section className="mb-6">
          <Heading as="h2" size="lg" mb={2} color="#E86044" fontFamily="mono">
            Cookies We Use
          </Heading>
          <Box
            overflowX={{ base: 'auto', md: 'hidden' }}
            border="1px"
            borderColor="gray.200"
            borderRadius="md"
          >
            <Table variant="simple" color="white" colorScheme="teal">
              <Thead>
                <Tr>
                  <Th className="border border-gray-200">Cookie Type</Th>
                  <Th className="border border-gray-200">Purpose</Th>
                  <Th className="border border-gray-200">Expiry</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td className="border border-gray-200">Necessary</Td>
                  <Td className="border border-gray-200">
                    Enables core functionality like user login
                  </Td>
                  <Td className="border border-gray-200">Session</Td>
                </Tr>
                <Tr>
                  <Td className="border border-gray-200">Analytics</Td>
                  <Td className="border border-gray-200">
                    Tracks page views and user interaction
                  </Td>
                  <Td className="border border-gray-200">
                    Persistent (1 year)
                  </Td>
                </Tr>
                <Tr>
                  <Td className="border border-gray-200">Preferences</Td>
                  <Td className="border border-gray-200">
                    Stores user preferences such as language settings
                  </Td>
                  <Td className="border border-gray-200">
                    Persistent (6 months)
                  </Td>
                </Tr>
                <Tr>
                  <Td className="border border-gray-200">Marketing</Td>
                  <Td className="border border-gray-200">
                    Provides personalized ads and tracks ad campaign performance
                  </Td>
                  <Td className="border border-gray-200">
                    Persistent (2 years)
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </section>

        <section className="mb-6">
          <Heading as="h2" size="lg" mb={2} color="#E86044" fontFamily="mono">
            Managing Your Cookie Preferences
          </Heading>
          <Text color="white" fontSize="lg" lineHeight="1.5">
            You have the right to manage your cookie preferences. Upon visiting
            our site, you will be presented with a cookie consent banner that
            allows you to accept or reject cookies based on your preferences.
          </Text>
          <OrderedList
            className="list-decimal pl-5"
            color="white"
            fontSize="lg"
            lineHeight="1.5"
          >
            <ListItem>
              <strong>Accept All</strong>: Allows all types of cookies.
            </ListItem>
            <ListItem>
              <strong>Reject All</strong>: Only necessary cookies will be
              enabled.
            </ListItem>
            <ListItem>
              <strong>Custom Selection</strong>: Choose specific cookie
              categories to enable or disable.
            </ListItem>
          </OrderedList>
          <Text color="white" fontSize="lg" lineHeight="1.5">
            You can also manage cookies directly in your browser settings. Here
            are guides for popular browsers:
          </Text>
          <UnorderedList
            className="list-disc pl-5"
            color="white"
            fontSize="lg"
            lineHeight="1.5"
          >
            <ListItem>
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-brand.200 hover:text-brand.400 transition-colors"
              >
                Google Chrome
              </a>
            </ListItem>
            <ListItem>
              <a
                href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-brand.200 hover:text-brand.400 transition-colors"
              >
                Mozilla Firefox
              </a>
            </ListItem>
            <ListItem>
              <a
                href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-brand.200 hover:text-brand.400 transition-colors"
              >
                Microsoft Edge
              </a>
            </ListItem>
            <ListItem>
              <a
                href="https://support.apple.com/en-us/guide/safari/sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-brand.200 hover:text-brand.400 transition-colors"
              >
                Safari
              </a>
            </ListItem>
          </UnorderedList>
        </section>

        <section className="mb-6">
          <Heading as="h2" size="lg" mb={2} color="#E86044" fontFamily="mono">
            Third-Party Cookies
          </Heading>
          <Text color="white" fontSize="lg" lineHeight="1.5">
            We may use third-party cookies from our advertising partners to
            provide more relevant ads to you and to help us measure the
            effectiveness of our marketing campaigns. You can manage your
            preferences for these cookies directly from the respective
            provider's website.
          </Text>
        </section>

        <section className="mb-6">
          <Heading as="h2" size="lg" mb={2} color="#E86044" fontFamily="mono">
            Changes to This Cookie Policy
          </Heading>
          <Text color="white" fontSize="lg" lineHeight="1.5">
            We may update this Cookie Policy from time to time. Any changes will
            be effective immediately upon posting the revised policy. We
            encourage you to review this policy periodically for any updates.
          </Text>
        </section>

        <Divider borderColor="brand.700" my={6} />

        <Text color="white">
          If you have any questions regarding this Cookie Policy, please contact
          us at{' '}
          <a
            href="mailto:co11abor8.co@gmail.com"
            className="underline text-brand.200 hover:text-brand.400"
          >
            co11abor8.co@gmail.com
          </a>
          .
        </Text>

        <Divider borderColor="brand.700" my={6} />

        <Text color="gray.400" fontSize="sm" textAlign="center">
          Last updated: September 29, 2024
        </Text>

        {/* Go home */}
        <Flex justify="center" mt={6}>
          <Button
            onClick={handleGoHome}
            fontFamily="mono"
            colorScheme="orange"
            variant="solid"
            size={['sm', 'lg']}
          >
            Back to Home
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default CookiePolicy;
