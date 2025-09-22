import { Injectable, Logger } from '@nestjs/common';

export interface LogContext {
  userId?: string;
  adminId?: string;
  traceId?: string;
  correlationId?: string;
  action?: string;
  resource?: string;
  ipAddress?: string;
  userAgent?: string;
  [key: string]: any;
}

@Injectable()
export class StructuredLogger {
  private readonly logger = new Logger('StructuredLogger');

  private formatMessage(level: string, message: string, context?: LogContext) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: 'ai-consultancy-backend',
      environment: process.env.NODE_ENV || 'development',
      ...context,
    };

    return JSON.stringify(logEntry);
  }

  info(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === 'production') {
      console.log(this.formatMessage('info', message, context));
    } else {
      this.logger.log(message, context);
    }
  }

  error(message: string, error?: Error, context?: LogContext) {
    const errorContext = {
      ...context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : undefined,
    };

    if (process.env.NODE_ENV === 'production') {
      console.error(this.formatMessage('error', message, errorContext));
    } else {
      this.logger.error(message, error?.stack, errorContext);
    }
  }

  warn(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === 'production') {
      console.warn(this.formatMessage('warn', message, context));
    } else {
      this.logger.warn(message, context);
    }
  }

  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV !== 'production') {
      this.logger.debug(message, context);
    }
  }

  // Specific log methods for common scenarios
  loginAttempt(email: string, success: boolean, ipAddress?: string, userAgent?: string) {
    this.info(`Login attempt: ${success ? 'SUCCESS' : 'FAILED'}`, {
      action: 'login_attempt',
      email,
      success,
      ipAddress,
      userAgent,
    });
  }

  adminAction(adminId: string, action: string, resource: string, resourceId?: string, ipAddress?: string) {
    this.info(`Admin action: ${action}`, {
      action: 'admin_action',
      adminId,
      adminAction: action,
      resource,
      resourceId,
      ipAddress,
    });
  }

  securityEvent(event: string, details: any, ipAddress?: string) {
    this.warn(`Security event: ${event}`, {
      action: 'security_event',
      event,
      details,
      ipAddress,
    });
  }

  performance(operation: string, duration: number, context?: LogContext) {
    this.info(`Performance: ${operation} took ${duration}ms`, {
      action: 'performance',
      operation,
      duration,
      ...context,
    });
  }
}
