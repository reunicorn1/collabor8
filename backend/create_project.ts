import axios from 'axios';
import * as projects from './example_projects.json';
const baseURL = 'http://localhost:3000/api/v1';

interface Project {
  name: string;
  description: string;
}



const projectList: Project[] = projects as Project[];

const fileExtensions = ['py', 'js', 'ts', 'html', 'css'];
// Function to sign in and get the access token
async function signIn(username: string, password: string): Promise<string> {
  try {
    const response = await axios.post(`${baseURL}/auth/signin`, {
      username,
      password,
    });

    const accessToken = response.data.accessToken;
    console.log('Signed in successfully. Access Token:', accessToken);
    return accessToken;
  } catch (error) {
    console.error('Error signing in:', error.response?.data || error.message);
    throw new Error('Sign-in failed');
  }
}

// Function to create a directory
async function createDirectory(name: string, parentId: string, project_id: string,
                               accessToken: string): Promise<{ directory_id: string }> {
  try {
    const response = await axios.post(
      `${baseURL}/directory`,
      { name, parent_id: parentId, project_id: project_id },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const directory_id = response.data._id;
    console.log(`Directory created: ${name}, ID: ${directory_id}`);
    return { directory_id };
  } catch (error) {
    console.error('Error creating directory:', error.response?.data || error.message);
    throw error;
  }
}

// Function to create a file
async function createFile(name: string, parentId: string, project_id: string, accessToken: string) {
  try {
    await axios.post(
      `${baseURL}/files`,
      { name, parent_id: parentId, project_id: project_id },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    console.log(`File created: ${name}`);
  } catch (error) {
    console.error('Error creating file:', error.response?.data || error.message);
    throw error;
  }
}

// Recursive function to create a project structure with random depth and files
async function createProjectStructure(
  parentIds: string[],
  project_id: string,
  depth: number,
  filesCount: number,
  accessToken: string,
) {
  if (depth === 0 || filesCount === 0) return;

  const directoriesCount = Math.floor(Math.random() * (depth + 1));
  console.log(`Creating ${directoriesCount} directories and ${filesCount - directoriesCount} files at depth ${depth}`);
  const remainingFiles = filesCount - directoriesCount;


  for (let i = 0; i < directoriesCount; i++) {
    const dirName = `Directory_${Math.random().toString(36).substring(7)}`;
    const { directory_id } = await createDirectory(dirName, parentIds[Math.floor(Math.random() * parentIds.length)], project_id, accessToken);
    parentIds.push(directory_id);
    await createProjectStructure(parentIds, project_id, depth - 1, remainingFiles, accessToken);
  }

  for (let i = 0; i < remainingFiles; i++) {
    const fileName = `File_${Math.random().toString(36).substring(7)}.${fileExtensions[Math.floor(Math.random() * fileExtensions.length)]}`;
    await createFile(fileName, parentIds[Math.floor(Math.random() * parentIds.length)], project_id, accessToken);
  }
}

// Function to create the initial project
async function createProject(accessToken: string, project: Project): Promise<{ project_id: string }> {
  try {
    const response = await axios.post(
      `${baseURL}/projects`,
      {
        project_name: project.name,
        description: project.description,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const project_id = response.data._id;
    console.log(`Project created with ID: ${project_id}`);
    return { project_id };
  } catch (error) {
    console.error('Error creating project:', error.response?.data || error.message);
    throw new Error('Project creation failed');
  }
}

// Function to sign out and revoke the session
async function signOut(accessToken: string) {
  try {
    await axios.delete(
      `${baseURL}/auth/signout`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    console.log('Signed out successfully.');
  } catch (error) {
    console.error('Error signing out:', error.response?.data || error.message);
  }
}

// Main function to execute the entire flow
async function main() {
  try {
    const username = 'trip';
    const password = 'w';
    const accessToken = await signIn(username, password);
    for (let i = 0; i < projectList.length; i++) {
    const { project_id }= await createProject(accessToken, projectList[i]);
    const parentIds = [project_id];

    const n = 3; // Depth of directories
    const m = 7; // Total number of files and directories
    await createProjectStructure(parentIds, project_id, n, m, accessToken);
    }
    await signOut(accessToken);
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

main();

