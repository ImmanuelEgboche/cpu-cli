import { realpathSync } from "fs";
import React from "react";

interface Props {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false};
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error};
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
                
            return (
                <div className="border border-destructive/30 bg-card p-4">
                  <div className="text-destructive text-xs font-bold mb-2 tracking-widest">
                    ⚠️ COMPONENT ERROR
                  </div>
                  <div className="text-[10px] text-muted-foreground mb-2">
                    {this.state.error?.message || 'Something went wrong'}
                  </div>
                  <button
                    onClick={() => this.setState({ hasError: false })}
                    className="px-2 py-1 border border-primary text-primary text-[10px] hover:bg-primary/10"
                  >
                    RETRY
                  </button>
                </div>
              );
             
        }

        return this.props.children
    }
}