import { Identifiable, TimeTracked } from '@cm/api-common';
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity({ tableName: 'test' })
export class Test implements Identifiable, TimeTracked {
  constructor(text: string) {
    this.text = text;
  }

  //Identifiable
  @PrimaryKey()
  id: string = v4();

  @Property()
  text!: string;

  //TimeTracked
  @Property({ hidden: true })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date(), hidden: true })
  updatedAt: Date = new Date();
}
