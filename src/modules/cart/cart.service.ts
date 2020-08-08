import { Injectable, Inject } from '@nestjs/common';

import { Cart } from './cart.entity';
import { CartDto } from './dto/cart.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @Inject('CART_REPOSITORY')
    private readonly cartRepository: typeof Cart,
    private readonly productsService: ProductsService,
  ) {}

  async findAll(): Promise<any> {
    let carts = await this.cartRepository.findAll<any>();
    return await Promise.all(
      carts.map(async cart => {
        cart.dataValues.items = await this.productsService.getProductsByIds(
          cart.productIds,
        );
        return cart;
      }),
    );
  }

  async findOne(id): Promise<any> {
    let cart = await this.cartRepository.findOne<any>({
      where: { id },
    });
    if (cart) {
      cart.dataValues.items = await this.productsService.getProductsByIds(
        cart.productIds,
      );
    }
    return cart;
  }

  async create(cart: CartDto): Promise<Cart> {
    return await this.cartRepository.create<Cart>({ ...cart });
  }

  async update(id, cart: CartDto) {
    const [
      numberOfAffectedRows,
      [updatedCart],
    ] = await this.cartRepository.update(
      { ...cart },
      { where: { id }, returning: true },
    );
    return { numberOfAffectedRows, updatedCart };
  }

  async delete(id) {
    return await this.cartRepository.destroy({ where: { id } });
  }
}
