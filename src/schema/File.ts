import { basename, join } from 'path';
import { Stats } from 'fs';
import { FileSystem, IEntry } from '../FileSystem';
import { Request } from 'express';
import { Context } from './Context';

const File = `
  type File {
    id: ID!
    name: String!
    path: String!
    downloadUrl: String!
    size: Int!
    atime: String!
    mtime: String!
    ctime: String!
    birthtime: String!
  }
`;

export const fileTypeResolvers = {
  File: {
    name(parent: IEntry) {
      return basename(parent.path);
    },

    path(parent: IEntry) {
      return join(process.cwd(), parent.path);
    },

    downloadUrl(parent: IEntry, _: any, { req }: Context) {
      return req.protocol + '://' + req.get('host') + '/' + parent.path;
    },

    async size(parent: IEntry, _: any, { fs }: Context) {
      return (await fs.getStats(parent.path)).size;
    },

    async atime(parent: IEntry, _: any, { fs }: Context) {
      return (await fs.getStats(parent.path)).atime;
    },

    async mtime(parent: IEntry, _: any, { fs }: Context) {
      return (await fs.getStats(parent.path)).mtime;
    },

    async ctime(parent: IEntry, _: any, { fs }: Context) {
      return (await fs.getStats(parent.path)).ctime;
    },

    async birthtime(parent: IEntry, _: any, { fs }: Context) {
      return (await fs.getStats(parent.path)).birthtime;
    }
  }
};

export const FileType = () => [File];
