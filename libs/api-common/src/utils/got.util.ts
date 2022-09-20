import got from 'got';

export async function get<T>(url: string): Promise<T> {
  return JSON.parse((await got(url)).body) as T;
}
