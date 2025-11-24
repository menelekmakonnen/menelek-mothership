import React from 'react';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="fixed inset-0 z-[30000] flex items-center justify-center bg-black/90 px-6 text-center text-white">
      <div className="max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
        <p className="mono text-[11px] uppercase tracking-[0.35em] text-white/60">System notice</p>
        <h1 className="mt-2 text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-3 text-white/70">
          We hit a snag while rendering this view. Reload to continue, or head back to the previous section.
        </p>
        {error?.message && <p className="mt-3 text-sm text-white/50">{error.message}</p>}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={resetErrorBoundary}
            className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/25"
          >
            Reload view
          </button>
          <button
            type="button"
            onClick={() => window?.location?.reload?.()}
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-white/50"
          >
            Hard refresh
          </button>
        </div>
      </div>
    </div>
  );
}

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.error('App error boundary caught', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      return <ErrorFallback error={error} resetErrorBoundary={this.reset} />;
    }

    return children;
  }
}
