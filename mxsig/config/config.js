requirejs.config({
    paths: {
        mapConfig:'../config/mapConfig',
        ui:'../config/uiConfig',
        dataSource:'../config/dataSourceConfig'
    }
});
define(['mapConfig','ui','dataSource'],function(mapConfig,ui,dataSource){
   var conf = {
        map:mapConfig
    } 
   return{mapConfig:mapConfig,ui:ui,dataSource:dataSource}
});