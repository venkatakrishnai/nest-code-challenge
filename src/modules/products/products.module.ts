import { Module } from '@nestjs/common';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsProviders } from './products.providers';
import { RulesService } from '../rules/rules.service';
import { RulesProviders } from '../rules/rules.providers';

@Module({
	providers: [
		ProductsService,
		...ProductsProviders,
		RulesService,
		...RulesProviders,
	],
	controllers: [ProductsController],
})
export class ProductsModule {}
