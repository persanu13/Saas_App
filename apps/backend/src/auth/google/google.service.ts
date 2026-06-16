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
    // verific daca exista user cu email si type

    // daca da, verific daca exista accont si daca nu exista cont fac eu unul daca exista returnez userul
    // daca nu fac user cu account o singura comanda prisma

    const existingUser = await this.usersService.findByEmail(
      googleUser.email,
      googleUser.type,
    );

    if (existingUser) {
      const existingAccount = await this.accountService.findOneByProvider(
        googleUser.provider,
        googleUser.providerAccountId,
        googleUser.type,
        existingUser.id,
      );
      if (!existingAccount) {
        await this.accountService.create(
          googleUser.provider,
          googleUser.providerAccountId,
          googleUser.accessToken,
          googleUser.refreshToken,
          existingUser.id,
        );
      }
      return existingUser;
    } else {
      return await this.accountService.createWithUser(
        googleUser.email,
        googleUser.name,
        googleUser.type,
        googleUser.provider,
        googleUser.providerAccountId,
        googleUser.accessToken,
        googleUser.refreshToken,
      );
    }
  }
}
