import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  Button,
  MenuDivider,
} from '@chakra-ui/react';
import { ChevronDownIcon, CheckIcon } from '@chakra-ui/icons';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

interface SortOrderProps {
  setPagination: any;
  selectPagination: any;
}
export default function MenuSelection({
  setPagination,
  selectPagination,

}: SortOrderProps) {
  const dispatch = useDispatch();
  const pagination = useSelector(selectPagination);
  const [sort, setSort] = useState('Last Modified');
  const [order, setOrder] = useState('Newest first');
  const sortMap = {
    Alphabetical: 'project_name',
    'Date Created': 'created_at',
    'Last Modified': 'updated_at',
  };
  const orderMap = {
    'A-Z': '',
    'Z-A': '-',
    'Oldest first': '',
    'Newest first': '-',
  }
  useEffect(() => {
    dispatch(
      setPagination({
        ...pagination,
        sort: `${orderMap[order]}${sortMap[sort]}`,
      }),
    ); 
  }, [sort, order]);


  return (
    <Menu>
      <MenuButton
        as={Button}
        variant="shadow"
        size="xs"
        fontFamily="mono"
        mr={20}
        opacity={0.7}
      >
        {sort} <ChevronDownIcon />
      </MenuButton>
      <MenuList bg="gray" fontSize="xs" pt={1} pb={3}>
        <MenuGroup fontSize="xs" title="Sort By">
          <MenuItem
            onClick={() => {
              setSort('Alphabetical');
              setOrder('A-Z');
            }}
          >
            <CheckIcon mr={3} opacity={sort === 'Alphabetical' ? 1 : 0} />
            Alphabetical
          </MenuItem>
          <MenuItem
            onClick={() => {
              setSort('Date Created');
              setOrder('Newest first');
            }}
          >
            <CheckIcon mr={3} opacity={sort === 'Date Created' ? 1 : 0} />
            Date Created
          </MenuItem>
          <MenuItem
            onClick={() => {
              setSort('Last Modified');
              setOrder('Newest first');
            }}
          >
            <CheckIcon mr={3} opacity={sort === 'Last Modified' ? 1 : 0} />
            Last Modified
          </MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup fontSize="xs" title="Order">
          {sort === 'Alphabetical' ? (
            <>
              <MenuItem onClick={() => setOrder('A-Z')}>
                <CheckIcon mr={3} opacity={order === 'A-Z' ? 1 : 0} />
                A-Z
              </MenuItem>
              <MenuItem onClick={() => setOrder('Z-A')}>
                <CheckIcon mr={3} opacity={order === 'Z-A' ? 1 : 0} />
                Z-A
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem onClick={() => setOrder('Oldest first')}>
                <CheckIcon mr={3} opacity={order === 'Oldest first' ? 1 : 0} />
                Oldest first
              </MenuItem>
              <MenuItem onClick={() => setOrder('Newest first')}>
                <CheckIcon mr={3} opacity={order === 'Newest first' ? 1 : 0} />
                Newest first
              </MenuItem>
            </>
          )}
        </MenuGroup>
      </MenuList>
    </Menu>
  );
}
