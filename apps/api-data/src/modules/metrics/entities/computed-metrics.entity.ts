import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IdentifiableDate, TimeTracked } from '@cm/api-common';

@Entity('computed_metrics')
export class ComputedMetrics implements IdentifiableDate, TimeTracked {
  // IdentifiableDate
  @PrimaryColumn({ type: 'date' })
  date: string;

  @Column()
  time: Date;

  // TimeTracked
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  // TODO: write after cm fetch before btc jobs
  @Column({ nullable: true })
  btcClose: number | null = null;

  @Column({ nullable: true })
  pyCycleBottomLong: number | null = null;

  @Column({ nullable: true })
  pyCycleBottomShort: number | null = null;

  @Column({ nullable: true })
  pyCycleTopLong: number | null = null;

  @Column({ nullable: true })
  pyCycleTopShort: number | null = null;

  constructor(date: string, time: Date) {
    this.date = date;
    this.time = time;
  }
}
