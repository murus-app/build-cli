import { readFileSync, writeFileSync } from 'fs';
import { cwd } from 'process';
import { CommandProcessor } from '../internal/interfaces/command-processor.interface';
import { Flag } from '../internal/interfaces/flag.interface';
import { isEmpty } from './../_temp/is-empty.function';
import { isNil } from './../_temp/is-nil.function';

type ContentEntry = [string, unknown];

export class PreparePackageJsonProcessor implements CommandProcessor {
  private readonly currentLocation: string = cwd();

  private readonly packageJsonPath: string;
  private readonly commitHash: string;
  private readonly mainJsPath: string;

  constructor(flags: Flag[]) {
    const flagsObjectEntries: [string, string][] = flags.map(({ name, value }: Flag) => [name, value]);
    const flagsObject: Record<string, string> = Object.fromEntries(flagsObjectEntries);

    this.packageJsonPath = flagsObject['package_json_path'] ?? '';
    this.commitHash = flagsObject['commit_hash'] ?? '';
    this.mainJsPath = flagsObject['main_js_path'] ?? '';
  }

  public processCommand(): void {
    const currentContent: object = this.getCurrentPackageJsonContent();
    const currentContentEntries: ContentEntry[] = Object.entries(currentContent);

    const contentValueByKey: Map<string, unknown> = new Map<string, unknown>(
      currentContentEntries.map(([key, value]: ContentEntry) => [key, value])
    );

    this.setProperVersion(contentValueByKey);
    this.setProperMain(contentValueByKey);

    this.deleteUnnecessaryProperties(contentValueByKey);

    const updatedContent: object = Object.fromEntries(contentValueByKey.entries());
    this.updatePackageJsonContent(updatedContent);
  }

  private setProperVersion(contentValueByKey: Map<string, unknown>): void {
    if (isNil(this.commitHash)) {
      return;
    }
    const currentVersion: unknown = contentValueByKey.get('version');
    const updatedVersion: string = `${currentVersion}-${this.commitHash}`;
    contentValueByKey.set('version', updatedVersion);
  }

  private setProperMain(contentValueByKey: Map<string, unknown>): void {
    if (isNil(this.mainJsPath)) {
      return;
    }
    contentValueByKey.set('main', this.mainJsPath);
  }

  private deleteUnnecessaryProperties(contentValueByKey: Map<string, unknown>): void {
    const propertiesToKeep: Set<string> = new Set<string>([
      'name',
      'version',
      'main',
      'license',
      'repository',
      'bin',
      'dependencies',
      'bundledDependencies',
      'browser'
    ]);
    const existingPropertyNames: Set<string> = new Set<string>(contentValueByKey.keys());
    existingPropertyNames.forEach((propertyKey: string) => {
      if (propertiesToKeep.has(propertyKey)) {
        return;
      }

      contentValueByKey.delete(propertyKey);
    });
  }

  private getCurrentPackageJsonContent(): object {
    const content: string = readFileSync(`${this.currentLocation}/${this.packageJsonPath}`, 'utf-8');
    return isEmpty(content) ? {} : JSON.parse(content);
  }

  private updatePackageJsonContent(newData: object): void {
    writeFileSync(`${this.currentLocation}/${this.packageJsonPath}`, JSON.stringify(newData));
  }
}
