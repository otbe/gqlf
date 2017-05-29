import { Request } from 'express';
import { FileSystem } from '../FileSystem';

export interface Context {
  req: Request;
  fs: FileSystem;
}
