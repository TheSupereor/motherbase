export type EventType = `dev.motherbase.${string}.${string}.v${number}`;

export const eventType = (
  source: string,
  name: string,
  version: number,
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions -- Cause: EventType asks for number, but Floating point numbers will cause problems and negative numbers should not be accepted. Decision: This occurrence does not repeat, this will be decided when edge validations are implemented
): EventType => `dev.motherbase.${source}.${name}.v${version}`;
