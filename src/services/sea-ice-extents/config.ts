const antarctic = {
  url:
    'https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/seaice_extent_S_v1/FeatureServer/0',
  fields: {
    date: 'Rec_Date',
    year: 'Rec_Year',
    month: 'Rec_Month',
    area: 'Rec_Area',
    extent: 'Rec_Extent',
  },
};

const arctic = {
  url:
    'https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/seaice_extent_N_v1/FeatureServer/0',
  fields: {
    date: 'Rec_Date',
    year: 'Rec_Year',
    month: 'Rec_Month',
    area: 'Rec_Area',
    extent: 'Rec_Extent',
  },
};

const antarcticMedianSeaIceExt = {
  url:
    'https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/Median_Sea_Ice_Extent_for_the_Antarctic/FeatureServer/0',
  fields: {
    date: 'Rec_Date',
    year: 'Rec_Year',
    month: 'Rec_Month',
    area: 'Area',
    extent: 'ExtentSI',
  },
};

const arcticMedianSeaIceExt = {
  url:
    'https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/Median_Sea_Ice_Extent_for_the_Arctic/FeatureServer/0',
  fields: {
    date: 'Rec_Date',
    year: 'Rec_Year',
    month: 'Rec_Month',
    area: 'Area',
    extent: 'ExtentSI',
  },
};

export { antarctic, arctic, antarcticMedianSeaIceExt, arcticMedianSeaIceExt };
