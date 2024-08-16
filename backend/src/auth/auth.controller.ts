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
// import { RolesGuard } from '@auth/guards/roles.guard';
import { CreateUserDto, LoginUserDto } from '@users/dto/create-user.dto';
import { Users } from '@users/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() signInDto: LoginUserDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

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

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
