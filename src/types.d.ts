type PolarRegion = 'arctic' | 'antarctic';

interface IMinMaxSeaExtByYearDataItem {
    min:number,
    max:number,
    year:number
}

interface IMinMaxSeaExtByYearData {
    'arctic': Array<IMinMaxSeaExtByYearDataItem>,
    'antarctic': Array<IMinMaxSeaExtByYearDataItem>
}

interface IFeaturesSeaIceExtByMonth {
    year:number,
    month:number,
    value:number
}

interface ISeaIceExtByMonthDataItem {
    year: number,
    values: number[]
}

interface ISeaIceExtByMonthData {
    'arctic': Array<ISeaIceExtByMonthDataItem>,
    'antarctic': Array<ISeaIceExtByMonthDataItem>
}

interface IMedianSeaIceExtByMonth {
    'arctic': Array<number>,
    'antarctic': Array<number>
}

export {
    PolarRegion,
    IMinMaxSeaExtByYearData,
    IMinMaxSeaExtByYearDataItem,
    IFeaturesSeaIceExtByMonth,
    ISeaIceExtByMonthData,
    ISeaIceExtByMonthDataItem,
    IMedianSeaIceExtByMonth
};