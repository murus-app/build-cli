import { isNil } from '@murus-app/node-utilities';
import { readFileSync, writeFileSync } from 'fs';
import { cwd } from 'process';
import { CommandProcessor } from './../internal/interfaces/command-processor.interface';
import { Flag } from './../internal/interfaces/flag.interface';

export class PrepareNpmrcProcessor implements CommandProcessor {
  private readonly currentLocation: string = cwd();

  private readonly npmrcPath: string;
  private readonly authToken: string;
  private readonly orgEmail: string;
  private readonly orgName: string;

  constructor(flags: Flag[]) {
    const flagsObjectEntries: [string, string][] = flags.map(({ name, value }: Flag) => [name, value]);
    const flagsObject: Record<string, string> = Object.fromEntries(flagsObjectEntries);

    this.npmrcPath = flagsObject['npmrc_path'] ?? '';
    this.authToken = flagsObject['auth_token'] ?? '';
    this.orgEmail = flagsObject['org_email'] ?? '';
    this.orgName = flagsObject['org_name'] ?? '';
  }

  public processCommand(): void {
    const currentContentLines: string[] = this.getCurrentNpmrcContentLines();
    const currentContentEntries: [string, string][] = currentContentLines
      .map((line: string) => {
        const dividedLine: string[] = line.split('=');

        if (dividedLine.length !== 2) {
          return null;
        }

        const [rawKey, rawValue]: string[] = dividedLine;
        const key: string = String(rawKey).trim();
        const value: string = String(rawValue).trim();

        return [key, value];
      })
      .filter((contentEntry: [string, string] | null): contentEntry is [string, string] => !isNil(contentEntry));
    const currentContentValueByKey: Map<string, string> = new Map<string, string>(currentContentEntries);

    currentContentValueByKey.set('_auth', this.authToken);
    currentContentValueByKey.set('email', this.orgEmail);
    currentContentValueByKey.set(`@${this.orgName}:registry`, 'https://npm.pkg.github.com');
    currentContentValueByKey.set(`//npm.pkg.github.com/:_authToken`, this.authToken);

    const updatedContent: string = Array.from(currentContentValueByKey.entries())
      .map(([key, value]: [string, string]) => `${key} = ${value}`)
      .join('\n');

    this.updateNpmrcContent(updatedContent);
  }

  private getCurrentNpmrcContentLines(): string[] {
    const content: string = readFileSync(`${this.currentLocation}/${this.npmrcPath}`, 'utf-8');
    const contentLines: string[] = content.split(/\r?\n/);
    return contentLines;
  }

  private updateNpmrcContent(newData: string): void {
    writeFileSync(`${this.currentLocation}/${this.npmrcPath}`, newData);
  }
}
