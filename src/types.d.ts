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

interface ISeaIceExtMyMonthDataItem {
    year: number,
    values: number[]
}

interface ISeaIceExtMyMonthData {
    'arctic': Array<ISeaIceExtMyMonthDataItem>,
    'antarctic': Array<ISeaIceExtMyMonthDataItem>
}

export {
    PolarRegion,
    IMinMaxSeaExtByYearData,
    IMinMaxSeaExtByYearDataItem,
    IFeaturesSeaIceExtByMonth,
    ISeaIceExtMyMonthData,
    ISeaIceExtMyMonthDataItem
};