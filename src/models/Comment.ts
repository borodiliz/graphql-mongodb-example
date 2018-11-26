import { Post } from './Post'
import { ObjectId } from 'mongodb'
import { ObjectType, Field } from 'type-graphql'
import { Entity, ObjectIdColumn, Column } from 'typeorm'

@ObjectType()
@Entity()
export class Comment {

  @ObjectIdColumn()
  @Field()
  id?: ObjectId

  @Column()
  @Field()
  postId: string

  @Column()
  @Field()
  content: string

  @Field(() => Post)
  post?: Post
}
