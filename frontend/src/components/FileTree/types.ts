export interface File {
  type: 'file';
  id: string;
  file_name: string;
}

export interface Directory {
  type: 'dir';
  id: string;
  directory_name: string;
  children?: (File | Directory)[];
}

// export interface File {
//   file_id: string;
//   file_name: string;
//   directory_id: string | null;
//   file_content: string;
//   created_at: string;
//   updated_at: string;
//   parent_id: string;
//   type: 'file' | 'directory';
//   children?: File[];
// }

// export interface Directory {
//   directory_id: string;
//   directory_name: string;
//   parent_id: string | null;
//   created_at: string;
//   updated_at: string;
//   type: 'directory';
//   children: (File | Directory)[];
// }
export interface Project {
  project_id: string;
  project_name: string;
  created_at: string;
  updated_at: string;
  parent_id: string | null;
  children: (File | Directory)[];
  shared_with: {
    user_id: string;
    access_level: 'read' | 'write';
  }[];
}
