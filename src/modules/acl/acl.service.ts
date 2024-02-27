import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as shortid from 'shortid';
import { Repository } from 'typeorm';
import { CreateAcLUserRoleDto } from './dto/create-acl-user-role.dto';
import { AclUserRoleEntity } from '../../entities/acl-user-role.entity';
import { AclRoleEntity } from '../../entities/acl-role.entity';

@Injectable()
export class AclService {
  constructor(
    @InjectRepository(AclUserRoleEntity)
    public readonly aclUserRoleRepository: Repository<AclUserRoleEntity>,
    @InjectRepository(AclRoleEntity)
    private aclRoleRepository: Repository<AclRoleEntity>,
  ) {}

  async getRoleByName(roleName: string): Promise<string> {
    const roleResult = await this.aclRoleRepository.findOne({
      where: {
        name: roleName,
      },
    });

    if (roleResult) return roleResult.id;

    return null;
  }

  createAclUserRole(dto: CreateAcLUserRoleDto) {
    const aclUserRole = new AclUserRoleEntity();
    aclUserRole.id = shortid();
    aclUserRole.roleId = dto.roleId;
    aclUserRole.userId = dto.userId;
    return this.aclUserRoleRepository.save(aclUserRole);
  }
}
