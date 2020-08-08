import { Injectable, Inject } from '@nestjs/common';

import { Rule } from './rule.entity';
import { RuleDto } from './dto/rule.dto';

@Injectable()
export class RulesService {
  constructor(
    @Inject('RULE_REPOSITORY')
    private readonly ruleRepository: typeof Rule,
  ) {}

  async create(rule: RuleDto, productId: number): Promise<Rule> {
    let whereCondition = {
      productId: productId,
    };
    return await this.ruleRepository
      .findOne({ where: whereCondition })
      .then(async ruleOb => {
        if (ruleOb) return await ruleOb.update(rule);
        return await this.ruleRepository.create<Rule>({ ...rule, productId });
      });
  }

  async deleteByProduct(productId) {
    return await this.ruleRepository.destroy({ where: { productId } });
  }

  async delete(id) {
    return await this.ruleRepository.destroy({ where: { id } });
  }
}
