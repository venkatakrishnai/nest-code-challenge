import { Rule } from './rule.entity';

export const RulesProviders = [
	{
		provide: "RULE_REPOSITORY",
		useValue: Rule,
	},
];
