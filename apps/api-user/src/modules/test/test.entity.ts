import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Identifiable, TimeTracked } from '@coin-monitor/api-common';

@Entity({ name: 'test' })
export class Test implements Identifiable, TimeTracked {
  constructor(text: string) {
    this.text = text;
  }

  //Identifiable
  @PrimaryGeneratedColumn('uuid')
  id: string;

  //TimeTracked
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  text: string;
}
