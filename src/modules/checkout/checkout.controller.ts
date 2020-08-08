import {
	Controller,
	Get,
	Param,
	NotFoundException,
	Request,
	ParseIntPipe,
} from '@nestjs/common';

import { CheckoutService } from './checkout.service';
import { CartService } from '../cart/cart.service';
import { isEmpty } from 'lodash';

@Controller('checkout')
export class CheckoutController {
	constructor(
		private readonly cartService: CartService,
		private readonly checkoutService: CheckoutService,
	) {}

	@Get('cart/:id')
	async checkout(
		@Param('id') cartId: ParseIntPipe,
		@Request() req,
	): Promise<any> {
		let cart = await this.cartService.findOne(cartId);
		if (!cart) {
			throw new NotFoundException("This cart doesn't exist");
		}

		if (isEmpty(cart.dataValues.items)) {
			throw new NotFoundException("This cart doesn't have items");
		}

		await this.checkoutService.processCart(cart);

		cart.dataValues.items.map(item => {
			item.dataValues.discount_info = this.checkoutService.getDiscountInfoItem(
				item.id,
			);
		});

		cart.dataValues.total_amount = this.checkoutService.getTotalAmount();
		cart.dataValues.total_discount = this.checkoutService.getTotalDiscount();

		return cart;
	}
}
