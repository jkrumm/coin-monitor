import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { DateTime } from 'luxon';
import { TestDto } from './dtos/test.dto';

@Entity()
export class TestEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  created: string;

  @Column()
  message: string;

  @Column()
  likes: number;

  like(): TestEntity {
    this.likes++;
    return this;
  }

  constructor(message: string, likes: number) {
    this.created = DateTime.now().toISODate();
    this.message = message;
    this.likes = likes || 0;
  }

  toTestDto(): TestDto {
    return {
      id: this.id.toHexString(),
      created: this.created,
      message: this.message,
      likes: this.likes,
    };
  }
}
