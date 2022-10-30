import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IdentifiableDate, TimeTracked } from '@cm/api-common';
import { MetricsEventSignal } from '@cm/types';

export enum MetricsEventType {
  PY_CYCLE = 'py_cycle',
}

@Entity('metrics_event')
export class MetricsEvent implements IdentifiableDate, TimeTracked {
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

  @Column({ type: 'varchar' })
  type: MetricsEventType;

  @Column()
  btcClose: number;

  @Column({ type: 'varchar' })
  signal: MetricsEventSignal;

  constructor(
    date: string,
    time: Date,
    type: MetricsEventType,
    btcClose: number,
    signal: MetricsEventSignal,
  ) {
    this.date = date;
    this.time = time;
    this.type = type;
    this.btcClose = btcClose;
    this.signal = signal;
  }
}
