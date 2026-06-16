import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { OrganizationsService } from 'src/organizations/organizations.service';

@Injectable()
export class OrganizationContextGuard implements CanActivate {
  constructor(private organizationsService: OrganizationsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return false;
    const lastActiveOrganization =
      await this.organizationsService.getLastOrganization(user.sub);
    if (!lastActiveOrganization) return false;
    const member =
      await this.organizationsService.getMemberByUserAndOrganization(
        user.sub,
        lastActiveOrganization.id,
      );
    if (!member) return false;
    request.currentOrganization = lastActiveOrganization;
    request.currentMember = member;
    return true;
  }
}
