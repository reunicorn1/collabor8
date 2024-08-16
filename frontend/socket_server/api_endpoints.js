import axios from 'axios';

const API_URL = 'http://localhost:3000';

const run_axios = async (method, url, data, headers = null) => {
  return axios({
    method: method,
    url: url,
    data: data,
    headers: headers
  })
  .then(response => {
    console.log(response.data);
    return response.data;
  })
  .catch(error => {
    console.log(error.response.data);
    return error.response.data;
  })
}




//get all users
export const getUsers = async () => {
  return run_axios('get', `${API_URL}/users`, null);
}

// create a user
// request must include a 'username', 'first_name', 'last_name',  'email',  'password',
// and optionally favorite_languages array of strings
export const createUser = async (user) => {
  return run_axios('post', `${API_URL}/users/register`, user);
}

export const loginUser = async (user) => {
  return run_axios('post', `${API_URL}/users/login`, user);
}

export const signInUser = async (user) => {
  return run_axios('post', `${API_URL}/auth/signin`, user);
}

export const getUserProfile = async (headers) => {
  return run_axios('get', `${API_URL}/auth/profile`, null, headers);
}

// get all user projects
export const getUserProjects = async (username) => {
  return run_axios('get', `${API_URL}/projects/${username}`, null);
}

// test data
const user = {
  username: 'mo',
  first_name: 'Mohammed',
  last_name: 'Ali',
  email: 'mo@gmail.com',
  password: 'password',
  favorite_languages: ['javascript', 'python']
}

const user_login = {
  username: 'mo',
  password: 'password'
}


//test
// await createUser(user).then(data => console.log(data));
// loginUser(user_login).then(data => console.log(data));
const accessToken = await signInUser(user_login).then(data => data.accessToken);
const headers = {
    Authorization: `Bearer ${accessToken}`
}
getUserProfile(headers);
// getUsers().then(data => console.log(data));
// getUserProjects('mo').then(data => console.log(data));
