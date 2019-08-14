const MapConfig = {
    container_id: "mapViewDiv",
    web_map_id: {
        antarctic: '8bb127da2b0a4d1290d83072cbc8548b', //'9abb66054ee94c5c9e066dde3bf8aef8',
        arctic: 'beec7fd80cb24356a5f05407976c6696'
    },
    sea_ice_ext_feature_service: {
        url: {
            antarctic: 'https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/seaice_extent_S_v1/FeatureServer/0',
            arctic: 'https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/seaice_extent_N_v1/FeatureServer/0'
        },
        fields: {
            date: 'Rec_Date',
            year: 'Rec_Year',
            month: 'Rec_Month',
        },
        style: {
            fillColor: 'rgba(89,255,252,.3)',
            outlineColor: 'rgba(89,255,252,1)'
        }
    },
    median_sea_ice_ext_feature_service: {
        url: {
            antarctic: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/Median_Sea_Ice_Extent_for_the_Antarctic/FeatureServer/0',
            arctic: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/Median_Sea_Ice_Extent_for_the_Arctic/FeatureServer/0'
        },
        fields: {
            date: 'Rec_Date',
            year: 'Rec_Year',
            month: 'Rec_Month',
        },
        style: {
            fillColor: 'rgba(0,0,0,0)',
            outlineColor: '#fff766'
        }
    }
};

export {
    MapConfig
};