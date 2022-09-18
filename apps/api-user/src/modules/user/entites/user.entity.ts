import { Identifiable, TimeTracked } from '@cm/api-common';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserDto } from '@cm/api-user/modules/user/dtos/user.dto';

@Entity({ name: 'user' })
export class User implements Identifiable, TimeTracked {
  //Identifiable
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column()
  authId: string;

  //TimeTracked
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  constructor(authId: string) {
    this.authId = authId;
  }

  toDto(): UserDto {
    return { authId: this.authId };
  }
}
