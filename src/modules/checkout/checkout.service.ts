import { Injectable, Inject, NotFoundException } from '@nestjs/common';

import { Cart } from '../cart/cart.entity';
import { ProductsService } from '../products/products.service';
import { CartService } from '../cart/cart.service';
import { isEmpty, sum, map, find } from 'lodash';

@Injectable()
export class CheckoutService {
  public amounts = [];
  public totalCutoffAmount = 150;
  public totalCutoffDiscountAmount = 20;

  constructor(private readonly productsService: ProductsService) {}

  async processCart(cart) {
    if (!isEmpty(cart.productIds)) {
      let itemsWithCounts = await this.findItemCounts(cart.productIds);
      //[ { id: 1, count: 4 }, { id: 2, count: 2 }, { id: 3, count: 1 } ]

      this.amounts = await Promise.all(
        await itemsWithCounts.map(async pair => {
          return await this.getDiscountAmount(pair);
        }),
      );
    } else {
      return {};
    }
  }

  getTotalAmount(): number {
    let ttl = sum(map(this.amounts, 'total_price'));
    return ttl > this.totalCutoffAmount
      ? ttl - this.totalCutoffDiscountAmount
      : ttl;
  }

  getTotalDiscount(): number {
    let ttl = sum(map(this.amounts, 'total_price'));
    let dis = sum(map(this.amounts, 'discount'));
    return ttl > this.totalCutoffAmount
      ? dis + this.totalCutoffDiscountAmount
      : dis;
  }

  getDiscountInfoItem(id: number) {
    return find(this.amounts, { id: id });
  }

  async getDiscountAmount(pair) {
    let individualAmounts = {
      total_price: 0,
      discount: 0,
      ...pair,
    };
    let count = pair.count;
    let product = await this.productsService.findOne(pair.id);
    if (!product) {
      throw new NotFoundException(`product with id ${pair.id} doesn't exist`);
    }
    if (!isEmpty(product.rule)) {
      while (count >= product.rule.limit) {
        individualAmounts.total_price += product.rule.amount;
        individualAmounts.discount +=
          product.rule.limit * product.price - product.rule.amount;
        count -= product.rule.limit;
      }

      if (count > 0) {
        individualAmounts.total_price += count * product.price;
      }
    } else {
      individualAmounts.total_price += count * product.price;
    }
    //console.log('pair', pair);
    //console.log('individualAmounts', individualAmounts);
    return individualAmounts;
  }

  async findItemCounts(productIds) {
    var items = [],
      counts = [],
      prev;

    productIds.sort();
    productIds.forEach((productId, key) => {
      if (productId !== prev) {
        items.push(productId);
        counts.push(1);
      } else {
        counts[counts.length - 1]++;
      }
      prev = productId;
    });
    return items.map((productId, key) => {
      return {
        id: productId,
        count: counts[key],
      };
    });
  }
}
