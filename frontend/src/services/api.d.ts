export interface ApiInterface {
  get(path: string, config?: any): Promise<any>;
  post(path: string, data?: any, config?: any): Promise<any>;
  put(path: string, data?: any, config?: any): Promise<any>;
  delete(path: string, config?: any): Promise<any>;
}

export interface PublicApiInterface {
  get(path: string, config?: any): Promise<any>;
  post(path: string, data?: any, config?: any): Promise<any>;
  put(path: string, data?: any, config?: any): Promise<any>;
}

declare const api: ApiInterface;
export default api;

export const publicApi: PublicApiInterface;
export const pharmacyApi: ApiInterface;
export const medicalApi: ApiInterface;

