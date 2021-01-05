import { Flag } from './flag.interface';

export interface ParsedCommandLineArguments {
  command: string;
  flags: Flag[];
}
