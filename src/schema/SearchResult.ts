import { basename, join } from 'path';
import { Stats } from 'fs';
import { FileSystem, ISearchResult } from '../FileSystem';

const SearchResult = `
  type SearchResult {
    id: ID!
    name: String!
    path: String!
  }
`;

export const searchResultTypeResolvers = {
  SearchResult: {
    name(parent: ISearchResult) {
      return basename(parent.path);
    },

    path(parent: ISearchResult) {
      return join(process.cwd(), parent.path);
    }
  }
};

export const SearchResultType = () => [SearchResult];
