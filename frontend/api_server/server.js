const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/collabor8', {});

const app = express();
const port = 3000;

app.use(express.json());
app.use(morgan('combined'));
app.use(
  cors({
    origin: '*',
  }),
);

// Mongoose schemas
const userSchema = new mongoose.Schema({
  user_id: String,
  username: String,
  email: String,
  environment_id: String,
  created_at: Date,
  updated_at: Date,
});

const projectSchema = new mongoose.Schema({
  project_id: String,
  project_name: String,
  created_at: Date,
  updated_at: Date,
  parent_id: String,
  children: [mongoose.Schema.Types.Mixed],
  shared_with: [{ user_id: String, access_level: String }],
});

const User = mongoose.model('User', userSchema);
const Project = mongoose.model('Project', projectSchema);

// Recursively find a file by ID within directories
async function findFileInDirectory(directory, file_id) {
  if (directory && Array.isArray(directory.children)) {
    for (const child of directory.children) {
      if (child.file_id === file_id) {
        return child;
      }
      if (child.children) {
        const foundFile = await findFileInDirectory(child, file_id);
        if (foundFile) {
          return foundFile;
        }
      }
    }
  }
  return null;
}

// Endpoints
app.get('/api/v1/users/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const user = await User.findOne({ user_id });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/v1/users/:user_id/projects', async (req, res) => {
  const { user_id } = req.params;
  try {
    const user = await User.findOne({ user_id });
    if (user) {
      const projects = await Project.find({ 'shared_with.user_id': user_id });
      res.json({
        environment_id: user.environment_id,
        username: user.username,
        projects,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/v1/projects/:project_id', async (req, res) => {
  const { project_id } = req.params;
  try {
    const project = await Project.findOne({ project_id });
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/v1/projects/:project_id/files/:file_id', async (req, res) => {
  const { project_id, file_id } = req.params;
  try {
    const project = await Project.findOne({ project_id });
    if (project) {
      for (const item of project.children) {
        if (item.file_id === file_id) {
          return res.json(item);
        }
      }

      if (Array.isArray(project.children)) {
        for (const directory of project.children) {
          const file = await findFileInDirectory(directory, file_id);
          if (file) {
            return res.json(file);
          }
        }
      }
      res.status(404).json({ message: 'File not found' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}\n`);
});
