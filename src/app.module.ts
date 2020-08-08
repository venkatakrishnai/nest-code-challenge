import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { ProductsModule } from './modules/products/products.module';
import { RulesModule } from './modules/rules/rules.module';
import { CartModule } from './modules/cart/cart.module';
import { CheckoutModule } from './modules/checkout/checkout.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		DatabaseModule,
		ProductsModule,
		RulesModule,
		CartModule,
		CheckoutModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
