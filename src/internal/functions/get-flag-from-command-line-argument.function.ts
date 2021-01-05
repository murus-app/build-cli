import { Flag } from '../interfaces/flag.interface';
import { isNil } from './../../_temp/is-nil.function';
import { Nullable } from './../../_temp/nullable.type';

export function getFlagFromCommandLineArgument(commandLineArgument: Nullable<string>): Nullable<Flag> {
  if (isNil(commandLineArgument)) {
    return null;
  }

  const dividedArgument: string[] = commandLineArgument.trim().split('=');
  if (dividedArgument.length !== 2) {
    return null;
  }

  const [rawName, rawValue]: string[] = dividedArgument;

  const name: string = rawName.trim().replace('--', '');
  const value: string = rawValue.trim().replace('"', '');

  return {
    name,
    value
  };
}
