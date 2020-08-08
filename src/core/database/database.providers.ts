import { Sequelize } from 'sequelize-typescript';

import { databaseConfig } from './database.config';
import { Product } from '../../modules/products/product.entity';

export const databaseProviders = [
  {
    provide: "SEQUELIZE",
    useFactory: async () => {
      let config = databaseConfig;
      const sequelize = new Sequelize(config);
      sequelize.addModels([ Product]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
