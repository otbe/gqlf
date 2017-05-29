import { ArgumentParser } from 'argparse';
import { startServer } from './Server';

const parser = new ArgumentParser({
  version: require('../package.json').version,
  addHelp: true,
  description: 'GraphQL based File Explorer'
});

parser.addArgument(
  ['-p', '--port'],
  {
    help: 'Defines the express port which the server listens on (default 4000)',
    defaultValue: 4000
  }
);

const args = parser.parseArgs();

startServer(args.port);
