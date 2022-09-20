export function getEnv(config: string): string | undefined {
  return process.env[config];
}
