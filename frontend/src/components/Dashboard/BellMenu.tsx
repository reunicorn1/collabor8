import React, { ReactNode } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  Tag,
  Avatar,
  Box,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';

type DBMenuProps = {
  children: ReactNode;
};

// Provide this component with a list of shared items either pass it as a prop or make the call for it here
// in a useEffect, whenever the user accepts or reject you can either remove the inivitation or re-render the list
export default function BellMenu({ children }: DBMenuProps) {
  const [shared, setShared] = useState(['item']);

  const handleClick = (value, id) => {
    // Handle the click of one of the buttons of the invitation
    // Suggestion, value is the status of the invitation, and id is the project share id to be updated
    console.log(value, id);
  };

  return (
    <Menu>
      <MenuButton>{children}</MenuButton>
      <MenuList maxH="350px" overflowY="auto">
        {!shared.length ? (
          <MenuItem>No Notifications to be displayed</MenuItem>
        ) : (
          <>
            {/* This is the part where you will map through a list of pending shared invitations */}
            <MenuItem _hover={{ bg: 'orange.100' }}>
              <Flex maxW="300px" gap={4} alignItems="center">
                <Avatar size="md" src="" />
                <Box>
                  <Text fontSize="xs">
                    <b>Mohamed Elfadil</b> has requested to have you as a
                    contributor
                  </Text>
                  <Text mt={1} color="gray.600" fontSize="xs">
                    <b>Project name</b>
                  </Text>
                  <Flex mt={2} gap={3}>
                    <Tag
                      colorScheme="green"
                      size="md"
                      onClick={() => handleClick('Approved', 1)}
                    >
                      Approve
                    </Tag>
                    <Tag size="md" onClick={() => handleClick('Declined', 2)}>
                      Decline
                    </Tag>
                  </Flex>
                </Box>
              </Flex>
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
}
