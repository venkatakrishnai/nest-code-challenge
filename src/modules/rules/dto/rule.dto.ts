import { IsNotEmpty, IsNumber } from 'class-validator';

export class RuleDto {
	@IsNotEmpty()
	@IsNumber()
	readonly limit: number;

	@IsNotEmpty()
	@IsNumber()
	readonly amount: number;
}
