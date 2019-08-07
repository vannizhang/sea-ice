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

export {
    PolarRegion,
    IMinMaxSeaExtByYearData,
    IMinMaxSeaExtByYearDataItem
};