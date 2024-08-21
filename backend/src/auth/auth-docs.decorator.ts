import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiOkResponse, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { CreateUserDto, LoginUserDto } from '@users/dto/create-user.dto';
import { Users } from '@users/user.entity';

class AuthDocs {
  ApiSignIn() {
    return applyDecorators(
      ApiOperation({
        summary: 'User Sign In',
        description: 'Sign in to the application using a username and password.',
      }),
      ApiBody({
        type: LoginUserDto,
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

  ApiSignUp() {
    return applyDecorators(
      ApiOperation({
        summary: 'User Sign Up',
        description:
          'Create a new user account by providing the required user details.',
      }),
      ApiBody({
        description: 'Data required to create a new user',
        schema: {
          example: {
            username: 'Mohannad Babiker',
            email: '',
            first_name: '',
            last_name: '',
            password: '',
          },
        },
      }),
      ApiOkResponse({
        description: 'User successfully created',
        schema: {
          example: {
            username: 'bla',
            first_name: 'fola',
            last_name: 'fola',
            favorite_languages: [],
            email: 'a@a.com',
            environment_id: '66c622e81a97cc2ef26f71f8',
            user_id: 'aac201f9-a75f-4bc4-a53b-2ff70c46b48d',
            created_at: '2024-08-21T17:24:56.506Z',
            updated_at: '2024-08-21T17:24:56.506Z',
          },
        },
      }),
    );
  }

  ApiGetProfile() {
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

  ApiRefreshToken() {
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
}

export default new AuthDocs();
