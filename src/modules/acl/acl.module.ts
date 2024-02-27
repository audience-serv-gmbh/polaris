import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AclRoleEntity } from '../../entities/acl-role.entity';
import { AclPermissionEntity } from '../../entities/acl-permission.entity';
import { AclUserRoleEntity } from '../../entities/acl-user-role.entity';
import { AclService } from './acl.service';

@Module({
  imports: [TypeOrmModule.forFeature([AclRoleEntity, AclPermissionEntity, AclUserRoleEntity])],
  providers: [AclService],
  exports: [AclService]
})
export class AclModule{}