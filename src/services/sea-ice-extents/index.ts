import {
  queryFeatures,
  IQueryFeaturesResponse,
  IStatisticDefinition,
  IFeature,
} from '@esri/arcgis-rest-feature-layer';

import {
  antarctic as antarcticConfig,
  arctic as arcticConfig,
  antarcticMedianSeaIceExt as antarcticMedianSeaIceExtConfig,
  arcticMedianSeaIceExt as arcticMedianSeaIceExtConfig,
} from './config';

import {
  IMinMaxSeaExtByYearData,
  IMinMaxSeaExtByYearDataItem,
  IFeaturesSeaIceExtByMonth,
  ISeaIceExtByMonthDataItem,
  IMedianSeaIceExtByMonth,
  IRecordDate,
  ISeaIceExtByMonthQueryResponse,
  ISeaIceExtVal2MonthLookup,
  ISeaIceExtVal2MonthLookupItem,
} from '../../types';

const queryMinMaxSeaIceExtByYear = async (): Promise<IMinMaxSeaExtByYearData> => {
  const outStatisticFieldNameMinExt = 'Min_Rec_Area';
  const outStatisticFieldNameMaxExt = 'Max_Rec_Area';
  const outStatisticFieldNameCountMonth = 'Count_Month';

  const outStatisticsMinExt: IStatisticDefinition = {
    statisticType: 'min',
    onStatisticField: antarcticConfig.fields.extent,
    outStatisticFieldName: outStatisticFieldNameMinExt,
  };

  const outStatisticsMaxExt: IStatisticDefinition = {
    statisticType: 'max',
    onStatisticField: antarcticConfig.fields.extent,
    outStatisticFieldName: outStatisticFieldNameMaxExt,
  };

  const outStatisticsCountMonth: IStatisticDefinition = {
    statisticType: 'count',
    onStatisticField: antarcticConfig.fields.month,
    outStatisticFieldName: outStatisticFieldNameCountMonth,
  };

  const queryResForAntarctic = (await queryFeatures({
    url: antarcticConfig.url,
    where: '1=1',
    outFields: '*',
    groupByFieldsForStatistics: antarcticConfig.fields.year,
    orderByFields: antarcticConfig.fields.year,
    outStatistics: [
      outStatisticsMinExt,
      outStatisticsMaxExt,
      outStatisticsCountMonth,
    ],
  })) as IQueryFeaturesResponse;

  const queryResForArctic = (await queryFeatures({
    url: arcticConfig.url,
    where: '1=1',
    outFields: '*',
    groupByFieldsForStatistics: arcticConfig.fields.year,
    orderByFields: arcticConfig.fields.year,
    outStatistics: [
      outStatisticsMinExt,
      outStatisticsMaxExt,
      outStatisticsCountMonth,
    ],
  })) as IQueryFeaturesResponse;

  const outputDataAntarctic: Array<IMinMaxSeaExtByYearDataItem> = queryResForAntarctic.features
    .filter((d: IFeature) => {
      // technically should only keep years with full 12 month of data, but the satellite was broken in later 1987 and early 1988,
      // so we only have 11 month of data for those two years...
      return d.attributes[outStatisticFieldNameCountMonth] >= 11;
    })
    .map((d: IFeature) => {
      return {
        min: d.attributes[outStatisticFieldNameMinExt],
        max: d.attributes[outStatisticFieldNameMaxExt],
        year: d.attributes[antarcticConfig.fields.year],
      };
    });

  const outputDataArctic: Array<IMinMaxSeaExtByYearDataItem> = queryResForArctic.features
    .filter((d: IFeature) => {
      return d.attributes[outStatisticFieldNameCountMonth] >= 11;
    })
    .map((d: IFeature) => {
      return {
        min: d.attributes[outStatisticFieldNameMinExt],
        max: d.attributes[outStatisticFieldNameMaxExt],
        year: d.attributes[arcticConfig.fields.year],
      };
    });

  // console.log(queryResForAntarctic, queryResForArctic)

  return {
    antarctic: outputDataAntarctic,
    arctic: outputDataArctic,
  };
};

const querySeaIceExtByMonth = async (): Promise<ISeaIceExtByMonthQueryResponse> => {
  const queryResForAntarctic = (await queryFeatures({
    url: antarcticConfig.url,
    where: '1=1',
    outFields: [
      antarcticConfig.fields.year,
      antarcticConfig.fields.month,
      antarcticConfig.fields.extent,
    ],
    orderByFields: `${antarcticConfig.fields.year},${antarcticConfig.fields.month}`,
    returnGeometry: false,
  })) as IQueryFeaturesResponse;

  const queryResForArctic = (await queryFeatures({
    url: arcticConfig.url,
    where: '1=1',
    outFields: [
      arcticConfig.fields.year,
      arcticConfig.fields.month,
      arcticConfig.fields.extent,
    ],
    orderByFields: `${arcticConfig.fields.year},${arcticConfig.fields.month}`,
    returnGeometry: false,
  })) as IQueryFeaturesResponse;

  const featuresForAntarctic: Array<IFeaturesSeaIceExtByMonth> = queryResForAntarctic.features.map(
    (d: IFeature) => {
      return {
        year: d.attributes[antarcticConfig.fields.year],
        month: d.attributes[antarcticConfig.fields.month],
        value: d.attributes[antarcticConfig.fields.extent],
      };
    }
  );

  const featuresForArctic: Array<IFeaturesSeaIceExtByMonth> = queryResForArctic.features.map(
    (d: IFeature) => {
      return {
        year: d.attributes[arcticConfig.fields.year],
        month: d.attributes[arcticConfig.fields.month],
        value: d.attributes[arcticConfig.fields.extent],
      };
    }
  );

  return {
    antarctic: featuresForAntarctic,
    arctic: featuresForArctic,
  };
};

