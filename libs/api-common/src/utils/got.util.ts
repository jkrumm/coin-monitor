import got from 'got';

export async function get<T>(url: string): Promise<T> {
  return JSON.parse((await got(url)).body) as T;
}

export async function post<T>(url: string, payload: object): Promise<T> {
  return JSON.parse((await got.post(url, payload)).body) as T;
}
