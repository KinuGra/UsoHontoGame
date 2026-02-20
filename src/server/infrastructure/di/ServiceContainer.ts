// Service Dependency Injection Container
// Provides Application Service instances with singleton pattern
// Unifies service lifecycle management across the application

import { AnswerApplicationService } from '@/server/application/services/AnswerApplicationService';
import { GameApplicationService } from '@/server/application/services/GameApplicationService';
import { PresenterApplicationService } from '@/server/application/services/PresenterApplicationService';
import { ResultsApplicationService } from '@/server/application/services/ResultsApplicationService';
import { SessionApplicationService } from '@/server/application/services/SessionApplicationService';
import { DashboardApplicationService } from '@/server/application/services/DashboardApplicationService';

/**
 * Service Dependency Injection Container
 * Manages Application Service instances as singletons
 * Provides centralized service instantiation and lifecycle management
 */
// biome-ignore lint/complexity/noStaticOnlyClass: This is a dependency injection container pattern
export class ServiceContainer {
  private static instances = new Map<string, unknown>();

  /**
   * Gets GameApplicationService instance (singleton)
   */
  static getGameService(): GameApplicationService {
    if (!this.instances.has('game')) {
      this.instances.set('game', new GameApplicationService());
    }
    return this.instances.get('game') as GameApplicationService;
  }

  /**
   * Gets AnswerApplicationService instance (singleton)
   */
  static getAnswerService(): AnswerApplicationService {
    if (!this.instances.has('answer')) {
      this.instances.set('answer', new AnswerApplicationService());
    }
    return this.instances.get('answer') as AnswerApplicationService;
  }

  /**
   * Gets PresenterApplicationService instance (singleton)
   */
  static getPresenterService(): PresenterApplicationService {
    if (!this.instances.has('presenter')) {
      this.instances.set('presenter', new PresenterApplicationService());
    }
    return this.instances.get('presenter') as PresenterApplicationService;
  }

  /**
   * Gets ResultsApplicationService instance (singleton)
   */
  static getResultsService(): ResultsApplicationService {
    if (!this.instances.has('results')) {
      this.instances.set('results', new ResultsApplicationService());
    }
    return this.instances.get('results') as ResultsApplicationService;
  }

  /**
   * Gets SessionApplicationService instance (singleton)
   */
  static getSessionService(): SessionApplicationService {
    if (!this.instances.has('session')) {
      this.instances.set('session', new SessionApplicationService());
    }
    return this.instances.get('session') as SessionApplicationService;
  }

  /**
   * Gets DashboardApplicationService instance (singleton)
   */
  static getDashboardService(): DashboardApplicationService {
    if (!this.instances.has('dashboard')) {
      this.instances.set('dashboard', new DashboardApplicationService());
    }
    return this.instances.get('dashboard') as DashboardApplicationService;
  }

  /**
   * Reset all singleton instances (for testing)
   * @internal
   */
  static resetForTesting(): void {
    this.instances.clear();
  }

  /**
   * Set custom service instance (for testing)
   * @internal
   */
  static setService<T>(key: string, service: T): void {
    this.instances.set(key, service);
  }
}
