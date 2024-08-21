import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import {
  ApiSignIn,
  ApiSignUp,
  ApiGetProfile,
  ApiRefreshToken,
} from './auth-docs.decorator';

// TODO: Add guards and roles where necessary
// TODO: replace all endpoints that contain username with @Request() req
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiSignIn()
  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Request() req, @Response() res) {
    const { accessToken, refreshToken } = await this.authService.signIn(
      req.user,
    );
    res
      .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
      .cookie('accessToken', accessToken)
      .send({ accessToken });
  }

  @ApiSignUp()
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

  @ApiGetProfile()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    console.log('req.user', req.user);
    return req.user;
  }

  @ApiRefreshToken()
  @Public()
  // @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req, @Response() res) {
    console.log('req.cookies', req.cookies);
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
    const { accessToken } = await this.authService.refreshToken(refreshToken);
    console.log('accessToken', accessToken === req.cookies.accessToken);
    res.send({ accessToken });
  }
}
