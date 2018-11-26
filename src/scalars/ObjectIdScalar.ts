import { GraphQLScalarType, Kind } from 'graphql'
import { ObjectId } from 'mongodb'

export const ObjectIdScalar = new GraphQLScalarType({
  name: 'ObjectId',
  description: 'Mongo Object id scalar type',
  parseValue: (value: string) => new ObjectId(value),
  serialize: (value: ObjectId) => value.toHexString(),
  parseLiteral: ast => {
    if (ast.kind === Kind.STRING) {
      return new ObjectId(ast.value)
    }
    return null
  }
})
