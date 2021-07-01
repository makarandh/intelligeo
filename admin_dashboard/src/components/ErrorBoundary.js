import React from "react"

export default class ErrorBoundary extends React.Component {
    state = {
        hasError: false
    }

    static getDerivedStateFromError() {
        return {hasError: true}
    }

    componentDidCatch(error, errorInfo) {
        console.error(error, errorInfo)
    }

    render() {
        if(this.state.hasError) {
            return <div className={"error_message"}>Something went wrong. Please try refreshing the page.</div>
        }
        return this.props.children
    }
}
