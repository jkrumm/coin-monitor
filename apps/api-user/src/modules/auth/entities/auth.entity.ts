import { Identifiable, TimeTracked } from '@cm/api-common';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AuthDto } from '@cm/api-user/modules/auth/dtos/auth.dto';

@Entity({ name: 'auth' })
export class Auth implements Identifiable, TimeTracked {
  //Identifiable
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  public email: string;

  @Column({
    length: 20,
    nullable: true,
  })
  public username: string | null;

  @Column({
    length: 100,
  })
  @Exclude()
  public password: string;

  //TimeTracked
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  constructor(email: string, username: string | null, password: string) {
    this.email = email;
    this.username = username;
    this.password = password;
  }

  toDto(): AuthDto {
    return {
      authId: this.id,
      username: this.username,
      email: this.email,
    };
  }
}
