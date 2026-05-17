import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './shadcn/button';
import i18n from '../I18n';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {i18n.t("errors.boundary.title")}
            </h1>
            
            <p className="text-gray-600 mb-8">
              {i18n.t("errors.boundary.secondaryMessage")}
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-8 text-left bg-gray-900 rounded-lg p-4 overflow-auto max-h-40">
                <code className="text-xs text-red-400 font-mono break-all">
                  {this.state.error.toString()}
                </code>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                {i18n.t("common.actions.refreshPage")}
              </Button>
              <Button 
                onClick={this.handleReset}
                variant="default"
              >
                {i18n.t("common.actions.goHome")}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
