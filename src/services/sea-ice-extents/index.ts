import { queryFeatures, IQueryFeaturesResponse, IStatisticDefinition, IFeature  } from '@esri/arcgis-rest-feature-layer';

import { 
    antarctic as antarcticConfig, 
    arctic as arcticConfig,
    antarcticMedianSeaIceExt as antarcticMedianSeaIceExtConfig,
    arcticMedianSeaIceExt as arcticMedianSeaIceExtConfig
} from './config';

import { 
    IMinMaxSeaExtByYearData, 
    IMinMaxSeaExtByYearDataItem, 
    IFeaturesSeaIceExtByMonth, 
    ISeaIceExtByMonthData,
    ISeaIceExtByMonthDataItem,
    IMedianSeaIceExtByMonth
} from '../../types';

const queryMinMaxSeaIceExtByYear = async():Promise<IMinMaxSeaExtByYearData>=>{

    const outStatisticFieldNameMinExt = 'Min_Rec_Area';
    const outStatisticFieldNameMaxExt = 'Max_Rec_Area';
    const outStatisticFieldNameCountMonth = 'Count_Month';

    const outStatisticsMinExt:IStatisticDefinition = {
        statisticType: 'min',
        onStatisticField: antarcticConfig.fields.area,
        outStatisticFieldName: outStatisticFieldNameMinExt
    };

    const outStatisticsMaxExt:IStatisticDefinition = {
        statisticType: 'max',
        onStatisticField: antarcticConfig.fields.area,
        outStatisticFieldName: outStatisticFieldNameMaxExt
    };

    const outStatisticsCountMonth:IStatisticDefinition = {
        statisticType: 'count',
        onStatisticField: antarcticConfig.fields.month,
        outStatisticFieldName: outStatisticFieldNameCountMonth
    };

    const queryResForAntarctic = await queryFeatures({
        url: antarcticConfig.url,
        where: "1=1",
        outFields: '*',
        groupByFieldsForStatistics: antarcticConfig.fields.year,
        orderByFields: antarcticConfig.fields.year,
        outStatistics: [
            outStatisticsMinExt,
            outStatisticsMaxExt,
            outStatisticsCountMonth
        ]
    }) as IQueryFeaturesResponse;

    const queryResForArctic = await queryFeatures({
        url: arcticConfig.url,
        where: "1=1",
        outFields: '*',
        groupByFieldsForStatistics: arcticConfig.fields.year,
        orderByFields: arcticConfig.fields.year,
        outStatistics: [
            outStatisticsMinExt,
            outStatisticsMaxExt,
            outStatisticsCountMonth
        ]
    }) as IQueryFeaturesResponse;

    const outputDataAntarctic:Array<IMinMaxSeaExtByYearDataItem> = queryResForAntarctic.features
        .filter((d:IFeature)=>{
            // technically should only keep years with full 12 month of data, but the satellite was broken in later 1987 and early 1988,
            // so we only have 11 month of data for those two years...
            return d.attributes[outStatisticFieldNameCountMonth] >= 11;
        })
        .map((d:IFeature)=>{
            return {
                min: d.attributes[outStatisticFieldNameMinExt],
                max: d.attributes[outStatisticFieldNameMaxExt],
                year: d.attributes[antarcticConfig.fields.year]
            };
        });

    const outputDataArctic:Array<IMinMaxSeaExtByYearDataItem> = queryResForArctic.features
        .filter((d:IFeature)=>{
            return d.attributes[outStatisticFieldNameCountMonth] >= 11;
        })
        .map((d:IFeature)=>{
            return {
                min: d.attributes[outStatisticFieldNameMinExt],
                max: d.attributes[outStatisticFieldNameMaxExt],
                year: d.attributes[arcticConfig.fields.year]
            };
        });

    // console.log(queryResForAntarctic, queryResForArctic)

    return {
        antarctic: outputDataAntarctic,
        arctic: outputDataArctic
    };
};

