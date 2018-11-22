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
  public post(@Arg('id') id: string) {
    return this.postRepogitory.findOne(id)
  }

  @Mutation(() => Post)
  public async createPost(@Args() postArgs: CreatePostArgs) {
    const result = await this.postRepogitory.insertOne(postArgs)
    return this.postRepogitory.findOne(result.insertedId)
  }

  @Mutation(() => Post)
  public async removePost(@Arg('id') id: string) {
    const post = await this.postRepogitory.findOne(id)
    if (!post) {
      throw new Error(`Not found post: ${id}`)
    }

    const result = await this.postRepogitory.remove(post)
    return result
  }

  @FieldResolver()
  public async comments(@Root() { id }: Post) {
    return this.commentRepogitory.find({ postId: id.toHexString() })
  }
}
