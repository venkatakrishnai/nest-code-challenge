import {
	IsNotEmpty,
	IsNumber,
	IsObject,
	IsNotEmptyObject,
	ValidateNested,
	IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RuleDto } from '../../rules/dto/rule.dto';

export class ProductDto {
	@IsNotEmpty()
	readonly title: string;

	@IsNotEmpty()
	@IsNumber()
	readonly price: number;

	@IsOptional()
	@IsObject()
	@IsNotEmptyObject()
	@ValidateNested({ each: true })
	@Type(() => RuleDto)
	readonly rule: RuleDto;
}
