import Server from '../index';
import BaseCoreConnector from './BaseCoreConnector';
import HeroCoreConnector from './HeroCoreConnector';
import ChromeAliveCoreConnector from './ChromeAliveCoreConnector';

let isConnected = false;

export default class CoreConnectors {
  public heroConnector: HeroCoreConnector;

  private coreConnectors: BaseCoreConnector[] = [];

  constructor(server: Server) {
    if (isConnected) {
      throw new Error('CoreConnectors already initialized');
    }

    this.heroConnector = new HeroCoreConnector(server);
    this.coreConnectors.push(this.heroConnector);
    if (ChromeAliveCoreConnector.isInstalled()) {
      this.coreConnectors.push(new ChromeAliveCoreConnector(server));
    }
  }

  public async start(): Promise<void> {
    for (const coreConnector of this.coreConnectors) {
      await coreConnector.start();
    }
    isConnected = true;
  }

  public async close(): Promise<void> {
    for (const coreConnector of this.coreConnectors) {
      await coreConnector.close();
    }
    isConnected = false;
  }
}
