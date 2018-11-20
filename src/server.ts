
import { app, server } from './app'
import { initDB } from './db'

async function runServer() {
  await initDB()
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`)
  })
}

runServer()
  .catch(e => console.log(e))
