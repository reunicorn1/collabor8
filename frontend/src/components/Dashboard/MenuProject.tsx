import { Menu, MenuButton, MenuList, MenuItem, useDisclosure, PopoverTrigger } from '@chakra-ui/react';
import { MdOutlineEdit, MdDeleteOutline } from 'react-icons/md';
import { ReactNode } from 'react';
import { useDeleteProjectMutation, useUpdateProjectMutation } from '@store/services/project';
import { Project, ProjectShares, ProjectSharesOutDto } from '@types';
import { PopoverForm, RenamePopover } from './RenamePopover';

type DBMenuProps = {
  children: ReactNode;
  project: Project | ProjectShares | ProjectSharesOutDto;
};

export default function MenuProject({ children, project }: DBMenuProps) {
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('delete project: ', project.project_name);
    await deleteProject(project.project_id).unwrap().then((data) => {
      console.log('deleted project', data);
    }).catch((err) => {
      console.error(err);
    });

  }

  const onSave = async (project_name: string) => {
    console.log(project_name);
    await updateProject({ id: project.project_id, data: {project_name} })
      .unwrap()
      .then((_) => {
          console.log('renamed project to: ', project_name);
          })
    .catch((err) => {
        console.error(err);
        });
    onClose();
  }



  return (
    <Menu>
      <MenuButton onClick={(e) => e.stopPropagation()}>{children}</MenuButton>
      <MenuList bg="gray">
        <MenuItem fontSize="xs" icon={<MdOutlineEdit fontSize="12px" />}
          // show popover to rename project
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
        <MenuItem fontSize="xs" icon={<MdDeleteOutline fontSize="12px" />}
          onClick={handleDelete}
        >
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
