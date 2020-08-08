import {
	IsNotEmpty,
	MinLength,
	IsNumber,
	IsObject,
	IsNotEmptyObject,
	ValidateNested,
} from 'class-validator';

export class ProductDto {
	@IsNotEmpty()
	readonly title: string;

	@IsNotEmpty()
	@IsNumber()
	readonly price: number;

	@IsObject()
	@IsNotEmptyObject()
	@ValidateNested()
	readonly rule: JSON;
}
