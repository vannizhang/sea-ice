import { queryFeatures, IQueryFeaturesResponse, IStatisticDefinition, IFeature  } from '@esri/arcgis-rest-feature-layer';

import { antarctic as antarcticConfig, arctic as arcticConfig } from './config';

import { 
    IMinMaxSeaExtByYearData, 
    IMinMaxSeaExtByYearDataItem, 
    IFeaturesSeaIceExtByMonth, 
    ISeaIceExtMyMonthData,
    ISeaIceExtMyMonthDataItem 
} from '../../types';

const queryMinMaxSeaIceExtByYear = async():Promise<IMinMaxSeaExtByYearData>=>{

    const outStatisticFieldNameMinExt = 'Min_Rec_Extent';
    const outStatisticFieldNameMaxExt = 'Max_Rec_Extent';

    const outStatisticsMinExt:IStatisticDefinition = {
        statisticType: 'min',
        onStatisticField: antarcticConfig.fields.extent,
        outStatisticFieldName: outStatisticFieldNameMinExt
    };

    const outStatisticsMaxExt:IStatisticDefinition = {
        statisticType: 'max',
        onStatisticField: antarcticConfig.fields.extent,
        outStatisticFieldName: outStatisticFieldNameMaxExt
    };

    const queryResForAntarctic = await queryFeatures({
        url: antarcticConfig.url,
        where: "1=1",
        outFields: '*',
        groupByFieldsForStatistics: antarcticConfig.fields.year,
        orderByFields: antarcticConfig.fields.year,
        outStatistics: [
            outStatisticsMinExt,
            outStatisticsMaxExt
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
            outStatisticsMaxExt
        ]
    }) as IQueryFeaturesResponse;

    const outputDataAntarctic:Array<IMinMaxSeaExtByYearDataItem> = queryResForAntarctic.features.map((d:IFeature)=>{
        return {
            min: d.attributes[outStatisticFieldNameMinExt],
            max: d.attributes[outStatisticFieldNameMaxExt],
            year: d.attributes[antarcticConfig.fields.year]
        };
    });

    const outputDataArctic:Array<IMinMaxSeaExtByYearDataItem> = queryResForArctic.features.map((d:IFeature)=>{
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

const querySeaIceExtByMonth = async():Promise<ISeaIceExtMyMonthData>=>{

    const queryResForAntarctic = await queryFeatures({
        url: antarcticConfig.url,
        where: "1=1",
        outFields: [antarcticConfig.fields.year, antarcticConfig.fields.month, antarcticConfig.fields.extent],
        returnGeometry: false
    }) as IQueryFeaturesResponse;

    const queryResForArctic = await queryFeatures({
        url: arcticConfig.url,
        where: "1=1",
        outFields: [arcticConfig.fields.year, arcticConfig.fields.month, arcticConfig.fields.extent],
        returnGeometry: false
    }) as IQueryFeaturesResponse;

    const featuresForAntarctic:Array<IFeaturesSeaIceExtByMonth> = queryResForAntarctic.features.map((d:IFeature)=>{
        return {
            year: d.attributes[antarcticConfig.fields.year],
            month: d.attributes[antarcticConfig.fields.month],
            value: d.attributes[antarcticConfig.fields.extent]
        }
    });

    const featuresForArctic:Array<IFeaturesSeaIceExtByMonth> = queryResForArctic.features.map((d:IFeature)=>{
        return {
            year: d.attributes[arcticConfig.fields.year],
            month: d.attributes[arcticConfig.fields.month],
            value: d.attributes[arcticConfig.fields.extent]
        }
    });

    // console.log(featuresForAntarctic, featuresForArctic)

    return {
        antarctic: prepareSeaIceExtByMonth(featuresForAntarctic),
        arctic: prepareSeaIceExtByMonth(featuresForArctic)
    };

};

const prepareSeaIceExtByMonth = (features:Array<IFeaturesSeaIceExtByMonth>):Array<ISeaIceExtMyMonthDataItem>=>{

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

export {
    queryMinMaxSeaIceExtByYear,
    querySeaIceExtByMonth
}