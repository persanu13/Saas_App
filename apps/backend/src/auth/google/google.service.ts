import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AccountService } from '../account/account.service';
import { UserType } from 'generated/prisma/enums';

@Injectable()
export class GoogleService {
  constructor(
    private usersService: UsersService,
    private accountService: AccountService,
  ) {}
  async validateGoogleUser(googleUser: {
    provider: string;
    providerAccountId: any;
    email: any;
    name: any;
    type: UserType;
    picture: any;
    accessToken: string;
    refreshToken: string;
  }) {
    const existingAccount = await this.accountService.findOneByProvider(
      googleUser.provider,
      googleUser.providerAccountId,
      googleUser.type,
    );
    if (existingAccount) {
      return existingAccount.user;
    }
    const existingUser = await this.usersService.findByEmail(
      googleUser.email,
      googleUser.type,
    );
    if (existingUser) {
      await this.accountService.create(
        googleUser.provider,
        googleUser.providerAccountId,
        googleUser.accessToken,
        googleUser.refreshToken,
        existingUser.id,
      );
      return existingUser;
    }
    const newUser = await this.usersService.create(
      googleUser.email,
      googleUser.name,
      googleUser.type,
    );
    await this.accountService.create(
      googleUser.provider,
      googleUser.providerAccountId,
      googleUser.accessToken,
      googleUser.refreshToken,
      newUser.id,
    );
    return newUser;
  }
}
