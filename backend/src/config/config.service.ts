import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  // Database
  get databaseUrl(): string {
    return this.getEnvVar('RENDER_DATABASE_URL', 'DATABASE_URL');
  }

  // JWT
  get jwtSecret(): string {
    return this.getEnvVar('RENDER_JWT_SECRET', 'JWT_SECRET');
  }

  // OpenAI
  get openaiApiKey(): string {
    return this.getEnvVar('RENDER_OPENAI_API_KEY', 'OPENAI_API_KEY');
  }

  // Port
  get port(): number {
    return parseInt(process.env.PORT || '3000', 10);
  }

  // Node Environment
  get nodeEnv(): string {
    return process.env.NODE_ENV || 'development';
  }

  // Next Auth
  get nextAuthSecret(): string {
    return this.getEnvVar('RENDER_NEXTAUTH_SECRET', 'NEXTAUTH_SECRET');
  }

  get nextAuthUrl(): string {
    return this.getEnvVar('RENDER_NEXTAUTH_URL', 'NEXTAUTH_URL');
  }

  // API URL
  get apiUrl(): string {
    return this.getEnvVar('RENDER_API_URL', 'NEXT_PUBLIC_API_URL');
  }

  private getEnvVar(renderKey: string, fallbackKey: string, required: boolean = true): string | undefined {
    const value = process.env[renderKey] || process.env[fallbackKey];
    if (!value && required) {
      throw new Error(`Environment variable not found: ${renderKey} or ${fallbackKey}`);
    }
    return value;
  }
}
