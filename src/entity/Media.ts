import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";


@ObjectType()
@Entity("media")
export class Media extends BaseEntity {
  
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  media_id: number;

  @Field()
  @Column("text")
  path: string;
}