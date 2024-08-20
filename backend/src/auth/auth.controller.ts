import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
// import { AuthGuard } from '@auth/guards/auth.guard';
import { Public } from '@auth/decorators/isPublic.decorator';
// import { RolesGuard } from '@auth/guards/roles.guard';
import { CreateUserDto, LoginUserDto, parseLoginDto } from '@users/dto/create-user.dto';
import { Users } from '@users/user.entity';
import { LocalAuthGuard } from '@auth/guards/local-auth.guard';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
// TODO: Add guards and roles where necessary
// TODO: replace all endpoints that contain username with @Request() req
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Request() req) {
    console.log('req.user', req.user);
    return this.authService.signIn(req.user);
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
    console.log('req.user', req.user);
    return req.user;
  }

}
