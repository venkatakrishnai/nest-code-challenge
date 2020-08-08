import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Cart extends Model<Cart> {
  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  productIds: JSON;
}
