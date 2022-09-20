import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IdentifiableDate, TimeTracked } from '@cm/api-common';

@Entity('coin_metrics_raw')
export class CoinMetricsRaw implements IdentifiableDate, TimeTracked {
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
  PriceUSD: string | null;

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
