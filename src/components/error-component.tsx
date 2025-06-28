interface ErrorComponentProps {
    message: string;
}

export function ErrorComponent({ message }: ErrorComponentProps) {
    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold text-red-600">Error</h1>
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    );
} 