import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import { schema } from './schema';
import { FileSystem } from './FileSystem';

export function startServer(port: number) {
  const app = express();

  app.use('/', express.static('.'));
  app.use('/graphql', graphqlHTTP(req => ({
    schema,
    context: {
      req,
      fs: new FileSystem()
    },
    formatError: (error: any) => ({
      message: error.message,
      locations: error.locations,
      stack: error.stack
    }),
    graphiql: true
  })));

  app.listen(port, () => {
    console.log(`Listen on http://localhost:${port}/graphql`);
  });
}
