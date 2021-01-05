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
    const currentContent: string = this.getCurrentNpmrcContent();
    const updatedContent: string = `${currentContent.trim()}
_auth = ${this.authToken}
email = ${this.orgEmail}
@${this.orgName}:registry = https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${this.authToken}`;

    this.updateNpmrcContent(updatedContent);
  }

  private getCurrentNpmrcContent(): string {
    const content: string = readFileSync(`${this.currentLocation}/${this.npmrcPath}`, 'utf-8');

    return content ?? '';
  }

  private updateNpmrcContent(newData: string): void {
    writeFileSync(`${this.currentLocation}/${this.npmrcPath}`, newData);
  }
}
