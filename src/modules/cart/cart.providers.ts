import { Cart } from './cart.entity';

export const CartProviders = [
	{
		provide: 'CART_REPOSITORY',
		useValue: Cart,
	},
];
