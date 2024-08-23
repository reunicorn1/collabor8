import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import { IsString, IsOptional, IsDate } from 'class-validator';

// For Documrntation purpose
export class CreateFileDto {
  @ApiProperty({
    description: 'The name of the file',
    example: 'README.md',
  })
  @IsString()
  file_name: string;

  @ApiProperty({
    description: 'The parent directory ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  parent_id: string;

  @ApiProperty({
    description: 'The project ID',
    example: '507f1f77bcf86cd799439012',
  })
  @IsString()
  project_id: string;

  @ApiProperty({
    description: 'The content of the file',
    example: 'File content here',
    required: false,
  })
  @IsString()
  @IsOptional()
  file_content?: string;
}

export class UpdateFileDto {
  @ApiProperty({
    description: 'The name of the file',
    example: 'main.tsx',
    required: false,
  })
  @IsString()
  @IsOptional()
  file_name?: string;

  @ApiProperty({
    description: 'The parent directory ID',
    example: '507f1f77bcf86cd799439011',
    required: false,
  })
  @IsString()
  @IsOptional()
  parent_id?: string;

  @ApiProperty({
    description: 'The project ID',
    example: '507f1f77bcf86cd799439012',
    required: false,
  })
  @IsString()
  @IsOptional()
  project_id?: string;

  @ApiProperty({
    description: 'The content of the file',
    example: 'Updated file content here',
    required: false,
  })
  @IsString()
  @IsOptional()
  file_content?: string;

  @ApiProperty({
    description: 'The timestamp when the file was updated',
    example: new Date(),
    required: false,
  })
  @IsDate()
  @IsOptional()
  updated_at?: Date;
}

export class FileResponseDto {
  @ApiProperty({
    description: 'The name of the file',
    example: 'main.c',
  })
  @IsString()
  file_name: string;

  @ApiProperty({
    description: 'The parent directory ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  parent_id: string;

  @ApiProperty({
    description: 'The project ID',
    example: '507f1f77bcf86cd799439012',
  })
  @IsString()
  project_id: string;

  @ApiProperty({
    description: 'The file ID',
    example: '507f1f77bcf86cd799439013',
  })
  @IsString()
  _id: string;
}

// Utility class for API documentation decorators
class FileDocs {
  static init({ summary, description }, ...args) {
    return applyDecorators(ApiOperation({ summary, description }), ...args);
  }

  @ApiBearerAuth()
  findAll() {
    return FileDocs.init(
      {
        summary: 'Retrieve all files',
        description: 'Retrieve a list of all file documents stored in MongoDB.',
      },
      ApiOkResponse({ type: [FileResponseDto] }),
    );
  }

  create() {
    return FileDocs.init(
      {
        summary: 'Create a new file',
        description:
          'Create a new file document in MongoDB with the provided details.',
      },
      ApiBody({ type: CreateFileDto }),
      ApiOkResponse({ type: FileResponseDto }),
    );
  }

  findOne() {
    return FileDocs.init(
      {
        summary: 'Retrieve a file by ID',
        description:
          'Retrieve a specific file document from MongoDB using its unique ID.',
      },
      ApiOkResponse({ type: FileResponseDto }),
    );
  }

  update() {
    return FileDocs.init(
      {
        summary: 'Update a file by ID',
        description:
          'Update a specific file document in MongoDB using its unique ID.',
      },
      ApiBody({ type: UpdateFileDto }),
      ApiOkResponse({ type: FileResponseDto }),
    );
  }

  remove() {
    return FileDocs.init({
      summary: 'Delete a file by ID',
      description:
        'Delete a specific file document from MongoDB using its unique ID.',
    });
  }
}
export default new FileDocs();
