import * as Fs from 'fs';
import * as Path from 'path';
import { getCacheDirectory } from '../lib/dirUtils';

export default class UlixeeConfig {
  public static get global(): UlixeeConfig {
    this.globalConfig ??= new UlixeeConfig(this.globalConfigDirectory);
    return this.globalConfig;
  }

  public static isCacheEnabled = process.env.NODE_END === 'production';

  private static globalConfigDirectory = Path.join(getCacheDirectory(), 'ulixee');
  private static globalConfig: UlixeeConfig;

  private static configDirectoryName = '.ulixee';
  private static cachedConfigLocations: { [cwd_entrypoint: string]: string } = {};
  private static cachedConfigObjects: { [cwd_entrypoint: string]: UlixeeConfig } = {};

  public serverHost?: string;

  private get configPath(): string {
    return Path.join(this.directoryPath, 'config.json');
  }

  constructor(readonly directoryPath: string) {
    if (Fs.existsSync(this.configPath)) {
      const data = JSON.parse(Fs.readFileSync(this.configPath, 'utf8'));
      this.serverHost = data.serverHost;
    }
  }

  public async setGlobalDefaults(): Promise<void> {
    this.serverHost ??= 'localhost:1337';
    await this.save();
  }

  public save(): Promise<void> {
    return Fs.promises.writeFile(this.configPath, JSON.stringify(this.getData(), null, 2));
  }

  private getData(): IUlixeeConfig {
    return {
      serverHost: this.serverHost,
    };
  }

  public static load(runtimeLocation?: IRuntimeLocation): UlixeeConfig {
    runtimeLocation = this.useRuntimeLocationDefaults(runtimeLocation);
    const key = this.getLocationKey(runtimeLocation);
    if (!this.cachedConfigObjects[key]) {
      const directory = this.findConfigDirectory(runtimeLocation);
      if (!this.isCacheEnabled) return new UlixeeConfig(directory);

      this.cachedConfigObjects[key] = new UlixeeConfig(directory);
    }
    return this.cachedConfigObjects[key];
  }

  public static findConfigDirectory(runtimeLocation?: IRuntimeLocation): string {
    runtimeLocation = this.useRuntimeLocationDefaults(runtimeLocation);
    const key = this.getLocationKey(runtimeLocation);
    if (!this.cachedConfigLocations[key]) {
      const configDirectory = this.traverseDirectories(runtimeLocation);
      if (!this.isCacheEnabled) return configDirectory;

      this.cachedConfigLocations[key] = configDirectory;
    }

    return this.cachedConfigLocations[key];
  }

  private static useRuntimeLocationDefaults(runtimeLocation?: IRuntimeLocation): IRuntimeLocation {
    return {
      entrypoint: runtimeLocation?.entrypoint ?? require.main?.filename ?? process.argv[1],
      workingDirectory: runtimeLocation?.workingDirectory ?? process.cwd(),
    };
  }

  private static getLocationKey(runtimeLocation: IRuntimeLocation): string {
    return `${runtimeLocation.workingDirectory}_${runtimeLocation.entrypoint}`;
  }

  private static traverseDirectories(runtimeLocation: IRuntimeLocation): string {
    const { entrypoint, workingDirectory } = runtimeLocation;
    // look up hierarchy from the entrypoint of the script
    let currentPath = Path.dirname(entrypoint);
    do {
      const upDirectory = Path.normalize(Path.join(currentPath, '..'));
      if (upDirectory === currentPath) break;
      currentPath = upDirectory;

      const configPath = this.hasConfigDirectory(currentPath);
      if (configPath) return configPath;
    } while (currentPath.length && Fs.existsSync(currentPath));

    const configPath = this.hasConfigDirectory(workingDirectory);
    if (configPath) return configPath;

    // global directory is the working directory
    return this.globalConfigDirectory;
  }

  private static hasConfigDirectory(path: string): string {
    const pathToCheck = Path.normalize(Path.join(path, this.configDirectoryName));
    if (Fs.existsSync(pathToCheck) && Fs.statSync(pathToCheck).isDirectory()) return pathToCheck;
  }
}

export interface IUlixeeConfig {
  serverHost: string;
}

export interface IRuntimeLocation {
  workingDirectory: string;
  entrypoint: string;
}
