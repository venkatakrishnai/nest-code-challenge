import { Table, Column, Model, DataType, HasOne } from 'sequelize-typescript';

import { Rule } from '../rules/rule.entity';

@Table
export class Product extends Model<Product> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  price: number;

  @HasOne(() => Rule)
  rule: Rule;
}
