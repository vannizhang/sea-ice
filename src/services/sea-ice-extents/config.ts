const antarctic = {
    url : 'https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/seaice_extent_S_v1/FeatureServer/0',
    fields: {
        date: 'Rec_Date',
        year: 'Rec_Year',
        month: 'Rec_Month',
        area: 'Rec_Area',
        extent: 'Rec_Extent'
    }
};

const arctic = {
    url : 'https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/seaice_extent_N_v1/FeatureServer/0',
    fields: {
        date: 'Rec_Date',
        year: 'Rec_Year',
        month: 'Rec_Month',
        area: 'Rec_Area',
        extent: 'Rec_Extent'
    }
};

export {
    antarctic,
    arctic
};