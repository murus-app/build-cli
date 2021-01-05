import { Flag } from '../interfaces/flag.interface';
import { ParsedCommandLineArguments } from '../interfaces/parsed-command-line-arguments.interface';
import { isNil } from './../../_temp/is-nil.function';
import { Nullable } from './../../_temp/nullable.type';
import { getFlagFromCommandLineArgument } from './get-flag-from-command-line-argument.function';

export function getParsedCommandLineArguments(rawArguments: string[]): ParsedCommandLineArguments {
  let command: string = '';
  const flags: Flag[] = [];

  rawArguments.forEach((rawArgument: string, index: number) => {
    if (index <= 1) {
      return;
    }

    if (index === 2) {
      command = rawArgument.trim().toLowerCase();
      return;
    }

    const extractedFlag: Nullable<Flag> = getFlagFromCommandLineArgument(rawArgument);
    if (!isNil(extractedFlag)) {
      flags.push(extractedFlag);
    }
  });

  return {
    flags,
    command
  };
}
