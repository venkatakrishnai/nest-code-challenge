import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Param,
	Body,
	NotFoundException,
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
		private readonly productService: ProductsService,
		private readonly ruleService: RulesService,
	) {}

	@Get()
	async findAll() {
		return await this.productService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: number): Promise<ProductEntity> {
		const product = await this.productService.findOne(id);

		if (!product) {
			throw new NotFoundException("This product doesn't exist");
		}

		return product;
	}

	@Post()
	async create(@Body() product: ProductDto): Promise<ProductEntity> {
		//create product
		let item = await this.productService.create(product);

		if (!isEmpty(product.rule)) {
			let rule: RuleDto = product.rule;
			await this.ruleService.createOrUpdate(rule, item.id);
		}

		return await this.productService.findOne(item.id);
	}

	@Put(':id')
	async update(
		@Param('id') id: number,
		@Body() product: ProductDto,
	): Promise<ProductEntity> {
		const {
			numberOfAffectedRows,
			updatedProduct,
		} = await this.productService.update(id, product);

		if (numberOfAffectedRows === 0) {
			throw new NotFoundException("This product doesn't exist");
		}

		if (!isEmpty(product.rule)) {
			let rule: RuleDto = product.rule;
			await this.ruleService.createOrUpdate(rule, updatedProduct.id);
		} else {
			await this.ruleService.deleteByProduct(updatedProduct.id);
		}

		return await this.productService.findOne(updatedProduct.id);
	}

	@Delete(':id')
	async remove(@Param('id') id: number) {
		await this.ruleService.deleteByProduct(id);

		const deleted = await this.productService.delete(id);

		if (deleted === 0) {
			throw new NotFoundException("This product doesn't exist");
		}

		// return success message
		return 'Successfully deleted';
	}
}
