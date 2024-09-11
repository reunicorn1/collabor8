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
import { useToggleShareFavoriteMutation } from '@store/services/projectShare';
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
  const [favoriteProject] = useToggleFavoriteMutation();
  const [favoriteSharedProject] = useToggleShareFavoriteMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('delete project: ', project.project_name);
    await deleteProject(project.project_id)
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
    await updateProject({ id: project.project_id, data: { project_name } })
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
    const id = type === 'personal' ? project.project_id : project.share_id;
    // const favoriteToggle =
    //   type === 'personal' ? favoriteProject : favoriteSharedProject;
    await favoriteProject(id)
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
