import { basename, join } from 'path';
import { Stats } from 'fs';
import { FileSystem, IEntry } from '../FileSystem';
import { Context } from './Context';
import { ListArgs } from './index';

const Directory = `
  type Directory {
    id: ID!
    name: String!
    path: String!
    content(limit: Int, offset: Int): [Entry]!
  }
`;

export const directoryTypeResolvers = {
  Directory: {
    name(parent: IEntry) {
      return basename(parent.path);
    },

    path(parent: IEntry) {
      return join(process.cwd(), parent.path);
    },

    async content(parent: IEntry, { limit = 20, offset = 0 }: ListArgs, { fs }: Context) {
      return fs.list(parent.path + '/', offset, limit);
    }
  }
};

export const DirectoryType = () => [Directory];
