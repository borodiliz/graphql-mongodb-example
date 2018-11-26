module.exports = {
  srcDir: 'app',
  modules: [
    '@nuxtjs/apollo'
  ],
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: 'http://localhost:3001/graphql'
      }
    }
  }
}
