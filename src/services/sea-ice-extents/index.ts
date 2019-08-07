import { queryFeatures, IQueryFeaturesResponse, IStatisticDefinition, IFeature  } from '@esri/arcgis-rest-feature-layer';

import { antarctic as antarcticConfig, arctic as arcticConfig } from './config';

const queryMinMaxSeaExtByYear = async()=>{

    const outStatisticsMinExt:IStatisticDefinition = {
        statisticType: 'min',
        onStatisticField: antarcticConfig.fields.extent,
        outStatisticFieldName: 'Min_Rec_Extent'
    };

    const outStatisticsMaxExt:IStatisticDefinition = {
        statisticType: 'max',
        onStatisticField: antarcticConfig.fields.extent,
        outStatisticFieldName: 'Max_Rec_Extent'
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

    const outputDataAntarctic = queryResForAntarctic.features.map((d:IFeature)=>{
        return d.attributes
    });

    const outputDataArctic = queryResForArctic.features.map((d:IFeature)=>{
        return d.attributes
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