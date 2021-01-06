import { error } from 'fancy-log';
import { argv } from 'process';
import { getParsedCommandLineArguments } from './internal/functions/get-parsed-command-line-arguments.function';
import { ParsedCommandLineArguments } from './internal/interfaces/parsed-command-line-arguments.interface';
import { PrepareNpmrcProcessor } from './processors/prepare-npmrc.processor';
import { PreparePackageJsonProcessor } from './processors/prepare-package-json.processor';
import { ShebangProcessor } from './processors/shebang.processor';

function pickProcessingFunction(): void {
  const { flags, command }: ParsedCommandLineArguments = getParsedCommandLineArguments(argv);

  switch (command) {
    case 'prepare-npmrc': {
      new PrepareNpmrcProcessor(flags).processCommand();
      return;
    }

    case 'prepare-package-json': {
      new PreparePackageJsonProcessor(flags).processCommand();
      return;
    }

    case 'shebang': {
      new ShebangProcessor(flags).processCommand();
      return;
    }

    default: {
      error(`Unprocessable command: ${command}`);
      process.exitCode = 1;
    }
  }
}

pickProcessingFunction();
