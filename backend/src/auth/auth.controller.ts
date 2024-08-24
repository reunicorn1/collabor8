import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
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

  // @docs.ApiSignOut()
  @HttpCode(HttpStatus.OK)
  @Delete('signout')
  async signOut(@Request() req, @Response() res) {
    // revoke session

    await this.authService.revokeAccessToken(req.user.jti);
    await this.authService.revokeRefreshToken(req.cookies.refreshToken);
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send({ message: 'Error signing out' });
      }
    });
    res
    .clearCookie('refreshToken')
    .clearCookie('accessToken')
    .clearCookie('connect.sid')
    .send({ message: 'Signed out' });
  }
  // password change
  // add avatar
  // add bio
  // add email validation
  // add password reset through email
  // projectShare invite email or notification

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
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
    const { accessToken } = await this.authService.refreshToken(refreshToken);
    res.send({ accessToken });
  }

  // @docs.ApiVerifyEmail()
  @Public()
  @Get('verify')
  async verifyEmail(@Request() req): Promise<{ message: string }> {
    return this.authService.verifyUser(req.query.token);
  }
}
