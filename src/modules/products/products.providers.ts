import { Product } from './product.entity';

export const productsProviders = [
	{
		provide: "PRODUCT_REPOSITORY",
		useValue: Product,
	},
];
