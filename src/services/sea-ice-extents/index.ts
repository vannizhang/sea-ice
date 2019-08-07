import { queryFeatures, IQueryFeaturesResponse, IStatisticDefinition, IFeature  } from '@esri/arcgis-rest-feature-layer';

import { antarctic as antarcticConfig, arctic as arcticConfig } from './config';

import { IMinMaxSeaExtByYearData, IMinMaxSeaExtByYearDataItem } from '../../types';

const queryMinMaxSeaExtByYear = async():Promise<IMinMaxSeaExtByYearData>=>{

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

export {
    queryMinMaxSeaExtByYear
}