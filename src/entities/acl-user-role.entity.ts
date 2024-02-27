import { Column, Entity, ManyToOne, PrimaryColumn, JoinColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { AclRoleEntity } from "./acl-role.entity";

@Entity("acl_user_role")
export class AclUserRoleEntity {
  @PrimaryColumn()
  id: string;
  
  @Column("varchar", { name: "role_id" })
  roleId: string;
  
  @Column("varchar", { name: "user_id" })
  userId: string;
  
  @ManyToOne(() => AclRoleEntity, (e) => e.userRoles)
  @JoinColumn({
    name: "role_id",
    referencedColumnName: "id"
  })
  role: AclRoleEntity;
  
  @ManyToOne(() => UserEntity, (e) => e.userRoles)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id"
  })
  user: UserEntity;
}