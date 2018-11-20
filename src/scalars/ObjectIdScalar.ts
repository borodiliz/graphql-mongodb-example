import { GraphQLScalarType, Kind } from 'graphql'
import { ObjectID } from 'mongodb'

export const ObjectIdScalar = new GraphQLScalarType({
  name: 'ObjectID',
  description: 'Mongo Object id scalar type',
  parseValue: (value: string) => new ObjectID(value),
  serialize: (value: ObjectID) => value.toHexString(),
  parseLiteral: ast => {
    if (ast.kind === Kind.STRING) {
      return new ObjectID(ast.value)
    }
    return null
  }
})
