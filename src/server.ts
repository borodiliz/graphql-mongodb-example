import { createServer } from './app'

createServer()
  .then(({ app, server }) => {
    app.listen(process.env.PORT, () => {
      console.log(`Visit http://localhost:${process.env.PORT}${server.graphqlPath}`)
    })
  })
