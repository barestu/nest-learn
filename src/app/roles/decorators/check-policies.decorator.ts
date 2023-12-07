import { SetMetadata } from '@nestjs/common';
import { AclPolicy } from '../dto/acl-policy.dto';

export const CHECK_POLICIES_KEY = 'check-policies';
export const CheckPolicies = (...handlers: AclPolicy[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
