import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'float', nullable: true })
  discountedPrice?: number | null;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 120 })
  sku: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  photoUrl?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


