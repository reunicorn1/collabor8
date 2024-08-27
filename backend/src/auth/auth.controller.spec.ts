import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '@users/user.entity';
import { Repository } from 'typeorm';
import { EnvironmentMongoModule } from '@environment-mongo/environment-mongo.module';
import { MailModule } from '@mail/mail.module';
import { RedisModule } from '@redis/redis.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@constants';
import { BullModule } from '@nestjs/bullmq';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
            createUser: jest.fn(),
            // Add any other methods you use in AuthService
          },
        },
        {
          provide: getRepositoryToken(Users),
          useClass: Repository, // Mock Users repository if needed
        },
      ],
      imports: [
        PassportModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60s' },
        }),
        EnvironmentMongoModule,
        MailModule,
        RedisModule,
        BullModule.forRoot({
          connection: {
            host: 'localhost',
            port: 6379,
          },
        }),
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });
});