const prepareSeaIceExtByMonth = (
  features: Array<IFeaturesSeaIceExtByMonth>
): Array<ISeaIceExtByMonthDataItem> => {
  const dataByYear: { [key: number]: number[] } = {};

  features.forEach((feature: IFeaturesSeaIceExtByMonth) => {
    const year = feature.year;
    const value = feature.value;

    if (!dataByYear[year]) {
      dataByYear[year] = [value];
    } else {
      dataByYear[year].push(value);
    }
  });

  const outputData = Object.keys(dataByYear).map((key) => {
    const year = +key;

    const values = dataByYear[year];

    return {
      year,
      values,
    };
  });

  return outputData;
};

const queryMedianSeaIceExtByMonth = async (): Promise<IMedianSeaIceExtByMonth> => {
  const queryResForAntarctic = (await queryFeatures({
    url: antarcticMedianSeaIceExtConfig.url,
    // the monthly median extent data are the same for each year, so only need to query one year of data
    where: `${antarcticMedianSeaIceExtConfig.fields.year} = 1980`,
    outFields: [
      antarcticMedianSeaIceExtConfig.fields.month,
      antarcticMedianSeaIceExtConfig.fields.extent,
    ],
    returnGeometry: false,
    orderByFields: antarcticMedianSeaIceExtConfig.fields.month,
  })) as IQueryFeaturesResponse;

  const queryResForArctic = (await queryFeatures({
    url: arcticMedianSeaIceExtConfig.url,
    where: `${arcticConfig.fields.year} = 1980`,
    outFields: [
      arcticMedianSeaIceExtConfig.fields.month,
      arcticMedianSeaIceExtConfig.fields.extent,
    ],
    returnGeometry: false,
    orderByFields: arcticMedianSeaIceExtConfig.fields.month,
  })) as IQueryFeaturesResponse;

  const featuresForAntarctic: Array<number> = queryResForAntarctic.features.map(
    (d: IFeature) => {
      return d.attributes[antarcticMedianSeaIceExtConfig.fields.extent];
    }
  );

  const featuresForArctic: Array<number> = queryResForArctic.features.map(
    (d: IFeature) => {
      return d.attributes[arcticMedianSeaIceExtConfig.fields.extent];
    }
  );

  return {
    antarctic: featuresForAntarctic,
    arctic: featuresForArctic,
  };

  // console.log(featuresForAntarctic, featuresForArctic);
};

const queryRecordDates = async () => {
  const queryResForAntarctic = (await queryFeatures({
    url: antarcticConfig.url,
    where: '1=1',
    outFields: [
      antarcticConfig.fields.year,
      antarcticConfig.fields.month,
      antarcticConfig.fields.date,
    ],
    returnGeometry: false,
    returnDistinctValues: true,
  })) as IQueryFeaturesResponse;

  const recordDates: Array<IRecordDate> = queryResForAntarctic.features.map(
    (d: IFeature) => {
      return {
        year: d.attributes[antarcticConfig.fields.year],
        month: d.attributes[antarcticConfig.fields.month],
        date: d.attributes[antarcticConfig.fields.date],
      };
    }
  );

  return recordDates;
};

const generateValue2MonthLookup = (
  data: ISeaIceExtByMonthQueryResponse
): ISeaIceExtVal2MonthLookup => {
  const antarcticData = data.antarctic;
  const arcticData = data.arctic;

  const antarcticLookupTable: ISeaIceExtVal2MonthLookupItem = {};
  const arcticLookupTable: ISeaIceExtVal2MonthLookupItem = {};

  antarcticData.forEach((d: IFeaturesSeaIceExtByMonth) => {
    const { year, month, value } = d;

    const yearInStr = year.toString();
    const valueInStr = value.toString();

    if (!antarcticLookupTable[yearInStr]) {
      antarcticLookupTable[yearInStr] = {};
    }

    antarcticLookupTable[yearInStr][valueInStr] = month;
  });

  arcticData.forEach((d: IFeaturesSeaIceExtByMonth) => {
    const { year, month, value } = d;

    if (!arcticLookupTable[year]) {
      arcticLookupTable[year] = {};
    }

    arcticLookupTable[year][value] = month;
  });

  return {
    antarctic: antarcticLookupTable,
    arctic: arcticLookupTable,
  };
};

export {
  queryMinMaxSeaIceExtByYear,
  querySeaIceExtByMonth,
  queryMedianSeaIceExtByMonth,
  queryRecordDates,
  prepareSeaIceExtByMonth,
  generateValue2MonthLookup,
};
