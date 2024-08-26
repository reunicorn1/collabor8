import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@auth/auth.service';
import { UsersService } from '@users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
            // Other methods of UsersService that might be used
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            // Other methods of JwtService that might be used
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user if validation is successful', async () => {
      const mockUser = { id: 1, username: 'test', password: 'hashedPassword' };
      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(authService, 'validatePassword').mockResolvedValue(true);

      const result = await authService.validateUser('test', 'password');
      expect(result).toEqual(mockUser);
    });

    it('should return null if validation fails', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

      const result = await authService.validateUser('test', 'password');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return a JWT token', async () => {
      const mockUser = { id: 1, username: 'test' };
      const mockToken = 'mockJwtToken';
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

      const result = await authService.login(mockUser);
      expect(result).toEqual({ access_token: mockToken });
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const mockUser = { id: 1, username: 'test', password: 'hashedPassword' };
      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser);

      const result = await authService.register({
        username: 'test',
        password: 'password',
      });
      expect(result).toEqual(mockUser);
    });
  });
});

