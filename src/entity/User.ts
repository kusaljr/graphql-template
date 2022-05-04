import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";

export enum Roles{
  ADMIN = "admin",
  USER = "user"
}

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("text")
  email: string;

  @Column("text")
  password: string;

  @Column("int", { default: 0 })
  tokenVersion: number;

  @Field()
  @Column("enum", {enum: Roles, default: Roles.USER})
  role: Roles


  @Field()
  @Column( {default: 99})
  age: number
}