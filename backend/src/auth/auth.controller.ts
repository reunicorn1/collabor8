import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
// import { AuthGuard } from '@auth/guards/auth.guard';
import { Public } from '@auth/decorators/isPublic.decorator';
import { ApiTags } from '@nestjs/swagger';
// import { RolesGuard } from '@auth/guards/roles.guard';
import {
  CreateUserDto,
  LoginUserDto,
  parseLoginDto,
} from '@users/dto/create-user.dto';
import { Users } from '@users/user.entity';
import { LocalAuthGuard } from '@auth/guards/local-auth.guard';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-jwt-auth.guard';
import docs from './auth-docs.decorator';

// TODO: Add guards and roles where necessary
// TODO: replace all endpoints that contain username with @Req() req
// TODO: the logs doesn't appear -_-
// TODO: strip input to remove any spaces
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @docs.ApiSignIn()
  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Request() req, @Response() res) {
    Logger.log('--------------->', { user: req.user });
    const { accessToken, refreshToken, user } = await this.authService.signIn(
      req.user,
    );
    res
      .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
      .cookie('accessToken', accessToken)
      .send({ accessToken, user });
  }

  @docs.ApiSignUp()
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

  @docs.ApiGetProfile()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }

  @docs.ApiRefreshToken()
  @Public()
  // @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req, @Response() res) {
    // console.log('req.cookies', req.cookies);
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
    const { accessToken } = await this.authService.refreshToken(refreshToken);
    res.send({ accessToken });
  }
}
