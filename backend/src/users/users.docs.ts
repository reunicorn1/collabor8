import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiResponse,
  getSchemaPath,
  ApiHeader,
  ApiBearerAuth
} from '@nestjs/swagger';
import { CreateUserDto, LoginUserDto } from '@users/dto/create-user.dto';

class UserDocs {
  static init({ summary, description }, ...args) {
    return applyDecorators(
      ApiOperation({
        summary,
        description,
      }),
      ...args,
    );
  }

  @ApiBearerAuth()
  findUser() {
    return UserDocs.init({
      summary: 'Get current user profile',
      description: 'Retrieve the profile of the currently authenticated user.',
    });
  }

  updateUser() {
    return UserDocs.init(
      {
        summary: 'Update current user profile',
        description: 'Update the profile of the currently authenticated user.',
      },
      ApiBody({
        type: CreateUserDto,
      }),
      ApiOkResponse({
        type: CreateUserDto,
      }),
    );
  }
  removeUser() {
    return UserDocs.init({
      summary: 'Delete current user profile',
      description: 'Delete the profile of the currently authenticated user.',
    });
  }

  findOneById() {
    return UserDocs.init({
      summary: 'Get user by ID',
      description: 'Retrieve a specific user by their unique ID.',
    });
  }

  updateById() {
    return UserDocs.init({
      summary: '',
      description: '',
    });
  }

  remove() {
    return UserDocs.init({
      summary: '',
      description: '',
    });
  }
}

export default new UserDocs();
