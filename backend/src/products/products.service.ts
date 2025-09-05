import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { promises as fs } from 'fs';
import { join } from 'path';
import { Product } from './product.entity.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(data: CreateProductDto): Promise<Product> {
    const entity = this.productRepo.create(data);
    return this.productRepo.save(entity);
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'ASC' | 'DESC';
    q?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<{ data: Product[]; total: number; page: number; limit: number }>{
    const page = Math.max(1, Number(params.page || 1));
    const limit = Math.max(1, Math.min(100, Number(params.limit || 12)));

    const qb = this.productRepo.createQueryBuilder('p');

    if (params.q) {
      qb.andWhere(
        '(p.name ILIKE :q OR p.description ILIKE :q OR p.sku ILIKE :q)',
        { q: `%${params.q}%` },
      );
    }
    if (params.minPrice != null) {
      qb.andWhere('p.price >= :minPrice', { minPrice: Number(params.minPrice) });
    }
    if (params.maxPrice != null) {
      qb.andWhere('p.price <= :maxPrice', { maxPrice: Number(params.maxPrice) });
    }

    const sortField = (params.sort as string) || 'createdAt';
    const sortOrder = (params.order || 'DESC').toUpperCase() as 'ASC' | 'DESC';
    qb.orderBy(`p.${sortField}`, sortOrder);

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async clearPhoto(id: number): Promise<Product> {
    const item = await this.findOne(id);
    if (item.photoUrl) {
      const filename = item.photoUrl.split('/').pop();
      if (filename) {
        const filepath = join(__dirname, '..', '..', 'uploads', filename);
        await fs.unlink(filepath).catch(() => undefined);
      }
    }
    item.photoUrl = null;
    return this.productRepo.save(item);
  }

  async findOne(id: number): Promise<Product> {
    const item = await this.productRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Product not found');
    return item;
  }

  async update(id: number, data: UpdateProductDto): Promise<Product> {
    const item = await this.findOne(id);
    Object.assign(item, data);
    return this.productRepo.save(item);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await this.productRepo.remove(item);
  }
}
