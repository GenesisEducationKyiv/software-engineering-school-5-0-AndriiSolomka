export interface IFetchService {
  get<T>(url: string): Promise<T>;
}
