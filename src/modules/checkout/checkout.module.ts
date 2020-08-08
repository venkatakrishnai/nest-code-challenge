import { Module } from '@nestjs/common';

import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { CartService } from '../cart/cart.service';
import { CartProviders } from '../cart/cart.providers';
import { ProductsService } from '../products/products.service';
import { ProductsProviders } from '../products/products.providers';

@Module({
	providers: [
		CheckoutService,
		CartService,
		...CartProviders,
		ProductsService,
		...ProductsProviders,
	],
	controllers: [CheckoutController],
})
export class CheckoutModule {}
