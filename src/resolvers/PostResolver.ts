import { Resolver, FieldResolver, Query, Mutation, ArgsType, Field, Args, Arg, Root } from 'type-graphql'
import { Post, Comment } from '../models'
import { getMongoRepository } from 'typeorm'

@ArgsType()
export class CreatePostArgs {
  @Field()
  title: string
  @Field()
  content: string
}

@Resolver(Post)
export class PostResvoler {

  constructor(
    private readonly postRepogitory = getMongoRepository(Post),
    private readonly commentRepogitory = getMongoRepository(Comment)
  ) {}

  @Query(() => [Post])
  public posts() {
    return this.postRepogitory.find()
  }

  @Query(() => Post)
  public post(@Arg('_id') _id: string) {
    return this.postRepogitory.findOne(_id)
  }

  @Mutation(() => Post)
  public async createPost(@Args() postArgs: CreatePostArgs) {
    const result = await this.postRepogitory.insertOne(postArgs)
    return this.postRepogitory.findOne(result.insertedId)
  }

  @FieldResolver(() => [Comment])
  public async comments(@Root() { _id }: Post) {
    return this.commentRepogitory.find({ postId: _id.toHexString() })
  }
}
