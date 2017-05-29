import { stat, Stats } from 'fs';
import { toGlobalId } from 'graphql-relay';
import { sep } from 'path';

const Dataloader = require('dataloader');
const globby = require('globby');

export interface ISearchResult {
  id: string;
  path: string;
}

export interface IEntry extends ISearchResult {
  isDirectory: boolean;
}

export class FileSystem {
  private statsLoader: any;

  constructor() {
    this.statsLoader = new Dataloader(batchedStat);
  }

  getStats(path: string): Stats {
    return this.statsLoader.load(path);
  }

  async search(path: string, name: string, offset: number, limit: number): Promise<Array<ISearchResult>> {
    const files: Array<string> = await globby([`${path}**`]);

    return files
      .filter(file => file.includes(name))
      .sort((a, b) => a.split(sep).length - b.split(sep).length)
      .slice(offset, offset + limit)
      .map(file => ({
        id: toGlobalId('File', file),
        path: file
      }));
  }

  async list(path: string, offset: number, limit: number): Promise<Array<IEntry>> {
    const files: Array<string> = await globby([`${path}*`]);
    const entries = await Promise.all(files.map(async file => ({ file, stats: await this.getStats(file) })));

    return entries
      .slice(offset, offset + limit)
      .map(entry => ({
        id: toGlobalId('Directory', entry.file),
        path: entry.file,
        isDirectory: entry.stats.isDirectory()
      }));
  }
}

function batchedStat(paths: Array<string>) {
  return Promise.all(
    paths.map(
      path => new Promise<Stats>(
        (resolve, reject) => stat(path, (err, stats) => {
          if (err) {
            return reject(err);
          }

          resolve(stats);
        })
      )
    )
  );
}
