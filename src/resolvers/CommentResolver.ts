import { Resolver, FieldResolver, Query, Mutation, ArgsType, Field, Args, Root, Arg } from 'type-graphql'
import { Post, Comment } from '../models'
import { getMongoRepository } from 'typeorm'

@ArgsType()
export class CreateCommentArgs {
  @Field()
  postId: string
  @Field()
  content: string
}

@Resolver(Post)
export class PostResvoler {

  constructor(
    private readonly postRepogitory = getMongoRepository(Post),
    private readonly commentRepogitory = getMongoRepository(Comment)
  ) {}

  @Query(() => [Comment])
  public comments(@Arg('postId') postId: string) {
    return this.commentRepogitory.find({ postId })
  }

  @Mutation(() => Comment)
  public async createComment(@Args() postArgs: CreateCommentArgs) {
    const result = await this.commentRepogitory.insertOne(postArgs)
    return this.commentRepogitory.findOne(result.insertedId)
  }

  @FieldResolver(() => Post)
  public async post(@Root() { postId }: Comment) {
    return this.postRepogitory.findOne(postId)
  }

}