const querySeaIceExtByMonth = async():Promise<ISeaIceExtByMonthData>=>{

    const queryResForAntarctic = await queryFeatures({
        url: antarcticConfig.url,
        where: "1=1",
        outFields: [antarcticConfig.fields.year, antarcticConfig.fields.month, antarcticConfig.fields.area],
        returnGeometry: false
    }) as IQueryFeaturesResponse;

    const queryResForArctic = await queryFeatures({
        url: arcticConfig.url,
        where: "1=1",
        outFields: [arcticConfig.fields.year, arcticConfig.fields.month, arcticConfig.fields.area],
        returnGeometry: false
    }) as IQueryFeaturesResponse;

    const featuresForAntarctic:Array<IFeaturesSeaIceExtByMonth> = queryResForAntarctic.features.map((d:IFeature)=>{
        return {
            year: d.attributes[antarcticConfig.fields.year],
            month: d.attributes[antarcticConfig.fields.month],
            value: d.attributes[antarcticConfig.fields.area]
        }
    });

    const featuresForArctic:Array<IFeaturesSeaIceExtByMonth> = queryResForArctic.features.map((d:IFeature)=>{
        return {
            year: d.attributes[arcticConfig.fields.year],
            month: d.attributes[arcticConfig.fields.month],
            value: d.attributes[arcticConfig.fields.area]
        }
    });

    // console.log(featuresForAntarctic, featuresForArctic)

    return {
        antarctic: prepareSeaIceExtByMonth(featuresForAntarctic),
        arctic: prepareSeaIceExtByMonth(featuresForArctic)
    };

};

const prepareSeaIceExtByMonth = (features:Array<IFeaturesSeaIceExtByMonth>):Array<ISeaIceExtByMonthDataItem>=>{

    const dataByYear:{ [key:number]: number[] } = {};

    features.forEach((feature:IFeaturesSeaIceExtByMonth)=>{

        if(!dataByYear[feature.year]){
            dataByYear[feature.year] = [feature.value];
        } else {
            dataByYear[feature.year].push(feature.value);
        }
    });

    const outputData = Object.keys(dataByYear).map(key=>{
        const year = +key;

        return {
            year,
            values: dataByYear[year]
        }
    });

    return outputData;

};

const queryMedianSeaIceExtByMonth = async():Promise<IMedianSeaIceExtByMonth>=>{

    const queryResForAntarctic = await queryFeatures({
        url: antarcticMedianSeaIceExtConfig.url,
        // the monthly median extent data are the same for each year, so only need to query one year of data
        where: `${antarcticMedianSeaIceExtConfig.fields.year} = 1980`,
        outFields: [antarcticMedianSeaIceExtConfig.fields.month, antarcticMedianSeaIceExtConfig.fields.area],
        returnGeometry: false,
        orderByFields: antarcticMedianSeaIceExtConfig.fields.month
    }) as IQueryFeaturesResponse;

    const queryResForArctic = await queryFeatures({
        url: arcticMedianSeaIceExtConfig.url,
        where: `${arcticConfig.fields.year} = 1980`,
        outFields: [arcticMedianSeaIceExtConfig.fields.month, arcticMedianSeaIceExtConfig.fields.area],
        returnGeometry: false,
        orderByFields: arcticMedianSeaIceExtConfig.fields.month
    }) as IQueryFeaturesResponse;

    const featuresForAntarctic:Array<number> = queryResForAntarctic.features.map((d:IFeature)=>{
        return d.attributes[antarcticMedianSeaIceExtConfig.fields.area]
    });

    const featuresForArctic:Array<number> = queryResForArctic.features.map((d:IFeature)=>{
        return d.attributes[arcticMedianSeaIceExtConfig.fields.area]
    });

    return {
        antarctic: featuresForAntarctic,
        arctic: featuresForArctic
    }

    // console.log(featuresForAntarctic, featuresForArctic);
};

export {
    queryMinMaxSeaIceExtByYear,
    querySeaIceExtByMonth,
    queryMedianSeaIceExtByMonth
}