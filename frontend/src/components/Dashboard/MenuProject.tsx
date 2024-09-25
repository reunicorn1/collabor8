import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import {
  MdOutlineEdit,
  MdDeleteOutline,
  MdOutlineStarHalf,
} from 'react-icons/md';
import React, { ReactNode } from 'react';
import {
  useDeleteProjectMutation,
  useUpdateProjectMutation,
} from '@store/services/project';
import { useDeleteProjectShareMutation, useToggleShareFavoriteMutation, useUpdateProjectShareMutation } from '@store/services/projectShare';
import { useToggleFavoriteMutation } from '@store/services/project';
import { RenamePopover } from './RenamePopover';

// TODO: fix types later
type DBMenuProps = {
  children: ReactNode;
  project: any;
  type: string;
};
//project: Project | ProjectShares | ProjectSharesOutDto;

export default function MenuProject({ children, project, type }: DBMenuProps) {
  const toast = useToast();
  const isShared = type === 'shared';
  const [favoriteProject] = isShared 
  ? useToggleShareFavoriteMutation()
  : useToggleFavoriteMutation();
  const [updateProject] = isShared 
  ? useUpdateProjectShareMutation() 
  : useUpdateProjectMutation();
  const [deleteProject] = isShared
  ? useDeleteProjectShareMutation()
  : useDeleteProjectMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const project_id = isShared ? project.share_id : project.project_id;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('delete project: ', project.project_name);
    await deleteProject(project_id)
      .unwrap()
      .then((data) => {
        console.log('deleted project', data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onSave = async (project_name: string) => {
    console.log(project_name);
    await updateProject({ id: project_id, data: { project_name } })
      .unwrap()
      .then((_) => {
        console.log('renamed project to: ', project_name);
      })
      .catch((err) => {
        console.error(err);
      });
    onClose();
  };

  const handleFavorites = async (e: React.MouseEvent) => {
    // This function sends a request to add a project to the user's favorites
    e.stopPropagation();
    // const favoriteToggle =
    //   type === 'personal' ? favoriteProject : favoriteSharedProject;
    await favoriteProject(project_id)
      .unwrap()
      .then((_) => {
        console.log('Changed the value of favorite to', !project.favorite);
        toast({
          title: `A new favorite has been ${project.favorite ? 'removed' : 'added'} ⭐️`,
          status: 'success',
          variant: 'subtle',
          position: 'bottom-left',
          isClosable: true,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Menu>
      <MenuButton onClick={(e) => e.stopPropagation()}>{children}</MenuButton>
      <MenuList bg="gray">
      {!isShared && (
      <>
        <MenuItem
          fontSize={['xx-small', 'xs']}
          icon={<MdOutlineEdit fontSize="12px" />}
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
        >
          Rename
        </MenuItem>
        <RenamePopover
          isOpen={isOpen}
          onClose={onClose}
          project_name={project.project_name}
          onSave={onSave}
        />
      </>
      )}
        <MenuItem
          fontSize={['xx-small', 'xs']}
          icon={<MdDeleteOutline fontSize="12px" />}
          onClick={handleDelete}
        >
          Delete
        </MenuItem>
        <MenuItem
          fontSize={['xx-small', 'xs']}
          icon={<MdOutlineStarHalf fontSize="12px" />}
          onClick={handleFavorites}
        >
          {project.favorite ? 'Remove from favorites' : 'Add to favorites'}
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
