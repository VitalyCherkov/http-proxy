// Интерфейс запроса за логами
export interface IStorageGetReq {
  uri?: string;
  method?: string;
  protocol?: string;
  since?: Date;
  limit?: number;
}

// Интерфейс элемента сохраненного запроса
export interface IStorageItem {
  uri: string;
  method: string;
  protocol: string;
  rawData: string;
  date: Date;
}

export type IsOk = Promise<boolean>;

export type IStorageFinderById = (id: string) => Promise<IStorageItem>;
export type IStorageGetter = (req: IStorageGetReq) => Promise<Array<IStorageItem>>;
export type IStorageSaver = (log: IStorageItem) => IsOk;

export interface LogModelMethods {
  findById: IStorageFinderById;
  get: IStorageGetter;
  save: IStorageSaver;
}
