import { AbstractDto } from "./dto/abstract.dto";
import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from "class-transformer";

export abstract class AbstractEntity<T extends AbstractDto = AbstractDto> {
  @PrimaryColumn()
  id: string;
  
  @CreateDateColumn({
    name: 'created_at'
  })
  createdAt?: Date;
  
  @Exclude()
  @UpdateDateColumn({
    name: 'updated_at'
  })
  updatedAt?: Date;
}