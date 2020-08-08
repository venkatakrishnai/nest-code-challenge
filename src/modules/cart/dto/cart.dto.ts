import { ArrayNotEmpty, IsArray } from 'class-validator';

export class CartDto {
	@ArrayNotEmpty()
	@IsArray()
	productIds: number[];
}
