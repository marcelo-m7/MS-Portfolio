/**
 * Web Vitals monitoring integration
 * Measures and reports Core Web Vitals metrics (LCP, INP, CLS, TTFB, FCP)
 * Reports to console in development and can be extended to send to analytics in production
 */

import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';
import { logger } from './logger';

interface WebVitalsReport {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

/**
 * Report Web Vitals metric
 * @param metric - Web Vitals metric object
 */
function reportMetric(metric: Metric): void {
  const report: WebVitalsReport = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
  };

  // Log to console in development
  if (import.meta.env.DEV) {
    const emoji = report.rating === 'good' ? '✅' : report.rating === 'needs-improvement' ? '⚠️' : '❌';
    logger.log(`${emoji} ${report.name}: ${report.value.toFixed(2)}ms (${report.rating})`);
  }

  // In production, send to analytics service (e.g., Google Analytics, Sentry, etc.)
  if (import.meta.env.PROD) {
    // Example: Send to Google Analytics
    // gtag('event', report.name, {
    //   value: Math.round(report.value),
    //   metric_id: report.id,
    //   metric_value: report.value,
    //   metric_delta: report.delta,
    //   metric_rating: report.rating,
    // });

    // Example: Send to custom analytics endpoint
    // fetch('/api/analytics/vitals', {
    //   method: 'POST',
    //   body: JSON.stringify(report),
    //   headers: { 'Content-Type': 'application/json' },
    //   keepalive: true,
    // });

    // Log warnings for poor metrics
    if (report.rating === 'poor') {
      logger.warn(`Poor Web Vital: ${report.name} = ${report.value.toFixed(2)}ms`);
    }
  }
}

/**
 * Initialize Web Vitals monitoring
 * Call this once when the app starts
 */
export function initWebVitals(): void {
  try {
    // Largest Contentful Paint (LCP): measures loading performance
    // Good: < 2.5s, Needs improvement: 2.5s-4s, Poor: > 4s
    onLCP(reportMetric);

    // Cumulative Layout Shift (CLS): measures visual stability
    // Good: < 0.1, Needs improvement: 0.1-0.25, Poor: > 0.25
    onCLS(reportMetric);

    // Time to First Byte (TTFB): measures server responsiveness
    // Good: < 800ms, Needs improvement: 800ms-1800ms, Poor: > 1800ms
    onTTFB(reportMetric);

    // First Contentful Paint (FCP): measures perceived load speed
    // Good: < 1.8s, Needs improvement: 1.8s-3s, Poor: > 3s
    onFCP(reportMetric);

    // Interaction to Next Paint (INP): measures overall responsiveness (replaces FID)
    // Good: < 200ms, Needs improvement: 200ms-500ms, Poor: > 500ms
    onINP(reportMetric);

    logger.log('Web Vitals monitoring initialized');
  } catch (error) {
    logger.error('Failed to initialize Web Vitals monitoring:', error);
  }
}
