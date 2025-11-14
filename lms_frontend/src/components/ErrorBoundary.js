import React from 'react';

/**
 * PUBLIC_INTERFACE
 * ErrorBoundary
 * Catches runtime errors in child component tree and renders a fallback UI.
 */
export default class ErrorBoundary extends React.Component {
  /** This is a public function. */
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error info for diagnostics (avoid PII)
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught error:', { error, errorInfo });
  }

  // PUBLIC_INTERFACE
  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h1>Something went wrong.</h1>
          <p>Please try reloading the page. If the problem persists, contact support.</p>
          <button onClick={this.reset}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}
