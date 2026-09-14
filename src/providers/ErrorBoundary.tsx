import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/atoms/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    message: 'Algo salió mal. Recarga la página para continuar.',
  };

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary capturó un error:', error, info);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
          <h1 className="text-2xl font-bold">Ups, ocurrió un error</h1>
          <p className="text-muted-foreground">{this.state.message}</p>
          <Button onClick={this.handleReload}>Recargar la página</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
