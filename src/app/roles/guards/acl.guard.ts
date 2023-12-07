import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AclPolicy } from '../dto/acl-policy.dto';
import { CHECK_POLICIES_KEY } from '../decorators/check-policies.decorator';
import { RolesService } from '../roles.service';
import { AclDto } from '../dto/acl.dto';

@Injectable()
export class AclGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rolesService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    const roleId = user?.roleId;

    try {
      const role = await this.rolesService.findOne(roleId);

      const policyHandlers =
        this.reflector.get<AclPolicy[]>(
          CHECK_POLICIES_KEY,
          context.getHandler(),
        ) || [];

      return policyHandlers.every((handler) =>
        this.execPolicyHandler(handler, role.acl),
      );
    } catch (error) {
      throw new ForbiddenException();
    }
  }

  private execPolicyHandler(handler: AclPolicy, acl: AclDto) {
    const [entity, ability] = handler.split('.');
    return Object.entries(acl).find(
      ([key, values]) => key === entity && values.includes(ability),
    );
  }
}
