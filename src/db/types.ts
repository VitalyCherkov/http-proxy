// Интерфейс запроса за логами
export interface IRequest {
  host?: string;
  method?: string;
  protocol?: string;
  since?: Date;
  limit?: number;
}

// Интерфейс элемента сохраненного запроса
export interface ILogItem {
  host: string;
  method: string;
  protocol: string;
  date: Date;
  rawData: string;
}

export type IsOk = Promise<boolean>;

export type LogGetter = (req: IRequest) => Promise<Array<ILogItem>>;
export type LogSaver = (log: ILogItem) => IsOk;
