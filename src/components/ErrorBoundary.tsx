import { Component, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  fallback: (error: Error) => ReactNode
}

export class ErrorBoundary extends Component<Props, { error: Error | null }> {
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    return this.state.error
      ? this.props.fallback(this.state.error)
      : this.props.children
  }
}
