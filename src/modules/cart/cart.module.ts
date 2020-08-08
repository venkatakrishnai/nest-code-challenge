import { Module } from '@nestjs/common';

import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartProviders } from './cart.providers';
import { ProductsService } from '../products/products.service';
import { ProductsProviders } from '../products/products.providers';

@Module({
	providers: [
		CartService,
		...CartProviders,
		ProductsService,
		...ProductsProviders,
	],
	controllers: [CartController],
})
export class CartModule {}
