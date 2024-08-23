import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { encryptPwd } from '@utils/encrypt_password';
import { IsOptional } from 'class-validator';
// TODO: create dto for all the entities
//
class CreateUserDto {
  @ApiProperty({ example: 'john_doe' })
  @IsOptional()
  username: string;
  @ApiProperty({ example: 'Moe' })
  first_name: string;
  @ApiProperty({ example: 'Elfadil' })
  last_name: string;
  @ApiProperty({ example: 'a@b.com' })
  email: string;
  @ApiProperty({ example: 'password' })
  password: string;
  @ApiProperty({ example: [] })
  favorite_languages: string[];
}

interface CreateUserOutDto {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  favorite_languages: string[];
}

class LoginUserDto {
  @ApiProperty({ example: 'Reem Sweetie' })
  username: string;
  @ApiProperty({ example: 'unicorn' })
  password: string;
}

function validateCreateUserDto(dto: CreateUserDto): CreateUserOutDto {
  if (!dto || typeof dto !== 'object') {
    throw new BadRequestException('Invalid input');
  }
  const {
    username,
    first_name,
    last_name,
    email,
    password,
    favorite_languages,
  } = dto;

  for (const field of [
    'username',
    'first_name',
    'last_name',
    'email',
    'password',
  ]) {
    if (typeof dto[field] !== 'string' || dto[field].trim() === '') {
      throw new BadRequestException(
        `${field} is required and must be a string`,
      );
    }
  }
  if (!Array.isArray(favorite_languages)) {
    throw new BadRequestException('favorite_languages must be an array');
  }

  for (const language of favorite_languages) {
    if (typeof language !== 'string' || language.trim() === '') {
      throw new BadRequestException(
        'favorite_languages must be an array of strings',
      );
    }
  }

  const password_hash = encryptPwd(password);

  return {
    username: username.trim(),
    first_name: first_name.trim(),
    last_name: last_name.trim(),
    email: email.trim(),
    password_hash: password_hash.trim(),
    favorite_languages: favorite_languages.map((lang) => lang.trim()),
  };
}

function parseCreateUserDto(requestBody: any): CreateUserOutDto {
  const validated = validateCreateUserDto(requestBody);
  return validated;
}

function validateLoginUserDto(dto: any): LoginUserDto {
  if (!dto || typeof dto !== 'object') {
    throw new BadRequestException('Invalid input');
  }

  const { username, password } = dto;

  for (const field of ['username', 'password']) {
    if (typeof dto[field] !== 'string' || dto[field].trim() === '') {
      throw new BadRequestException(
        `${field} is required and must be a string`,
      );
    }
  }

  return {
    username: username.trim(),
    password: password.trim(),
  };
}

function parseLoginDto(requestBody: any): LoginUserDto {
  const validated = validateLoginUserDto(requestBody);
  return validated;
}

export { parseCreateUserDto, CreateUserDto, LoginUserDto, parseLoginDto };
