/**
 * Health Check Service
 */

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, boolean>;
  timestamp: Date;
}

export class HealthCheckService {
  private checks: Map<string, () => Promise<boolean>> = new Map();

  register(name: string, check: () => Promise<boolean>): void {
    this.checks.set(name, check);
  }

  async getHealth(): Promise<HealthStatus> {
    const results: Record<string, boolean> = {};
    
    for (const [name, check] of this.checks.entries()) {
      try {
        results[name] = await check();
      } catch {
        results[name] = false;
      }
    }

    const allHealthy = Object.values(results).every((v) => v === true);
    const someHealthy = Object.values(results).some((v) => v === true);

    return {
      status: allHealthy ? 'healthy' : someHealthy ? 'degraded' : 'unhealthy',
      checks: results,
      timestamp: new Date(),
    };
  }
}

export const healthCheck = new HealthCheckService();

