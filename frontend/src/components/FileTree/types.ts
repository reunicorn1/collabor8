export interface File {
  file_id: string;
  file_name: string;
  directory_id: string | null; // null for root directory
  file_content: string;
  created_at: string;
  updated_at: string;
  parent_id: string;
  type: 'file' | 'directory';
  children?: File[];
}
