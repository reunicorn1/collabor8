import { Controller } from '@nestjs/common';
import { UsersService } from '@users/users.service';

// TODO: complete RESTful API for user entity
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
}
