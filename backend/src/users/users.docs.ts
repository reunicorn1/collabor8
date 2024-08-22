import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiResponse,
  getSchemaPath,
  ApiHeader
} from '@nestjs/swagger';
import { CreateUserDto, LoginUserDto } from '@users/dto/create-user.dto';

class UserDocs {
  findUser() {
    return applyDecorators(
      ApiOperation({
        summary: 'Get current user profile',
        description: 'Retrieve the profile of the currently authenticated user.',
      }),
      ApiOkResponse({
        type: CreateUserDto,
      }),
    );
  }

  updateUser() {
    return applyDecorators(
      ApiOperation({
        summary: 'Update current user profile',
        description: 'Update the profile of the currently authenticated user.',
      }),
      ApiBody({
        type: CreateUserDto,
      }),
      ApiOkResponse({
        type: CreateUserDto,
      }),
    );
  }
  removeUser() { }
  findOneById() { }
  updateById() { }
  remove() { }

}

export default new UserDocs();
