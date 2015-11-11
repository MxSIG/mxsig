define(function(){
    var sources = {
    	proyName:'mdm6',
        identify:{
        			
                    url:'/TableAliasV60/identifica',
                    field:'busqueda',
                    type: 'POST',
                    contentType : "application/json; charset=utf-8",
                    dataType: "json",
                   // resolution:0
        },
        bufferLayer:{
                    
                     url:'/TableAliasV60/consultaTotales',
                    contentType : "application/json; charset=utf-8",
                    type: 'POST',
                    dataType: "json"
        },
        layersSeaIde:{
                   url:'/TableAliasV60/buscablesIdentificables.do',
                    type: 'POST',
                    dataType: "json"
        },
        identifyDetail:{
                    url:'/TableAliasV60/consulta',
                    field:'busqueda',
                    type: 'POST',
                    contentType : "application/json; charset=utf-8",
                    dataType: "json"
        },
        mainSearch:{
                    url:'http://gaiamapas.inegi.org.mx/mdmSearchEngine/autocomplete/select',
				    sfield:'locacion',
                    type: 'POST',
                    dataType: "jsonp",
                    jsonp:'json.wrf'
        },
		deepSearchTranslate:{
					url:'/TableAliasV60/busqueda',
                    type: 'POST',
                    dataType: "json",
					contentType : "application/json; charset=utf-8",
					stringify:true,
					params:{
						tabla: 'geolocator',
						pagina: 1,
						searchCriteria: '',
						proyName: 'mdm6',
						whereTipo: ''
					}
        },
        crossSearch:{
                    url:'/TableAliasV60/busqueda',
                    contentType : "application/json; charset=utf-8",
                    type: 'POST',
                    dataType: "json"
        },
        deepSearch:{
                   url:'',
                    field:'busqueda',
                    type: 'POST',
                    dataType: "jsonp",
                    jsonp:'json.wrf'
        },
        denue:{
		        	url:'',
		            field:'busqueda',
		            type: 'POST',
		            dataType: "jsonp",
		            jsonp:'json.wrf'
        },
        category:{
                    id:'AR',
                    name:'&Aacute;reas naturales',
                    url:'',
                    field:'busqueda',
                    type: 'POST',
                    dataType: "jsonp",
                    jsonp:'json.wrf',
                    facetField:'descripcion'
          
        },
        kml:{
			save:'/GeneraKML/save2KML.do',
			read:'/GeneraKML/readKML.do'
		},
		geometry:{
			store:'/TableAliasV60/SetGeometry.do',
			addBuffer:'/TableAliasV60/buffer.do'
		},
		timeLine:'json/linetime.do',
        school:'',
         leyendUrl:'',
		synonyms:{
        	list:{
	        		
        		}
        }
    };
    
    return sources;
});