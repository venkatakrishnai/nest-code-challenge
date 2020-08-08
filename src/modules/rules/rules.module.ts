import { Module } from '@nestjs/common';

import { RulesService } from './rules.service';
import { RulesProviders } from './rules.providers';

@Module({
	providers: [RulesService, ...RulesProviders],
	controllers: [],
})
export class RulesModule {}
