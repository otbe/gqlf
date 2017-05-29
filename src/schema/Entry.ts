import { IEntry } from '../FileSystem';

export const Entry = `
  union Entry = File | Directory
`;

export const entryTypeResolvers = {
  Entry: {
    __resolveType(obj: IEntry) {
      return obj.isDirectory ? 'Directory' : 'File';
    }
  }
};

export const EntryType = () => [Entry];
