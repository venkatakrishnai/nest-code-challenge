import {
	Controller,
	Get,
	Post,
	Put,
	Param,
	Body,
	NotFoundException,
} from '@nestjs/common';

import { CartService } from './cart.service';
import { Cart as CartEntity } from './cart.entity';
import { CartDto } from './dto/cart.dto';
import { isEmpty } from 'lodash';

@Controller('cart')
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@Get()
	async findAll() {
		return await this.cartService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: number): Promise<CartEntity> {
		const cart = await this.cartService.findOne(id);

		if (!cart) {
			throw new NotFoundException("This cart doesn't exist");
		}

		return cart;
	}

	@Post()
	async create(@Body() cart: CartDto): Promise<CartEntity> {
		cart.productIds = cart.productIds.map(val => +val);
		return await this.cartService.create(cart);
	}

	@Put(':id')
	async update(
		@Param('id') id: number,
		@Body() cart: CartDto,
		@Request() req,
	): Promise<CartEntity> {
		cart.productIds = cart.productIds.map(val => +val);
		const { numberOfAffectedRows, updatedCart } = await this.cartService.update(
			id,
			cart,
		);

		if (numberOfAffectedRows === 0) {
			throw new NotFoundException("This cart doesn't exist");
		}

		return updatedCart;
	}
}
