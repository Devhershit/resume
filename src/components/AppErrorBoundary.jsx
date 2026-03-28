import { Component } from 'react'

export class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Runtime error caught by AppErrorBoundary:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-svh items-center justify-center bg-slate-950 px-6 text-white">
          <section className="max-w-xl rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
            <h1 className="text-xl font-semibold">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-200">
              A runtime error was prevented from crashing the whole page. Reload once and try opening the folder again.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="mt-4 rounded-md border border-white/30 bg-white/15 px-3 py-1.5 text-sm font-semibold hover:bg-white/25"
            >
              Reload Page
            </button>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}
