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

import { ProductsService } from './products.service';
import { RulesService } from '../rules/rules.service';
import { RuleDto } from '../rules/dto/rule.dto';
import { Product as ProductEntity } from './product.entity';
import { ProductDto } from './dto/product.dto';
import { isEmpty } from 'lodash';

@Controller('products')
export class ProductsController {
	constructor(
		private readonly productservice: ProductsService,
		private readonly ruleservice: RulesService,
	) {}

	@Get()
	async findAll() {
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
		//create product
		let item = await this.productservice.create(product);

		if (!isEmpty(product.rule)) {
			let rule: RuleDto = product.rule;
			await this.ruleservice.create(rule, item.id);
		}

		return await this.productservice.findOne(item.id);
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

		if (!isEmpty(product.rule)) {
			let rule: RuleDto = product.rule;
			await this.ruleservice.create(rule, updatedProduct.id);
		} else {
			await this.ruleservice.deleteByProduct(updatedProduct.id);
		}

		return await this.productservice.findOne(updatedProduct.id);
	}

	@Delete(':id')
	async remove(@Param('id') id: number, @Request() req) {
		await this.ruleservice.deleteByProduct(id);

		const deleted = await this.productservice.delete(id);

		if (deleted === 0) {
			throw new NotFoundException("This product doesn't exist");
		}

		// return success message
		return 'Successfully deleted';
	}
}
