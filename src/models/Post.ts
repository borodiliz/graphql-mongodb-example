import { Comment } from './Comment'
import { ObjectID } from 'mongodb'
import { ObjectType, Field } from 'type-graphql'
import { Entity, ObjectIdColumn, Column } from 'typeorm'

@ObjectType()
@Entity()
export class Post {

  @ObjectIdColumn()
  @Field()
  id?: ObjectID

  @Column()
  @Field()
  title: string

  @Column()
  @Field()
  content: string

  @Field(() => [Comment])
  comments?: [Comment]
}
