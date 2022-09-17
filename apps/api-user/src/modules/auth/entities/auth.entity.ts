import { Identifiable, TimeTracked } from '@cm/api-common';
import { AuthDto } from '@cm/api-user/modules/auth/dtos/auth.dto';
import { Entity, Index, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity({ tableName: 'auth' })
export class Auth implements Identifiable, TimeTracked {
  //Identifiable
  @PrimaryKey()
  id: string = v4();

  @Property()
  @Index()
  email!: string;

  @Property()
  username: string | null = null;

  @Property({ hidden: true })
  password!: string;

  //TimeTracked
  @Property({ hidden: true, trackChanges: false })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date(), hidden: true, trackChanges: false })
  updatedAt: Date = new Date();

  constructor(email: string, username: string | null, password: string) {
    this.email = email;
    this.username = username;
    this.password = password;
  }

  toAuthDto(): AuthDto {
    return {
      authId: this.id,
      username: this.username,
      email: this.email,
    };
  }
}
