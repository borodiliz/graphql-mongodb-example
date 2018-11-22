import { Post } from './Post'
import { ObjectID } from 'mongodb'
import { ObjectType, Field } from 'type-graphql'
import { Entity, ObjectIdColumn, Column } from 'typeorm'

@ObjectType()
@Entity()
export class Comment {

  @ObjectIdColumn()
  @Field()
  id?: ObjectID

  @Column()
  @Field()
  postId: string

  @Column()
  @Field()
  content: string

  @Field(() => Post)
  post?: Post
}
