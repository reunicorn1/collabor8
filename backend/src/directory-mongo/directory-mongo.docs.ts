import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateDirectory {
  @ApiProperty({
    description: 'The name of the directory',
    example: 'Documents',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The username of the owner',
    example: 'john_doe',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'The parent directory ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  parent_id: string;
}

// For Documrntation purpose
export class UpdateDirectory {
  @ApiProperty({
    description: 'The name of the directory',
    example: 'Updated Documents',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The username of the owner',
    example: 'john_doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({
    description: 'The parent directory ID',
    example: '507f1f77bcf86cd799439011',
    required: false,
  })
  @IsString()
  @IsOptional()
  parent_id?: string;

  @ApiProperty({
    description: 'The timestamp when the directory was updated',
    example: new Date(),
    required: false,
  })
  @IsDate()
  @IsOptional()
  updated_at?: Date;
}

class CreateResponse {
  @ApiProperty({
    description: 'The name of the directory',
    example: 'Documents',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The parent directory ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  parent_id: string;

  @ApiProperty({
    description: 'The directory ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  _id: string;
}

// Utility class for API documentation decorators
class DirDocs {
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
  findAll() {
    return DirDocs.init(
      {
        summary: 'Retrieve all directories',
        description:
          'Retrieve a list of all directory documents stored in MongoDB.',
      },
      ApiOkResponse({
        type: [CreateResponse],
      }),
    );
  }

  create() {
    return DirDocs.init(
      {
        summary: 'Create a new directory',
        description:
          'Create a new directory document in MongoDB with the provided details.',
      },
      ApiBody({
        type: CreateDirectory,
      }),
      ApiOkResponse({
        type: CreateResponse,
      }),
    );
  }

  findOne() {
    return DirDocs.init(
      {
        summary: 'Retrieve a directory by ID',
        description:
          'Retrieve a specific directory document from MongoDB using its unique ID.',
      },
      ApiOkResponse({
        type: CreateResponse,
      }),
    );
  }

  update() {
    return DirDocs.init(
      {
        summary: 'Update a directory by ID',
        description:
          'Update a specific directory document in MongoDB using its unique ID.',
      },
      ApiBody({
        type: UpdateDirectory,
      }),
      ApiOkResponse({
        type: UpdateDirectory,
      }),
    );
  }

  remove() {
    return DirDocs.init({
      summary: 'Delete a directory by ID',
      description:
        'Delete a specific directory document from MongoDB using its unique ID.',
    });
  }
}

export default new DirDocs();
