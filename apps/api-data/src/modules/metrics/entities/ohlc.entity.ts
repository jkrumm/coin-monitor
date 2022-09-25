import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IdentifiableDate, TimeTracked } from '@cm/api-common';

@Entity('ohlc')
export class OHLC implements IdentifiableDate, TimeTracked {
  // IdentifiableDate
  // @Column({ type: 'date' })
  @PrimaryColumn({ type: 'date' })
  date: string;

  @Column()
  time: Date;

  // TimeTracked
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  open: string | null;

  @Column({ type: 'varchar', nullable: true })
  high: string | null;

  @Column({ type: 'varchar', nullable: true })
  low: string | null;

  @Column({ type: 'varchar', nullable: true })
  close: string | null;

  @Column({ type: 'varchar', nullable: true })
  NVTAdjFF: string | null;

  @Column({ type: 'varchar', nullable: true })
  IssTotUSD: string | null;
}
