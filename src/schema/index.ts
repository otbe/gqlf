import { makeExecutableSchema } from 'graphql-tools';
import { toGlobalId, fromGlobalId } from 'graphql-relay';
import { FileType, fileTypeResolvers } from './File';
import { DirectoryType, directoryTypeResolvers } from './Directory';
import { EntryType, entryTypeResolvers } from './Entry';
import { SearchResultType, searchResultTypeResolvers } from './SearchResult';
import { FileSystem, IEntry } from '../FileSystem';
import { Context } from './Context';

export interface ListArgs {
  limit?: number;
  offset?: number;
}

export interface SearchArgs extends ListArgs {
  name?: string;
  path?: string;
}

const rootResolver = {
  RootQuery: {
    async search(_: any, { limit = 20, offset = 0, name = '', path = '' }: SearchArgs, { fs }: Context) {
      return fs.search(path, name, offset, limit);
    },
    async list(_: any, { limit = 20, offset = 0 }: ListArgs, { fs }: Context) {
      return fs.list('', offset, limit);
    },
    async node(_: any, { id }: { id: string }, { fs }: Context): Promise<IEntry> {
      const path = fromGlobalId(id).id;
      const stats = await fs.getStats(path);

      return {
        id,
        path,
        isDirectory: stats.isDirectory()
      };
    }
  }
};

const RootQuery = `
  type RootQuery {
    search(path: String, name: String, offset: Int, limit: Int): [SearchResult]!
    list(limit: Int, offset: Int): [Entry]!
    node(id: ID!): Entry
  }
`;

const SchemaDefinition = `
  schema {
    query: RootQuery
  }
`;

export const schema = makeExecutableSchema({
  typeDefs: [SchemaDefinition, RootQuery, FileType, DirectoryType, SearchResultType, EntryType],
  resolvers: { ...rootResolver, ...fileTypeResolvers, ...directoryTypeResolvers, ...searchResultTypeResolvers, ...entryTypeResolvers }
});
