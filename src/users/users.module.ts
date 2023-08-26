import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { UserService } from './user.service'

@Module({
  controllers: [UsersController],
  providers: []
})
export class UsersModule {}
