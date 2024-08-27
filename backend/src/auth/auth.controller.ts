import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
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
  ResetPasswordDto,
} from '@users/dto/create-user.dto';
import { Users } from '@users/user.entity';
import { LocalAuthGuard } from '@auth/guards/local-auth.guard';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-jwt-auth.guard';
import docs from './auth-docs.decorator';
import { v4 as uuidv4 } from 'uuid';

// TODO: Add guards and roles where necessary
// TODO: replace all endpoints that contain username with @Req() req
// TODO: the logs doesn't appear -_-
// TODO: strip input to remove any spaces
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @docs.ApiSignIn()
  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Request() req, @Response() res) {
    //Logger.log('--------------->', { user: req.user });
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
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async create(
    @Body() createUserDto: CreateUserDto & { is_invited?: boolean },
    @Response() res,
  ) {
    try {
      const user = await this.authService.signUp(createUserDto);
      const payload = {
        username: user.username,
        sub: user.user_id,
        roles: user.roles,
        timestamp: new Date().getTime(),
        jti: uuidv4(),
      };

      if (createUserDto.is_invited) {
        // edge case for invited guest
        // will be verified directly after signup
        const { accessToken, refreshToken } =
          await this.authService.generateTokens(payload);
        res
          .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
          })
          .cookie('accessToken', accessToken)
          .send({ accessToken, user });
      } else {
        return (user);
      }
    } catch (error) {
      throw error;
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
  async verifyEmail(@Request() req, @Response() res) {
    const { refreshToken, accessToken, user } = await this.authService.verifyUser(req.query.token);
    res
      .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
      .cookie('accessToken', accessToken)
      .send({ accessToken, user });
  }

  // @Docs.resetPassword()
  @Patch('me/change-password')
  async changePassword(
    @Request() req,
  ): Promise<{ message: string }> {
    console.log('req.user', req.body);
    return await this.authService.resetPassword(
      req.user.username,
      req.body.old,
      req.body.new,
    );
  }

  // TODO: send email to user with reset password link
  @Public()
  @Post('me/reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { email } = resetPasswordDto;
    return await this.authService.sendResetPasswordEmail(email);
  }
  // after user clicks forgot password, send link in email
  // user clicks link, redirect to reset password page
  // user enters new password
  // backend validates token and updates password
  // user is redirected to login page
  @Public()
  @Post('validate-reset-token')
  async validateResetToken(
    @Request() req,
  ): Promise<{ message: string }> {
    return await this.authService.validateToken(req.query.token, req.body.password);
  }
}
