const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(morgan('combined'));
app.use(
  cors({
    origin: '*',
  }),
);

// Mock data
const mockUser = {
  user_id: '123e4567-e89b-12d3-a456-426614174000',
  username: 'johndoe',
  email: 'johndoe@example.com',
  environment_id: '123e4567-e89b-12d3-a456-426614174001',
  created_at: '2024-08-12T00:00:00Z',
  updated_at: '2024-08-12T00:00:00Z',
};

const mockProject = {
  project_id: '123e4567-e89b-12d3-a456-426614174002',
  project_name: 'Sample Project',
  created_at: '2024-08-12T00:00:00Z',
  updated_at: '2024-08-12T00:00:00Z',
  directories: [
    {
      directory_id: '0',
      directory_name: 'root',
      parent_id: null,
      created_at: '2024-08-12T00:00:00Z',
      children: [
        {
          directory_id: 'folder1',
          directory_name: 'Folder 1',
          parent_id: '0',
          created_at: '2024-08-12T00:00:00Z',
          children: [
            {
              file_id: 'file1',
              file_name: 'file1.js',
              directory_id: 'folder1',
              file_content: 'console.log("Hello World");',
              created_at: '2024-08-12T00:00:00Z',
              updated_at: '2024-08-12T00:00:00Z',
              parent_id: '0',
            },
          ],
        },
        {
          directory_id: 'folder2',
          directory_name: 'Folder 2',
          parent_id: '0',
          created_at: '2024-08-12T00:00:00Z',
          children: [],
        },
      ],
    },
  ],
  files: [
    {
      file_id: 'file2',
      file_name: 'README.md',
      directory_id: '0',
      file_content: '# Sample Project\nThis is a sample project.',
      created_at: '2024-08-12T00:00:00Z',
      updated_at: '2024-08-12T00:00:00Z',
      parent_id: '0',
    },
  ],
  shared_with: [
    {
      user_id: '123e4567-e89b-12d3-a456-426614174000',
      access_level: 'read',
    },
  ],
};

const mockFile = {
  file_id: 'file1',
  file_name: 'file1.js',
  directory_id: 'folder1',
  file_content: 'console.log("Hello World");',
  created_at: '2024-08-12T00:00:00Z',
  updated_at: '2024-08-12T00:00:00Z',
};

// Endpoints
app.get('/api/v1/users/:user_id', (req, res) => {
  const { user_id } = req.params;
  if (user_id === mockUser.user_id) {
    res.json(mockUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.get('/api/v1/users/:user_id/projects', (req, res) => {
  const { user_id } = req.params;
  if (user_id === mockUser.user_id) {
    res.json({
      projects: [mockProject],
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.post('/api/v1/projects', (req, res) => {
  const { project_name } = req.body;
  const newProject = {
    project_id: '123e4567-e89b-12d3-a456-426614174003',
    project_name,
    created_at: '2024-08-12T00:00:00Z',
    updated_at: '2024-08-12T00:00:00Z',
  };
  res.json(newProject);
});

app.get('/api/v1/projects/:project_id', (req, res) => {
  const { project_id } = req.params;
  if (project_id === mockProject.project_id) {
    res.json(mockProject);
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
});

app.post('/api/v1/projects/:project_id/files', (req, res) => {
  const { project_id } = req.params;
  const { file_name } = req.body;
  if (project_id === mockProject.project_id) {
    const newFile = {
      file_id: 'file3',
      file_name,
      directory_id: '0',
      file_content: '',
      created_at: '2024-08-12T00:00:00Z',
      updated_at: '2024-08-12T00:00:00Z',
    };
    res.json(newFile);
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
});

app.get('/api/v1/projects/:project_id/files/:file_id', (req, res) => {
  const { project_id, file_id } = req.params;
  if (project_id === mockProject.project_id) {
    if (file_id === mockFile.file_id) {
      res.json(mockFile);
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
});

app.listen(port, () => {
  console.log(`Mock server running at http://localhost:${port}`);
});
