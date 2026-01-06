export function reportError(context: string, err: unknown) {
    warn(`[DIAGNOSTIC] ${context}:`, err);
}
