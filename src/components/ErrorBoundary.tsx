import { Component, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary Component
 * 
 * Catches React errors during rendering and provides a graceful fallback UI.
 * Prevents the entire app from crashing when a component throws an error.
 * 
 * Usage:
 *   <ErrorBoundary>
 *     <YourComponent />
 *   </ErrorBoundary>
 * 
 * Custom fallback:
 *   <ErrorBoundary fallback={<CustomErrorUI />}>
 *     <YourComponent />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error details:', errorInfo);
    
    // TODO: Send to error monitoring service (Sentry, LogRocket, etc.)
    // Example: sendToErrorService(error, errorInfo);
  }

  handleReset = () => {
    // Reset error state and try to recover
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback provided by parent
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
          <div className="max-w-md w-full space-y-6">
            <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="text-lg font-semibold">
                Algo deu errado
              </AlertTitle>
              <AlertDescription className="mt-2 text-sm">
                {this.state.error?.message || 'Ocorreu um erro inesperado na aplicação.'}
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button 
                onClick={this.handleReset} 
                className="w-full"
                variant="default"
              >
                Tentar novamente
              </Button>
              
              <Button 
                onClick={() => window.location.href = '/'} 
                className="w-full"
                variant="outline"
              >
                Voltar à página inicial
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 p-4 bg-muted rounded-lg text-xs">
                <summary className="cursor-pointer font-semibold text-muted-foreground">
                  Detalhes do erro (desenvolvimento)
                </summary>
                <pre className="mt-2 overflow-auto text-xs text-muted-foreground whitespace-pre-wrap">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
