import { readFileSync, writeFileSync } from 'fs';
import { cwd } from 'process';
import { CommandProcessor } from '../internal/interfaces/command-processor.interface';
import { Flag } from '../internal/interfaces/flag.interface';

export class ShebangProcessor implements CommandProcessor {
  private readonly currentLocation: string = cwd();

  private readonly filePath: string;
  private readonly payload: string;

  constructor(flags: Flag[]) {
    const flagsObjectEntries: [string, string][] = flags.map(({ name, value }: Flag) => [name, value]);
    const flagsObject: Record<string, string> = Object.fromEntries(flagsObjectEntries);

    this.filePath = flagsObject['file_path'] ?? '';
    this.payload = flagsObject['payload'] ?? '';
  }

  public processCommand(): void {
    const currentContent: string = this.getCurrentFileContent();
    const updatedContent: string = `#!${this.payload}
${currentContent}`;
    this.updateFileContent(updatedContent);
  }

  private getCurrentFileContent(): string {
    const content: string = readFileSync(`${this.currentLocation}/${this.filePath}`, 'utf-8');
    return content ?? '';
  }

  private updateFileContent(newData: string): void {
    writeFileSync(`${this.currentLocation}/${this.filePath}`, newData);
  }
}
