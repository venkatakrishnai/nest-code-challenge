import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Param,
	Body,
	NotFoundException,
	UseGuards,
	Request,
} from '@nestjs/common';

import { ProductsService } from './Products.service';
import { Product as ProductEntity } from './product.entity';
import { ProductDto } from './dto/product.dto';

@Controller('products')
export class ProductsController {
	constructor(private readonly productservice: ProductsService) {}

	@Get()
	async findAll() {
		// get all Products in the db
		return await this.productservice.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: number): Promise<ProductEntity> {
		const product = await this.productservice.findOne(id);

		if (!product) {
			throw new NotFoundException("This product doesn't exist");
		}

		return product;
	}

	@Post()
	async create(
		@Body() product: ProductDto,
		@Request() req,
	): Promise<ProductEntity> {
		return await this.productservice.create(product);
	}

	@Put(':id')
	async update(
		@Param('id') id: number,
		@Body() product: ProductDto,
		@Request() req,
	): Promise<ProductEntity> {
		const {
			numberOfAffectedRows,
			updatedProduct,
		} = await this.productservice.update(id, product);

		if (numberOfAffectedRows === 0) {
			throw new NotFoundException("This product doesn't exist");
		}
		return updatedProduct;
	}

	@Delete(':id')
	async remove(@Param('id') id: number, @Request() req) {
		const deleted = await this.productservice.delete(id);

		if (deleted === 0) {
			throw new NotFoundException("This product doesn't exist");
		}

		// return success message
		return 'Successfully deleted';
	}
}
