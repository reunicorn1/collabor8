import axios from 'axios';

const API_URL = 'http://localhost:3000';

class APIEndpoints {
  constructor() {

    this.headers = {};
    this.run_axios = async (method, url, data, headers) => {
      return axios({
        method: method,
        url: url,
        data: data,
        headers: headers ? headers : this.headers,
      })
        .then((response) => {
          console.log(response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error.response.data);
          return error.response.data;
        });
    };

    this.signInUser = async (user) => {
      return this.run_axios('post', `${API_URL}/auth/signin`, user).then(
        (data) => {
          this.headers['Authorization'] = `Bearer ${data.accessToken}`;
          return data;
        },
      );
    };
  }
}

export class UserAPI extends APIEndpoints {
  constructor() {
    super();
  }

  async getUsers() {
    return this.run_axios('get', `${API_URL}/users/all`, null, this.headers);
  }

  async createUser(user) {
    return this.run_axios('post', `${API_URL}/auth/signup`, user);
  }

  async updateUser(user) {
    return this.run_axios('put', `${API_URL}/users/update`, user, this.headers);
  }

  async getUserProfile(headers) {
    if (!headers) {
      headers = this.headers;
    }
    return this.run_axios('get', `${API_URL}/auth/profile`, null, headers);
  }
}

class ProjectAPI extends APIEndpoints {
  constructor() {
    super();
  }
  async getUserProjects(username, headers) {
    return this.run_axios(
      'get',
      `${API_URL}/projects/${username}`,
      null,
      headers,
    );
  }

  async getProjects() {
    return this.run_axios('get', `${API_URL}/projects`, null);
  }

  async getProject(projectId) {
    return this.run_axios('get', `${API_URL}/projects/${projectId}`, null);
  }

  async createProject(project) {
    return this.run_axios('post', `${API_URL}/projects`, project);
  }

  async updateProject(projectId, project) {
    return this.run_axios('put', `${API_URL}/projects/${projectId}`, project);
  }

  async deleteProject(projectId) {
    return this.run_axios('delete', `${API_URL}/projects/${projectId}`, null);
  }
}

// test data
const user = {
  username: 'mo',
  first_name: 'Mohammed',
  last_name: 'Ali',
  email: 'mo@gmail.com',
  password: 'password',
  favorite_languages: ['javascript', 'python'],
};

const admin = {
  username: 'admin',
  first_name: 'Mohammed',
  last_name: 'Ali',
  email: 'admin@gmail.com',
  password: 'admin',
  roles: 'admin',
  favorite_languages: ['javascript', 'python']
}

const user_login = {
  username: 'mo',
  password: 'password'
}


// const userAPI = new UserAPI();
// // create admin
// // await userAPI.createUser(admin)
// await userAPI.signInUser(admin)
// // await userAPI.signInUser(user_login)
// // await userAPI.updateUser({favorite_languages: ['javascript', 'python', 'java'], roles: 'admin'})

//test
// await createUser(user).then(data => console.log(data));
// loginUser(user_login).then(data => console.log(data));
// const accessToken = await userAPI.signInUser(user_login).then(data => data.accessToken);
// const headers = {
//     Authorization: `Bearer ${accessToken}`
// }
// userAPI.getUserProfile(headers);
// getUsers().then(data => console.log(data));
// getUserProjects('mo').then(data => console.log(data));
