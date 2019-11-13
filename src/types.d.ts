type PolarRegion = 'arctic' | 'antarctic';

interface IMinMaxSeaExtByYearDataItem {
  min: number;
  max: number;
  year: number;
}

interface IMinMaxSeaExtByYearData {
  arctic: Array<IMinMaxSeaExtByYearDataItem>;
  antarctic: Array<IMinMaxSeaExtByYearDataItem>;
}

interface IFeaturesSeaIceExtByMonth {
  year: number;
  month: number;
  value: number;
}

interface ISeaIceExtByMonthQueryResponse {
  arctic: Array<IFeaturesSeaIceExtByMonth>;
  antarctic: Array<IFeaturesSeaIceExtByMonth>;
}

interface ISeaIceExtByMonthDataItem {
  year: number;
  values: number[];
}

interface ISeaIceExtByMonthData {
  arctic: Array<ISeaIceExtByMonthDataItem>;
  antarctic: Array<ISeaIceExtByMonthDataItem>;
}

interface IMedianSeaIceExtByMonth {
  arctic: Array<number>;
  antarctic: Array<number>;
}

interface IRecordDate {
  year: number;
  month: number;
  date: number;
}

interface ISeaIceExtVal2MonthLookupItem {
  [key: string]: {
    [value: string]: number;
  };
}

interface ISeaIceExtVal2MonthLookup {
  arctic: ISeaIceExtVal2MonthLookupItem;
  antarctic: ISeaIceExtVal2MonthLookupItem;
}

export {
  PolarRegion,
  IMinMaxSeaExtByYearData,
  IMinMaxSeaExtByYearDataItem,
  IFeaturesSeaIceExtByMonth,
  ISeaIceExtByMonthData,
  ISeaIceExtByMonthDataItem,
  IMedianSeaIceExtByMonth,
  IRecordDate,
  ISeaIceExtByMonthQueryResponse,
  ISeaIceExtVal2MonthLookupItem,
  ISeaIceExtVal2MonthLookup,
};
