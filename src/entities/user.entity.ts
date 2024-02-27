import { Column, Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "../common/abstract.entity";
import { Exclude } from "class-transformer";
import { AclUserRoleEntity } from "./acl-user-role.entity";

@Entity("user")
export class UserEntity extends AbstractEntity {
  @Column('varchar', { name: 'first_name', nullable: false})
  firstName: string;
  
  @Column('varchar', { name: 'last_name', nullable: false})
  lastName: string;
  
  @Column('varchar', { nullable: false})
  email: string;
  
  @Exclude()
  @Column('varchar', { nullable: false})
  password: string;

  @Exclude()
  @Column('varchar', { nullable: false})
  salt: string;


  @Column('varchar', { name: 'is_enabled', default: true, nullable: false })
  isEnabled: boolean;
  
  @Exclude()
  @Column('varchar', { name: 'reset_token' })
  resetToken: string;
  
  @OneToMany(() => AclUserRoleEntity, (e) => e.user)
  userRoles: Array<AclUserRoleEntity>;
}