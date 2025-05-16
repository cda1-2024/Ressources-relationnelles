import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../models/user.model';
import { UserService } from '../services/user/user.service';
import { IsEmailUniqueConstraint } from 'src/validators/is_email_unique/is-email-unique.validator';
import { IsUsernameUniqueConstraint } from 'src/validators/is_username_unique/is-username-unique.validator';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, IsEmailUniqueConstraint, IsUsernameUniqueConstraint],
  exports: [UserService],
})
export class UserModule {}
