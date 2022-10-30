import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IdentifiableDate, TimeTracked } from '@cm/api-common';

@Entity('cm_raw_metrics')
export class CmRawMetrics implements IdentifiableDate, TimeTracked {
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

  @Column({ nullable: true })
  PriceUSD: number | null;

  @Column({ type: 'varchar', nullable: true })
  CapRealUSD: string | null;

  @Column({ type: 'varchar', nullable: true })
  CapMrktCurUSD: string | null;

  @Column({ type: 'varchar', nullable: true })
  CapMVRVCur: string | null;

  @Column({ type: 'varchar', nullable: true })
  NVTAdjFF: string | null;

  @Column({ type: 'varchar', nullable: true })
  IssTotUSD: string | null;
}
