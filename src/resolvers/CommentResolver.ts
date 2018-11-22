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

@Resolver(Comment)
export class CommentResvoler {

  constructor(
    private readonly postRepogitory = getMongoRepository(Post),
    private readonly commentRepogitory = getMongoRepository(Comment)
  ) {}

  @Query(() => [Comment])
  public comments(@Arg('postId') postId: string) {
    return this.commentRepogitory.find({ postId })
  }

  @FieldResolver()
  public post(@Root() { postId }: Comment) {
    return this.postRepogitory.findOne(postId)
  }

  @Mutation(() => Comment)
  public async createComment(@Args() postArgs: CreateCommentArgs) {
    const result = await this.commentRepogitory.insertOne(postArgs)
    return this.commentRepogitory.findOne(result.insertedId)
  }

  @Mutation(() => Comment)
  public async removeComment(@Arg('id') id: string) {
    const comment = await this.commentRepogitory.findOne(id)
    if (!comment) {
      throw new Error(`Not found comment: ${id}`)
    }

    const result = await this.commentRepogitory.remove(comment)
    return result
  }

}
