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
  Icon,
  Badge,
} from '@chakra-ui/react';
import { BsBell } from 'react-icons/bs';

type BellMenuProps = {
  invitations: Array<{
    _id: string;
    profile_picture: string;
    first_name: string;
    last_name: string;
    username: string;
    project_name: string;
    share_id: string;
    project_id: string;
  }>;
  notificationCount: number;
  onApprove: (share_id: string) => void;
  onDecline: (share_id: string) => void;
};

// Provide this component with a list of shared items either pass it as a prop or make the call for it here
// in a useEffect, whenever the user accepts or reject you can either remove the inivitation or re-render the list
export default function BellMenu({
  invitations,
  notificationCount,
  onApprove,
  onDecline,
}: BellMenuProps) {
  return (
    <Menu>
      <MenuButton position="relative">
        <Icon color="white" ml={4} boxSize="16px" as={BsBell} />
        {notificationCount > 0 && (
          <Badge
            position="absolute"
            top="-1px"
            right="-1px"
            borderRadius="full"
            bgColor="red.500"
            color="white"
            fontSize="7px"
            h="12px"
            w="12px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {notificationCount}
          </Badge>
        )}
      </MenuButton>
      <MenuList maxH="350px" overflowY="auto">
        {invitations.length === 0 ? (
          <MenuItem>No Notifications to be displayed</MenuItem>
        ) : (
          invitations.map((inv) => (
            <MenuItem key={inv._id} _hover={{ bg: 'orange.100' }}>
              <Flex maxW="300px" gap={4} alignItems="center">
                <Avatar size="md" src={inv.profile_picture} />
                <Box>
                  <Text fontSize="xs">
                    <b>
                      {inv.first_name} {inv.last_name}
                    </b>{' '}
                    has requested to have you as a contributor
                  </Text>
                  <Text mt={1} color="gray.600" fontSize="xs">
                    <b>{inv.project_name}</b>
                  </Text>
                  <Flex mt={2} gap={3}>
                    <Tag
                      colorScheme="green"
                      size="md"
                      onClick={() => onApprove(inv.share_id)}
                    >
                      Approve
                    </Tag>
                    <Tag size="md" onClick={() => onDecline(inv.share_id)}>
                      Decline
                    </Tag>
                  </Flex>
                </Box>
              </Flex>
            </MenuItem>
          ))
        )}
      </MenuList>
    </Menu>
  );
}
