import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  // UseGuards,
} from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
// import { AuthGuard } from '@auth/guards/auth.guard';
import { Public } from '@auth/decorators/isPublic.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
// import { RolesGuard } from '@auth/guards/roles.guard';
import { CreateUserDto, LoginUserDto } from '@users/dto/create-user.dto';
import { Users } from '@users/user.entity';
// TODO: Add guards and roles where necessary
// TODO: replace all endpoints that contain username with @Request() req
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'User Sign In',
    description: 'Sign in to the application using a username and password.',
  })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() signInDto: LoginUserDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @ApiOperation({
    summary: 'User Sign Up',
    description:
      'Create a new user account by providing the required user details.',
  })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto): Promise<Users> {
    try {
      return this.authService.signUp(createUserDto);
    } catch (error) {
      // console.error(error);
      return error;
    }
  }

  @ApiOperation({
    summary: 'Get User Profile',
    description: 'Retrieve the profile of the currently authenticated user.',
  })
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
