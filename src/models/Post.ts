import { Comment } from './Comment'
import { ObjectId } from 'mongodb'
import { ObjectType, Field } from 'type-graphql'
import { Entity, ObjectIdColumn, Column } from 'typeorm'

@ObjectType()
@Entity()
export class Post {

  @ObjectIdColumn()
  @Field()
  id?: ObjectId

  @Column()
  @Field()
  title: string

  @Column()
  @Field()
  content: string

  @Field(() => [Comment])
  comments?: [Comment]
}
