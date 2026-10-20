export type EventType = `dev.motherbase.${string}.${string}.v${number}`;

export const eventType = (source: string, name: string, version: number): EventType =>
    `dev.motherbase.${source}.${name}.v${version}`;