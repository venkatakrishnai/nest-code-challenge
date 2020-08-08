import { Product } from './product.entity';

export const ProductsProviders = [
	{
		provide: "PRODUCT_REPOSITORY",
		useValue: Product,
	},
];
