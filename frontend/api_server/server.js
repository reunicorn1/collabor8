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

const mockProjects = [
  {
    project_id: '123e4567-e89b-12d3-a456-426614174002',
    project_name: 'Sample Project 1',
    created_at: '2024-08-12T00:00:00Z',
    updated_at: '2024-08-12T00:00:00Z',
    parent_id: null,
    children: [
      {
        directory_id: 'd1c2c74b-dbd4-4f78-b8f1-df72dcf50707',
        name: 'root',
        parent_id: null,
        created_at: '2024-08-12T00:00:00Z',
        children: [
          {
            directory_id: '82be4d5c-7f77-4e8d-9b0d-6f19f55c89a7',
            name: 'Folder 1',
            parent_id: 'd1c2c74b-dbd4-4f78-b8f1-df72dcf50707',
            created_at: '2024-08-12T00:00:00Z',
            children: [
              {
                file_id: 'cc5f70e4-c13c-41c7-9f47-61d1cfab2e79',
                name: 'file1.js',
                directory_id: '82be4d5c-7f77-4e8d-9b0d-6f19f55c89a7',
                file_content: 'console.log("Hello World");',
                created_at: '2024-08-12T00:00:00Z',
                updated_at: '2024-08-12T00:00:00Z',
                parent_id: '82be4d5c-7f77-4e8d-9b0d-6f19f55c89a7',
              },
            ],
          },
          {
            directory_id: '9e7d14c8-9db4-4d92-bf36-27463b0890a6',
            name: 'Folder 2',
            parent_id: 'd1c2c74b-dbd4-4f78-b8f1-df72dcf50707',
            created_at: '2024-08-12T00:00:00Z',
            children: [],
          },
        ],
      },
      {
        file_id: '1c9d7e54-67c1-4d7e-9e4b-02b6eecf569b',
        name: 'README.md',
        directory_id: 'd1c2c74b-dbd4-4f78-b8f1-df72dcf50707',
        file_content: '# Sample Project\nThis is a sample project.',
        created_at: '2024-08-12T00:00:00Z',
        updated_at: '2024-08-12T00:00:00Z',
        parent_id: 'd1c2c74b-dbd4-4f78-b8f1-df72dcf50707',
      },
    ],
    shared_with: [
      {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        access_level: 'read',
      },
    ],
  },
  {
    project_id: '123e4567-e89b-12d3-a456-426614174003',
    project_name: 'Sample Project 2',
    created_at: '2024-08-12T00:00:00Z',
    updated_at: '2024-08-12T00:00:00Z',
    parent_id: null,
    children: [
      {
        directory_id: 'd3a34e23-9a6d-4b1c-bf26-60acdb84011f',
        name: 'root',
        parent_id: null,
        created_at: '2024-08-12T00:00:00Z',
        children: [
          {
            directory_id: 'f1c658f5-0c5b-4c43-b4b2-5a0d97388c58',
            name: 'Folder 3',
            parent_id: 'd3a34e23-9a6d-4b1c-bf26-60acdb84011f',
            created_at: '2024-08-12T00:00:00Z',
            children: [
              {
                file_id: 'b548b439-70a4-4d69-85e7-1cf6b274e263',
                name: 'file3.js',
                directory_id: 'f1c658f5-0c5b-4c43-b4b2-5a0d97388c58',
                file_content: 'console.log("Hello Universe");',
                created_at: '2024-08-12T00:00:00Z',
                updated_at: '2024-08-12T00:00:00Z',
                parent_id: 'f1c658f5-0c5b-4c43-b4b2-5a0d97388c58',
              },
            ],
          },
        ],
      },
    ],
    shared_with: [
      {
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        access_level: 'write',
      },
    ],
  },
];

// Recursively find a file by ID within directories
function findFileInDirectory(directory, file_id) {
  if (directory && Array.isArray(directory.children)) {
    for (const child of directory.children) {
      if (child.file_id === file_id) {
        return child;
      }
      if (child.children) {
        const foundFile = findFileInDirectory(child, file_id);
        if (foundFile) {
          return foundFile;
        }
      }
    }
  }
  return null;
}

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
      environment_id: mockUser.environment_id,
      username: mockUser.username,
      projects: mockProjects,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.get('/api/v1/projects/:project_id', (req, res) => {
  const { project_id } = req.params;
  const project = mockProjects.find((p) => p.project_id === project_id);
  if (project) {
    res.json(project);
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
});

app.get('/api/v1/projects/:project_id/files/:file_id', (req, res) => {
  const { project_id, file_id } = req.params;
  const project = mockProjects.find((p) => p.project_id === project_id);
  if (project) {
    for (const item of project.children) {
      if (item.file_id === file_id) {
        return res.json(item);
      }
    }

    if (Array.isArray(project.children)) {
      for (const directory of project.children) {
        const file = findFileInDirectory(directory, file_id);
        if (file) {
          return res.json(file);
        }
      }
    }
    res.status(404).json({ message: 'File not found' });
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
});

app.listen(port, () => {
  console.log(`Mock server running at http://localhost:${port}\n`);
});
