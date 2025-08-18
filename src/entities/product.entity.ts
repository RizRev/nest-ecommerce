import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  attachmentKey: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  attachmentMime: string | null;

  @Column({ type: 'int', nullable: true })
  attachmentSize: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  attachmentOriginalName: string | null;
}
