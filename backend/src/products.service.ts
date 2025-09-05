import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { Product } from './products/product.entity';
import { CreateProductDto } from './products/dto/create-product.dto';
import { UpdateProductDto } from './products/dto/update-product.dto';

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
    const limit = Math.max(1, Math.min(100, Number(params.limit || 10)));
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Product>[] = [];
    if (params.q) {
      where.push({ name: ILike(`%${params.q}%`) });
      where.push({ description: ILike(`%${params.q}%`) });
      where.push({ sku: ILike(`%${params.q}%`) });
    }

    const priceFilter: FindOptionsWhere<Product> = {};
    if (params.minPrice != null) priceFilter.price = (priceFilter.price as any) ?? {};
    if (params.minPrice != null) (priceFilter.price as any).gte = Number(params.minPrice);
    if (params.maxPrice != null) {
      priceFilter.price = (priceFilter.price as any) ?? {};
      (priceFilter.price as any).lte = Number(params.maxPrice);
    }

    const order: Record<string, 'ASC' | 'DESC'> = {};
    if (params.sort) {
      order[params.sort] = (params.order || 'ASC').toUpperCase() as 'ASC' | 'DESC';
    } else {
      order['createdAt'] = 'DESC';
    }

    const [data, total] = await this.productRepo.findAndCount({
      where: where.length ? where : undefined,
      order,
      take: limit,
      skip,
    });

    return { data, total, page, limit };
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
