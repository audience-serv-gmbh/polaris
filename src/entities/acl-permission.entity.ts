import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AbstractEntity } from "../common/abstract.entity";
import { Exclude } from "class-transformer";
import { AclRoleEntity } from "./acl-role.entity";

@Entity("acl_permission")
export class AclPermissionEntity extends AbstractEntity {
  @Exclude()
  @Column('varchar', { name: "role_id" })
  roleId: string;
  
  @Column('varchar')
  name: string
  
  @ManyToOne(() => AclRoleEntity, (e) => e.permissions)
  @JoinColumn({
    name: 'role_id',
    referencedColumnName: 'id'
  })
  role: AclRoleEntity
}