import { Column, Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "../common/abstract.entity";
import { AclUserRoleEntity } from "./acl-user-role.entity";
import { AclPermissionEntity } from "./acl-permission.entity";

@Entity("acl_role")
export class AclRoleEntity extends AbstractEntity {
  @Column()
  name: string;
  
  @Column('tinyint', { name: "is_enabled" })
  isEnabled: boolean;
  
  @OneToMany(() => AclUserRoleEntity, (e) => e.role)
  userRoles: Array<AclUserRoleEntity>
  
  @OneToMany(() => AclPermissionEntity, (e) => e.role)
  permissions: Array<AclPermissionEntity>
}