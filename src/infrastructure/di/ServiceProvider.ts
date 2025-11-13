/**
 * Service Provider
 * 
 * Configures and registers all services in the DI container.
 */

import { Container } from './Container';
import { DI_TOKENS } from './tokens';

export class ServiceProvider {
  private container: Container;

  constructor(container: Container) {
    this.container = container;
  }

  /**
   * Register all services
   */
  registerServices(): void {
    this.registerRepositories();
    this.registerInfrastructure();
    this.registerExternalApis();
  }

  /**
   * Register repository implementations
   */
  private registerRepositories(): void {
    // Repositories will be registered as implementations are created
    // Example:
    // this.container.registerScoped(
    //   DI_TOKENS.BUILDER_REPOSITORY,
    //   (c) => new BuilderRepositoryImpl(c.resolve(DI_TOKENS.API_CLIENT))
    // );
  }

  /**
   * Register infrastructure services
   */
  private registerInfrastructure(): void {
    // Infrastructure services will be registered as implementations are created
    // Example:
    // this.container.registerSingleton(
    //   DI_TOKENS.CACHE_SERVICE,
    //   () => new CacheService()
    // );
  }

  /**
   * Register external API clients
   */
  private registerExternalApis(): void {
    // External APIs will be registered as implementations are created
    // Example:
    // this.container.registerSingleton(
    //   DI_TOKENS.TALENT_API,
    //   () => new TalentApiClient({ baseURL: process.env.TALENT_API_URL })
    // );
  }

  /**
   * Get configured container
   */
  getContainer(): Container {
    return this.container;
  }
}

/**
 * Create and configure application container
 */
export function createAppContainer(): Container {
  const container = new Container();
  const provider = new ServiceProvider(container);
  provider.registerServices();
  return container;
}

