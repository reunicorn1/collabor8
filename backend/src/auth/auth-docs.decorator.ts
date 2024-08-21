import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { Users } from '@users/user.entity';

export function ApiSignIn() {
  return applyDecorators(
    ApiOperation({
      summary: 'User Sign In',
      description: 'Sign in to the application using a username and password.',
    }),
    ApiBody({
      type: 'User',
      description: 'Credentials required for login',
    }),
    ApiOkResponse({
      description: 'Successfully signed in',
      schema: {
        example: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    }),
  );
}

export function ApiSignUp() {
  return applyDecorators(
    ApiOperation({
      summary: 'User Sign Up',
      description:
        'Create a new user account by providing the required user details.',
    }),
    ApiBody({
      type: 'User',
      description: 'Data required to create a new user',
    }),
    ApiOkResponse({
      description: 'User successfully created',
      type: Users,
    }),
  );
}

export function ApiGetProfile() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get User Profile',
      description: 'Retrieve the profile of the currently authenticated user.',
    }),
    ApiOkResponse({
      description: 'User profile retrieved successfully',
      schema: {
        example: {
          id: '1',
          username: 'john_doe',
          email: 'john.doe@example.com',
          roles: ['user'],
        },
      },
    }),
  );
}

export function ApiRefreshToken() {
  return applyDecorators(
    ApiOperation({
      summary: 'Refresh Access Token',
      description:
        'Refresh the access token using the refresh token stored in cookies.',
    }),
    ApiOkResponse({
      description: 'Access token refreshed successfully',
      schema: {
        example: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    }),
  );
}
