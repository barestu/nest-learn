import { AclDto } from './acl.dto';
import { Acl } from '../enums/acl.enum';

export type AclPolicy = `${keyof AclDto}.${Acl}`;
