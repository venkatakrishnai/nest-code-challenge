import { Injectable, Inject } from '@nestjs/common';

import { Product } from './product.entity';
import { Rule } from '../rules/rule.entity';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private readonly productRepository: typeof Product,
  ) {}

  async create(product: ProductDto): Promise<Product> {
    return await this.productRepository.create<Product>({ ...product });
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.findAll<Product>({
      include: [{ model: Rule }],
    });
  }

  async findOne(id): Promise<Product> {
    return await this.productRepository.findOne({
      where: { id },
      include: [{ model: Rule }],
    });
  }

  async delete(id) {
    return await this.productRepository.destroy({ where: { id } });
  }

  async update(id, data) {
    const [
      numberOfAffectedRows,
      [updatedProduct],
    ] = await this.productRepository.update(
      { ...data },
      { where: { id }, returning: true },
    );
    return { numberOfAffectedRows, updatedProduct };
  }
}
