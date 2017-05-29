import { ArgumentParser } from 'argparse';
import { startServer } from './Server';

const parser = new ArgumentParser({
  version: '1.0.0',
  addHelp: true,
  description: 'GraphQL based File Explorer'
});

parser.addArgument(
  ['-p', '--port'],
  {
    help: 'Defines the express port which the server listens on',
    defaultValue: 4000
  }
);

const args = parser.parseArgs();

startServer(args.port);
