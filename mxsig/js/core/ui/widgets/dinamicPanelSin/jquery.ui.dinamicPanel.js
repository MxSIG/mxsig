$.widget("custom.dinamicPanel", {
     currentTab:'',//tipo de datos que estan siendo presentados
     toolsTimer:0,
	 messagesTimer:0,
     currentTool:'search',
     lastResults:{},
     searchType:'',
     detailSearch:'',
     toolsOpacityTimer:3500,
     mouseOnPanel:false,
     //Local Data
     route:{
        a:null,
        b:null,
        list:[]
     },
     //data List
        measures:[],
        curr_measure:{},
        buffers:[],
     //point List
        points:[],
        curr_point:{},
     //geometrias
        geo:[],
        curr_geo:{},
     //buffer
        buffer:[],  // los buffer estar�n ligados a las geometrias
        curr_buffer:{},
     // default options
     results:{index:-1,list:[]},
     panels:[{id:'searchPanel',type:'search',height:180,label:'Resultado',desc:'Resultados de b&uacute;squeda',icon:'dinamicPanel-sprite dinamicPanel-search-big'},
             {id:'measurePanel',type:'measure',height:137,label:'Medir',icon:'dinamicPanel-sprite dinamicPanel-measure-big',desc:'Realiza mediciones en el mapa', data:{},list:[]},
             //{id:'pointPanel',type:'point',height:200,label:'Punto',desc:'Colocar puntos de inter&eacute;s', icon:'dinamicPanel-sprite dinamicPanel-point-big'},
             {id:'bufferPanel',type:'buffer',height:165,label:'An&aacute;lisis',desc:'Análisis espacial',icon:'dinamicPanel-sprite dinamicPanel-buffer-big'},
             {id:'leyendPanel',type:'leyend',height:460,label:'Leyenda',desc:'Significado de la simbolog&iacute;a del mapa',icon:'dinamicPanel-sprite dinamicPanel-leyend-big'},
             {id:'geoPanel',type:'geo',height:200,label:'Georref.',desc:'Digitalizar en el mapa', icon:'dinamicPanel-sprite dinamicPanel-geo-big'}
             //{id:'routePanel',type:'route',height:110,label:'Ruteo',icon:'dinamicPanel-sprite dinamicPanel-route-big'}
             ],
     lastSearch:'',
     id:'',
     searchTimer:0,
     options:{
         bufferLayers:[],
         recurrentIdentify:[],
         layers:[],
         timeToSearch:300,
         dataSource:{},
         mapConfig:{},
         urlService:'',
         urlCat:'',
         urlCatDetail:'',
         // callbacks
         onCambioPanel:function(){},
         //external connection
         getActiveLayers:function(){},
         //icons
         getIcon:function(icon){},
         //theme layers
         getBaseLayers:function(){},
         //
         change: null,
		 translate_params:null,
		 translate_results:null,
         //measure events
         map:null  //objeto map de MDM6
     },
     showGallery:function(id,url){
        var obj = this;
        
        var listSource = {url:'config/cemabe.json',
                        type: 'POST',
                        dataType: "json"};
                        
        var dataSource = listSource;//listSource[x];
        obj.getData(dataSource,{}, 
        function(data){ //success
            data.title = data.escuela;
            data.id = data.cctID;
            $('body').append('<div id="dinamicPanel_g"></div>');
            $('#dinamicPanel_g').lightGallery({data:data});
        },
        function(){
            
        }, //error
        function(){
            $('#'+obj.id+'_spinner').addClass('ajax-loader');
            }, //before
        function(){
            $('#'+obj.id+'_spinner').removeClass('ajax-loader');
            }  //complete
        );    
       
     },
     messageHeader:function(text){
        var obj = this;
        var result = obj.options.map.Notification({message:text,time:2000});
        return result;
     },
     //----------------------------------------------
     // Layers
     //-----------------------------------------------
     openLinkWindow:function(url){
      window.open(url);
     },
     mapDeleteMarkers:function(type){
        var obj = this;
        var params = {action:'delete',items:'all',type:type};
        obj.options.map.Mark.event(params);
        
        var params = {action:'delete',items:'all',type:'identify'};
        obj.options.map.Mark.event(params);
     },
     mapShowMarkers:function(opc,type){
        opc = (opc === undefined || opc)?'show':'hide';
        var obj = this;
        var params = {action:opc,items:'all',type:type};
        obj.options.map.Mark.event(params);
     },
     mapNewMarker:function(nom,lon,lat,type,desc,func){
        var obj = this;
        var params = {lon:lon,lat:lat,type:type,params:{nom:nom,desc:desc,func:func}};
        obj.options.map.Mark.add(params);
     },
     mapExtend:function(param,geo){
        var obj = this;
        switch (typeof(param)){
            case 'string':
                    obj.options.map.goCoords(param);        
            break;
            case 'object':
            		var geo = (!(geo === undefined) && geo)?'geographic':'mercator';
            		var lon = 0;
                    var lat = 0;
                    if (param.length == 2){
                        lon = parseFloat(param[0],10);
                        lat = parseFloat(param[1],10);
                    }else{
                    	lon = parseFloat(param.lon);
                        lat = parseFloat(param.lat);
                    }
                    
                    obj.options.map.goCoords(lon,lat,geo);
            break;
        };
     },
     getMapExtent:function(param){
        var obj = this;
        param = (!(param === undefined))?param:'geographic';
        return obj.options.map.getExtent(param);
     },
     getMapCenter:function(param){
        var obj = this;
        return obj.options.map.getDistanceFromCentroid();
     },
     getActiveLayers:function(baseLayers){
		extraLayers = $.extend(true,{},baseLayers);
        var obj = this;
        var layers =this.options.getActiveLayers();
        var defaultLayers = obj.options.recurrentIdentify;
        var list =[];
        var index = [];
        
        var tempExtra = [];
        
        //en caso de que existam capas activas envia capas extra 1000 posiciones debajo
        var extensor =  (layers.length > 0)?1000:0;
        
        
        //agrega capas extra
        if (!(extraLayers === undefined)){
            var tlist = $.extend(true,[],layers);
            for (var x in extraLayers){
                if (x.substr(0,4) != 'img_'){
                    extraLayers[x].idLayer = x;
                    var ban = false;
                    for (var i in layers){
                        if (layers[i].idLayer == x){
                            ban = true;
                        };
                    };
                    if (!ban){
                    	extraLayers[x].position=(extraLayers[x].position+extensor);
                        list[extraLayers[x].position] = extraLayers[x];
                    };
                };
            };
        };
        
        //agrega capas a listado
        for (var x in layers){
            list[layers[x].position] = layers[x];
        };
        
        for (var x in defaultLayers){
            var layer = list[defaultLayers[x].position];
            if (layer === undefined){
                list[defaultLayers[x].position] = defaultLayers[x];
            };
        };
        
        for (var x in list){
        	var item = list[x];
        	var pos = 0;
        	for (var i in index){
				if (index[i].position > parseInt(x,10)){
					break;
				}
				pos++;
        	}
        	index.splice(pos,0,item);
        }
        for (var x in index){
        	index[x] = index[x].idLayer;
        }
        
       
        //----------------------------------------------------------
        // for (var x in list){
            // index.push(list[x].idLayer);
        // };
        //index.reverse();
        
        return index.toString();
     },
     //-----------------------------------------------------------------
     //Tool Panel --------------------------------------------------
     //-----------------------------------------------------------------
     refreshLegend:function(){
       var obj = this;
       if (obj.currentTool == 'leyend'){
           var leyendas = obj.createLeyendList();
           $('#'+obj.id+'_leyendPanel').html(leyendas);
           
           if (!obj.isToolPanelFill()){
                if(obj.isToolPanelOpen()){
                    obj.closeToolPanel();
                };
           }else{
                if(!obj.isToolPanelOpen()){
                    var panel = obj.getPanel('leyendPanel');
                    obj.openToolPanel(panel.height);
                    $('#'+obj.id+'_leyendPanel').css('display','');
                };
           };
       };
       
     },
     createLeyendList:function(){
        var obj = this;
        var list = $.extend(true,{},obj.options.getActiveLayers());
        var baseLayers = obj.options.getBaseLayers();
        var list2 = {};
        for (var x in list){
            list2[list[x].idLayer] = list[x];
        };
        for(var x in baseLayers){
            var layer = list2[x];
            if (layer === undefined){
                list2[x]=baseLayers[x];
            };
        };
        var cadena = '';
        var url = obj.options.dataSource.leyendUrl;
        var localImgPath = 'img/mapaBase/img/';
        //var url = 'http://gaia.inegi.org.mx/NLB/balancer.do?map=/opt/map/mdm5vector.map&Request=GetLegendGraphic&format=image/png&Version=1.1.1&LAYER=';
        for (var x in list2){
            if (x.substr(0,4) == 'img_'){
                cadena+= '<img src="'+localImgPath+(x.split('_')[1])+'.png" />';
            }else{
                cadena+= '<img src="'+url+x+'" />';    
            };
        };
        cadena = (cadena != '')?'<div class="dinamicPanel-leyend-container">'+cadena+'</div>':'';
        return cadena;
     }
     ,
     showResults:function(type){  //sin parametro para ocultar
        var obj = this;
        
        $('.dinamicPanel-panelResult').each(function(){
            $(this).css('display','none');
        });
        
        if (type === undefined){
            $('#'+obj.id+'_results').css('display','none');
        }else{
            
            var content = '';
            
            if ($('#'+obj.id+'_'+type+'_result').html() != ''){
                $('#'+obj.id+'_results').css('display','');
                $('#'+obj.id+'_'+type+'_result').css('display','');
            }else{
                $('#'+obj.id+'_results').css('display','none');
            };
            //switch (type){
            //    case 'search':
            //            $('#'+obj.id+'_'+type+'_result').css('display','');
            //            content = $('#'+obj.id+'_'+type+'_result').html();
            //        break;
            //    case 'route':
            //            $('#'+obj.id+'_'+type+'_result').css('display','');
            //            content = $('#'+obj.id+'_'+type+'_result').html();
            //        break;
            //    case 'measure':
            //            $('#'+obj.id+'_'+type+'_result').css('display','');
            //            obj.measureControl('showList');
            //        break;
            //}
        };
        obj.showPanelResult();
        
     },
     showPanelResult:function(){
        var obj = this;
        var panel = $('#'+obj.id+'_'+obj.currentTool+'_result');
        var results = $('#'+obj.id+'_results');
        if (panel.html() != ''){
            if (results.attr('visible') == 'false'){
                results.fadeIn('fast');
                results.attr('visible',true);
            };
        }else{
             if (results.attr('visible') == 'true'){
                results.attr('visible',false);
                results.fadeOut('fast');
            };
        };
     },
     mapFeatureDisplay:function(type){
        var obj = this;
        var map = obj.options.map; //objeto map externo
        
        //{action:'hide',items:'[id1,id2],type:'measure'}
        //{action:'show',items:'all',type:'buffer'}
     },
     hiddeTools:function(){
        var obj = this;
        $('#'+obj.id+'_toolSet').css('display','none');
     },
     showTools:function(){
        var obj = this;
        $('#'+obj.id+'_toolSet').css('display','');
     },
     showPanel:function(id){  //presenta u oculta paneles sin parametro, oculta
        var obj = this;
        var map = obj.options.map;
       // map.Feature.event({action:'hide',items:'all'});
        
        obj.options.onCambioPanel(id);
        $('.dinamicPanel-panel').each(function(){
           $(this).css('display','none');
        });
        $('.dinamicPanel-tab .dinamicPanel-selector').each(function(){
           $(this).addClass('dinamicPanel-hidde');
        });
        if (!(id === undefined)){
            $('#'+obj.id+'_'+id).css('display','');
            $('#'+obj.id+'_'+id+'_tab .dinamicPanel-selector').removeClass('dinamicPanel-hidde');
            var item = {};
            for (var x in obj.panels){
                if (obj.panels[x].id == id){
                    item = obj.panels[x];
                    break;
                };
            };
            obj.currentTool = item.type;
            obj.createPanel(item.type);
            if ($('#'+obj.id+'_'+item.type+'Panel').html() != ''){ //presenta paneles, solo si existe contenido
                $('#'+obj.id+'_'+item.type+'Panel').css('display','');
                obj.openToolPanel(item.height);
            }else{
                obj.closeToolPanel();
            };
            //obj.showResults(item.type);
            
        };
     },
     temporalView:function(){
        var obj = this;
        clearTimeout(obj.toolsTimer);
        obj.panelTransparency();
        obj.toolsTimer = setTimeout(function()
        	{obj.panelTransparency('activate');},obj.toolsOpacityTimer); 
     },
     panelTransparency:function(opc){
        var obj = this;
        var ban = false;
        var container = $(document.activeElement).attr('id');
        if (!(container === undefined)){   //reviza si no esta algun edit con focus dentro del panel
            var container = $('#'+obj.id+' #'+container).attr('id');
            if (!(container === undefined)){
                ban = true;
                $('#'+container).bind('blur',function(){
                   if (!obj.mouseOnPanel){ //si el mouse no esta en el panel
                    obj.toolsTimer = setTimeout(function(){obj.panelTransparency('activate');},obj.toolsOpacityTimer);
                    $('#'+container).unbind('blur');
                   };
                });
            };
        };
        if (opc === undefined){
            $('#'+obj.id+'_toolSet').css('opacity','');
            
            if ($('#'+obj.id+'_detail').html() == '')
            	obj.showPanelResult();
            
            if (!obj.isToolPanelOpen() && obj.isToolPanelFill() && obj.currentTool == 'search')
                obj.showPanel('searchPanel');
        }else{
            if (!ban && !obj.mouseOnPanel){
                $('#'+obj.id+'_toolSet').css('opacity',0.3);
                obj.hiddeResults();
                if (obj.currentTool == 'search'){
                     obj.closeToolPanel();
                };
            };
        };
     },
     createPanel:function(type,data){
        var obj = this;
        var map = obj.options.map;
        //elimina bloque de detalle
        obj.closeDetail();
        //oculta identificacion
        //desactiva acciones en el mapa
        map.Feature.event({action:'hide',items:'all'});
        obj.options.map.activeCtl({control:'none',active:true});
        //obj.mapShowMarkers(false,'search');
        
        if (typeof(type) == 'object'){
            data = type;
            type = data.type;
        };
        
        if (type != 'search'){
            var params = {action:'delete',items:'all',type:'identify'};
            obj.options.map.Mark.event(params);
        };
        
        var cadena = '';
        obj.showResults(type);
        switch (type) {
            case 'buffer':
                  obj.showBufferList();
                  obj.showResults('buffer');
                  obj.closeDetail();
                  map.Feature.event({action:'show',items:'all' , type:'georeference'});
                break;
            case 'point':
                    var cadena = '';
                    data =  (data === undefined)?
                            {data:{name:'',type:'',measure:0,unit:'metric'},id:''}
                            :data;
                            
                    var isNew = (data.id == '')?true:false;
                                
                    cadena+= '<div class="dinamicPanel-pointPanel" idref="'+data.id+'">';
                    cadena+= '   <div class="pointOption">';
                    cadena+= '      <button id="'+obj.id+'_point_btnStartAction" style="display:'+((isNew)?'':'none')+'">Nuevo</button>';
                    cadena+= '      <button id="'+obj.id+'_point_btnEndAction" style="display:'+((isNew)?'none':'')+'">Cancelar</button>';
                    cadena+= '   </div>';
                    cadena+= '   <div class="pointControls">';
                    cadena+= '      <div class="controls">';
                    cadena+= '          <div id="'+obj.id+'_point_import" class="unit">';
                    cadena+= '                <button id="'+obj.id+'_point_btnImport" style="display:'+((isNew)?'':'none')+'">Importar</button>';
                    cadena+= '          </div>';
                    cadena+= '          <div id="'+obj.id+'_point_export" class="unit">';
                    cadena+= '                  <button id="'+obj.id+'_point_btnExport" style="display:'+((isNew)?'':'none')+'">Exportar</button>';
                    cadena+= '          </div>';
                    cadena+= '      </div>';
                    cadena+= '   </div>';
                    cadena+='    <span class="dinamicPanel-h-line"></span>';
                    cadena+= '   <div class="pointBuffers" align="center">';
                    cadena+= '          <button id="'+obj.id+'_point_btnCreateBuffers" style="display:'+((isNew)?'':'none')+'">Generar &aacute;reas de influencia</button>';
                    cadena+= '   </div>';
                    cadena+= '</div>';
                    
                    $('#'+obj.id+'_pointPanel').html(cadena);
                    $("#"+obj.id+'_point_btnStartAction').button().click(function(){
                        obj.pointControl('startNew','point');
                    });
                    $("#"+obj.id+'_point_btnEndAction').button().click(function(){
                        obj.pointControl('endCreation');
                    });
                    
                    $("#"+obj.id+'_point_btnImport').button();
                    $("#"+obj.id+'_point_btnExport').button().button('disable').click(function(){
                        map.Poi.event({action:'export'});
                    });
                    $("#"+obj.id+'_point_btnCreateBuffers').button().click(function(){
                        obj.pointControl('appyBuffersForAll');
                    }).button("disable");
                    obj.mapShowMarkers(true,'poi');
                    obj.showResults('point');
                    obj.georeferencePoint;
                break;
            case 'geo':
                    var cadena = '';
                    data =  (data === undefined)?
                            {data:{name:'',type:'',measure:0,unit:'metric'},id:''}
                            :data;
                            
                    var um = (data.data.unit == 'metric')?'checked="checked"':'';
                    var ui = (data.data.unit == 'english')?'checked="checked"':'';
                    
                    var tl = (data.data.type == 'line')?'checked="checked"':'';
                    var tp = (data.data.type == 'polygon')?'checked="checked"':'';
                    
                    var isNew = (data.id == '')?true:false;
                    var isMetric = (data.data.unit == 'metric')?true:false;
                    
                    cadena+= '<div class="dinamicPanel-geoPanel" idref="'+data.id+'">';
                    cadena+= '   <div class="geoOption">';
                    cadena+= '      <div style="display:'+((isNew)?'':'none')+'" id="'+obj.id+'_geo_typeSet" class="type">';
                    cadena+= '           <input type="radio" '+tl+' id="'+obj.id+'_geo_point" class="geoType" value="georeferencePoint" idref="point" name="geo_type"/><label for="'+obj.id+'_geo_point">Punto</label>';
                    cadena+= '           <input type="radio" '+tp+' id="'+obj.id+'_geo_line" class="geoType" value="georeferenceLine" idref="line" name="geo_type"/><label for="'+obj.id+'_geo_line">L&iacute;nea</label>';
                    cadena+= '           <input type="radio" '+tp+' id="'+obj.id+'_geo_poly" class="geoType" value="georeferencePolygon" idref="poly" name="geo_type"/><label for="'+obj.id+'_geo_poly">Pol&iacute;gono</label>';
                    cadena+= '      </div>';
                    cadena+= '      <button id="'+obj.id+'_geo_btnEndAction" style="top:-9px;display:'+((isNew)?'none':'')+'">Cancelar</button>';
                    cadena+= '      <button id="'+obj.id+'_geo_btnFinish" style="top:-5px;display:'+((isNew)?'none':'')+'">Terminar</button>';
                    cadena+= '      <div id="'+obj.id+'_geo_errorFile" style="font-size:115%;width:150px;display:none" >';
                    cadena+= '          <div style="width:100%;padding-left: 0.7em;padding-right: 0.7em;" class="ui-state-error ui-corner-all">';
                    cadena+= '              <p>';
                    cadena+= '                  <span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-alert"></span>';
		    cadena+= '                  <strong>Archivo no valido</strong>';
                    cadena+= '              </p>';
                    cadena+= '          </div>';
                    cadena+= '      </div>';
                    cadena+= '   </div>';
                    cadena+= '   <div class="geoControls">';
                    cadena+= '      <div class="controls">';
                    cadena+= '          <div id="'+obj.id+'_geo_import" class="unit">';
                    cadena+= '                  <button id="'+obj.id+'_geo_btnImport" style="display:'+((isNew)?'':'none')+'">Importar kml</button>';
                    cadena+= '                  <button style="width:120px;display:none" id="'+obj.id+'_geo_btnImporting" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button" aria-disabled="false">';
                    cadena+= '                      <span class="ajax-loader" style="position:absolute;left:0px;height:20px;width:20px"></span>';
                    cadena+= '                      <span class="ui-button-text">Importando...</span>';
                    cadena+= '                  </button>';
                    cadena+= '          </div>';
                    cadena+= '          <div id="'+obj.id+'_geo_export" class="unit">';
                    cadena+= '                <button id="'+obj.id+'_geo_btnExport" style="display:'+((isNew)?'':'none')+'">Exportar kml</button>';
                    cadena+= '          </div>';
                    cadena+= '      </div>';
                    cadena+= '   </div>';
                    cadena+='    <span class="dinamicPanel-h-line"></span>';
                    cadena+= '   <div class="geoBuffers" align="center">';
                    cadena+= '          <button id="'+obj.id+'_geo_btnCreateBuffers" style="display:'+((isNew)?'':'none')+'">Generar &aacute;reas de influencia a puntos</button>';
                    cadena+= '   </div>';
                    cadena+= '</div>';
                    
                    
                    $('#'+obj.id+'_geoPanel').html(cadena);
                    $('#'+obj.id+'_geo_unitSet').buttonset().change(function(){
                        $('#'+obj.id+'_geo_value').html(obj.convertionUnit(
                                                           $('#'+obj.id+'_geo_unitSet :radio:checked').attr('value'),
                                                           $('#'+obj.id+'_geo_typeSet :radio:checked').attr('value'),
                                                           parseFloat($('#'+obj.id+'_geo_value').attr('value'),10)
                                                           ));
                    });
                    $('#'+obj.id+'_geo_typeSet').buttonset().change(function(){
                        obj.geoControl('addNew',$('#'+obj.id+'_geo_typeSet :radio:checked').attr('idref'));
                    });
                    $('#'+obj.id+'_geo_btnEndAction').button().click(function(){
                         obj.geoControl('endCreation');
                    });
                    $('#'+obj.id+'_geo_btnFinish').button().click(function(){
                         var finished = map.Feature.finishGeoreference();
                         if(!finished){
                            $('#'+obj.id+'_geo_btnEndAction').click();
                         };
                    });
                    
                     $("#"+obj.id+'_geo_btnImport').button().click(function(){
                         map.Feature.importGeoreference();
                    });
                    $("#"+obj.id+'_geo_btnExport').button().button('disable').click(function(){
                        map.Feature.exportGeoreference();
                    });
                    $("#"+obj.id+'_geo_btnCreateBuffers').button().click(function(){
                        obj.geoControl('appyBuffersForAllPoints');
                    }).button("disable");
                    
                    map.Feature.event({action:'show',items:'all' , type:'georeference'});
                    obj.showResults('geo');
                    if(obj.geo.length>0){
                        $("#"+obj.id+'_geo_btnCreateBuffers').button('enable');
                        $("#"+obj.id+'_geo_btnExport').button('enable');
                    };
                    obj.geoControl('declareEvents');
                    obj.geoControl('enableBufferPoints');
                break;
            case 'search':
                    var detailSearch = data;
                    $('#'+obj.id+'_routePanel').html(detailSearch);
                    obj.mapShowMarkers(true,'search');
                break;
            case 'leyend':
                    obj.refreshLegend();
                    //$('#'+obj.id+'_leyendPanel').html(obj.createLeyendList());
                break;
            case 'route':
                    var cadena = '';
                    data = {type:'optimal'};
                    
                    var rto = (data.type == 'optimal')?'checked="checked"':'';
                    var rtl = (data.type == 'length')?'checked="checked"':'';
                    var rtf = (data.type == 'free')?'checked="checked"':'';
                    
                    cadena+= '<div class="route-controls">';
                    cadena+= '  <label>M&eacute;todo de trazado:</label>';
                    cadena+= '  <div id="'+obj.id+'_route_typeSet" class="type">';
                    cadena+= '       <input type="radio" '+rto+' id="'+obj.id+'_measure_optimal" value="line" name="measure_type"/><label for="'+obj.id+'_measure_optimal">&Oacute;ptima</label>';
                    cadena+= '       <input type="radio" '+rtl+' id="'+obj.id+'_measure_length" value="poly" name="measure_type"/><label for="'+obj.id+'_measure_length">Distancia</label>';
                    cadena+= '       <input type="radio" '+rtf+' id="'+obj.id+'_measure_free" value="poly" name="measure_type"/><label for="'+obj.id+'_measure_free">Libre</label>';
                    cadena+= '  </div>';
                    cadena+= '</div>';
                    
                    $('#'+obj.id+'_routePanel').html(cadena);
                    $('#'+obj.id+'_route_typeSet').buttonset();
                    
                    obj.createRouteUI();
                    
                break;
            case 'measure':
                    var cadena = '';
                    data =  (data === undefined)?
                            {data:{name:'',type:'',measure:0,unit:'metric'},id:''}
                            :data;
                            
                    var um = (data.data.unit == 'metric')?'checked="checked"':'';
                    var ui = (data.data.unit == 'english')?'checked="checked"':'';
                    
                    var tl = (data.data.type == 'line')?'checked="checked"':'';
                    var tp = (data.data.type == 'polygon')?'checked="checked"':'';
                    
                    var isNew = (data.id == '')?true:false;
                    var isMetric = (data.data.unit == 'metric')?true:false;
                    
                    cadena+= '<div class="dinamicPanel-measurePanel" idref="'+data.id+'">';
                    cadena+= '   <div class="measureOption">';
                    cadena+= '      <div style="display:'+((isNew)?'':'none')+'" id="'+obj.id+'_measure_typeSet" class="type">';
                    cadena+= '           <input type="radio" '+tl+' id="'+obj.id+'_measure_line" class="measureType" value="measureLine" idref="line" name="measure_type"/><label for="'+obj.id+'_measure_line">Medir distancia</label>';
                    cadena+= '           <input type="radio" '+tp+' id="'+obj.id+'_measure_poly" class="measureType" value="measurePolygon" idref="poly" name="measure_type"/><label for="'+obj.id+'_measure_poly">Medir &aacute;rea</label>';
                    cadena+= '      </div>';
                    cadena+= '      <button id="'+obj.id+'_measure_btnEndAction" style="top:-9px;display:'+((isNew)?'none':'')+'">Cancelar</button>';
                    cadena+= '      <button id="'+obj.id+'_measure_btnFinish" style="top:-4px;display:'+((isNew)?'none':'')+'">Terminar</button>';
                    cadena+= '   </div>';
                    cadena+= '   <div class="measureControls">';
                    cadena+= '      <div class="controls">';
                    cadena+= '          <div id="'+obj.id+'_measure_unitSet" class="unit">';
                    cadena+= '              <input type="radio" '+um+' '+((isMetric)?'selected="selected"':'')+' id="'+obj.id+'_measure_unit_1" value="metric" name="measure_unit"/><label for="'+obj.id+'_measure_unit_1">M&eacute;trico</label>';
                    cadena+= '              <input type="radio" '+ui+' '+((isMetric)?'':'selected="selected"')+' id="'+obj.id+'_measure_unit_2" value="english" name="measure_unit"/><label for="'+obj.id+'_measure_unit_2">Ingl&eacute;s</label>';
                    cadena+= '          </div>';
                    cadena+= '          <div id="'+obj.id+'_measure_value" class="value" value="'+data.data.measure+'">'+obj.convertionUnit(data.data.unit,data.data.type,data.data.measure)+'</div>';
                    cadena+= '      </div>';
                    cadena+= '   </div>';
                    cadena+= '</div>';
                    
                    $('#'+obj.id+'_measurePanel').html(cadena);
                    $('#'+obj.id+'_measure_unitSet').buttonset().change(function(){
                        $('#'+obj.id+'_measure_value').html(obj.convertionUnit(
                                                           $('#'+obj.id+'_measure_unitSet :radio:checked').attr('value'),
                                                           $('#'+obj.id+'_measure_typeSet :radio:checked').attr('value'),
                                                           parseFloat($('#'+obj.id+'_measure_value').attr('value'),10)
                                                           ));
                    });
                    $('#'+obj.id+'_measure_typeSet').buttonset().change(function(){
                        obj.measureControl('addNew',$('#'+obj.id+'_measure_typeSet :radio:checked').attr('idref'));
                    });
                    $('#'+obj.id+'_measure_btnEndAction').button().click(function(){
                         obj.measureControl('endCreation');
                    });
                    $('#'+obj.id+'_measure_btnFinish').button().click(function(){
                        var finished = map.Feature.finishMeasure();
                        if(!finished){
                            $('#'+obj.id+'_measure_btnEndAction').click();
                        };
                    });
                    map.Feature.event({action:'show',items:'all' , type:'measure'});
                    obj.showResults('measure');
                break;
            //case 'buffer':
            //        data =  (data === undefined)?
            //                {data:{name:'',type:'line',measure:0,unit:'metric'},id:''}
            //                :data;
            //                
            //        var um = (data.data.unit == 'metric')?'checked="checked"':'';
            //        var ui = (data.data.unit == 'english')?'checked="checked"':'';
            //        
            //        var tl = (data.type == 'line')?'checked="checked"':'';
            //        var tp = (data.type == 'poly')?'checked="checked"':'';
            //        var cadena = '';
            //        cadena+= '<div class="dinamicPanel-bufferPanel">';
            //        cadena+= '   <div class="bufferOption">';
            //        cadena+= '      <div style="display:none" id="'+obj.id+'_buffer_typeSet" class="type">';
            //        cadena+= '           <input type="radio" '+tl+' id="'+obj.id+'_buffer_line" value="bufferLine" name="buffer_type"/><label for="'+obj.id+'_buffer_line">Distancia</label>';
            //        cadena+= '           <input type="radio" '+tp+' id="'+obj.id+'_buffer_poly" value="bufferPolygon" name="buffer_type"/><label for="'+obj.id+'_buffer_poly">&Aacute;rea</label>';
            //        cadena+= '      </div>';
            //        cadena+= '      <button id="'+obj.id+'_buffer_btnNew">Iniciar</button>';
            //        cadena+= '      <button id="'+obj.id+'_buffer_btnEndAction" style="display:none">Terminar</button>';
            //        cadena+= '   </div>';
            //        cadena+= '   <div class="bufferButtons">';
            //        cadena+= '          <div id="'+obj.id+'_buffer_btnToBuffer" class="right dinamic_flatBtn"><span class="dinamicPanel-sprite dinamicPanel-buffer-short"></span><label>Convertir</Label></div>';
            //        cadena+= '          <div id="'+obj.id+'_buffer_btnEdit" class="right dinamic_flatBtn"><span class="dinamicPanel-sprite dinamicPanel-edit-short"></span><label>Editar</label></div>';
            //        cadena+= '          <div id="'+obj.id+'_buffer_btnSave" class="right dinamic_flatBtn"><span class="dinamicPanel-sprite dinamicPanel-ok-short"></span><label>Guardar</label></div>';
            //        cadena+= '   </div>';
            //        cadena+= '   <div class="mesureControls">';
            //        cadena+= '      <div class="head"><input id="'+obj.id+'_buffer_name" type="text" value="'+data.name+'"/></div>';
            //        cadena+= '      <div class="controls">';
            //        cadena+= '          <div id="'+obj.id+'_buffer_unitSet" class="unit">';
            //        cadena+= '              <input type="radio" '+um+' id="'+obj.id+'_buffer_unit_1" value="metric" name="buffer_unit"/><label for="'+obj.id+'_buffer_unit_1">M&eacute;trico</label>';
            //        cadena+= '              <input type="radio" '+ui+' id="'+obj.id+'_buffer_unit_2" value="english" name="buffer_unit"/><label for="'+obj.id+'_buffer_unit_2">Ingl&eacute;s</label>';
            //        cadena+= '          </div>';
            //        cadena+= '          <div id="'+obj.id+'_buffer_value" class="value">145.363km</div>';
            //        cadena+= '      </div>';
            //        cadena+= '   </div>';
            //        cadena+= '</div>';
            //        
            //        $('#'+obj.id+'_bufferPanel').html(cadena);
            //        $('#'+obj.id+'_buffer_unitSet').buttonset();
            //        $('#'+obj.id+'_buffer_typeSet').buttonset().click(function(){
            //            obj.bufferControl('addNew',$('#'+obj.id+'_buffer_typeSet :radio:checked').attr('value'));
            //        });
            //        $('#'+obj.id+'_buffer_btnNew').button().click(function(){
            //            obj.bufferControl('startNew');
            //        });
            //        $('#'+obj.id+'_buffer_btnEndAction').button().click(function(){
            //             obj.bufferControl('endCreation');
            //        })
            //        obj.showResults('buffer');
            //    break;
            
        };
     },
     //measure manage-------------------------
     convertionUnit:function(type,poly,value){
            var result = value;
            var label = 'm';
            var post = (poly == 'measureLine' || poly == 'line')?'':'&sup2;';
            
            var banMetros = (type == 'metric');
            var banCuad = (post != '');
            if (banMetros){
                if (!banCuad){
                    label = (value > 1000)?'km':label;
                    value = (value > 1000)?(value/1000):value;
                }else{
                    label = (value > 1000000)?'km':label;
                    value = (value > 1000000)?(value/1000000):value;
                }
            }else{
                label = 'yr';
                if (!banCuad){
                    value = value*1.0936133;
                    label = (value > 1760)?'mi':label;
                    value = (value > 1760)?(value/1760):value;
                }else{
                    value = value*1.1960;
                    label = (value > 3097600)?'mi':label;
                    value = (value > 3097600)?(value/3097600):value;
                }
            }
            return value.formatMoney(3, '.', ',')+' '+label+post;
     },
     measureControl:function(opc,data){
        var obj = this;
        var list = obj.measures;   //listado mediciones
        var map = obj.options.map; //objeto map externo
        //control de interface
        var removeItem = function(pos,id){
            map.Feature.event({action:'delete',id:id});
            list.splice(pos,1);
            map.activeCtl({control:'measure',active:false});
        };
        var showList = function(){
            $('#'+obj.id+'_measure_result').html(obj.createPolyList(list));
            $('.dinamicPanel-featureEditName').each(function(){
                $(this).click(function(){
                   var idref = $(this).attr('idref');
                   $(this).css('display','none');
                   $('.dinamicPanel-featureOkName[idref="'+idref+'"]').css('display','').click(function(){
                        var idRef = $(this).attr('idref');
                        var item = getPoly(idRef);
                        item.data.name = $('#inputText_'+idRef).val();
                        editPoly(item);
                    });
                   $('.dinamicPanel-featureName[idref="'+idref+'"]').css('display','none');
                   $('#inputText_'+idref).css('display','').focus();
                   obj.setInputTextRestriction('inputText_'+idref,function(ban){
                        if (ban){$('.dinamicPanel-featureOkName[idref="'+idref+'"]').css('display','');}
                        else{$('.dinamicPanel-featureOkName[idref="'+idref+'"]').css('display','none');};
                    },function(){
                        if ($('#inputText_'+idref).val() != '')$('.dinamicPanel-featureOkName[idref="'+idref+'"]').click();
                    });
                });
            });
            $('.dinamicPanel-featureItem').each(function(){
                  $(this).click(function(e){
                    var id =  $(this).attr('id');
                    var pos = parseInt($(this).attr('pos'),10);
                    var item = getPoly(id);
                    map.Feature.event({select:true,id:id});
                    //obj.createPanel('measure',item);
                    e.stopPropagation();  
                  });
            });
            $('.dinamicPanel-panelResult .dinamicPanel-buffer').each(function(){
                  $(this).click(function(e){
                    var id =  $(this).attr('idref');
                    var pos = parseInt($(this).attr('pos'),10);
                    var item = getPoly(id);
                       //obj.createPanel('measure',item);
                    e.stopPropagation();  
                  });
            });
            $('.feature-rem-button').each(function(){
                  $(this).click(function(e){
                    var id =  $(this).attr('idref');
                    var pos = parseInt($(this).attr('pos'),10);
                    var item = getPoly(id);
                    
                    if (id == $('#'+obj.id+'_measurePanel').attr('idref')){
                        $('#'+obj.id+'_measurePanel').attr('idref','');
                        obj.createPanel('measure');
                    };
                    removeItem(pos,id);
                    obj.measureControl('showList');
                    e.stopPropagation();  
                  });
            });
        };
        var clickNew = function(){
            $('#'+obj.id+'_measurePanel').attr('idref','');
            $('#'+obj.id+'_measure_btnEndAction').css('display','');
            $('#'+obj.id+'_measure_btnFinish').css('display','');
            $('#'+obj.id+'_measure_line').attr('checked',true);
            $('#'+obj.id+'_measure_typeSet').buttonset('refresh').css('display','');
            setTimeout(function(){
                $('#'+obj.id+'_measure_typeSet :radio:checked').click();
            },100);
        };
        var clickEnd = function(){
            $('#'+obj.id+'_measure_btnEndAction').css('display','none');
            $('#'+obj.id+'_measure_btnFinish').css('display','none');
            $('#'+obj.id+'_measure_typeSet').css('display','');
            obj.createPanel('measure');
            obj.measureControl('none');
        };
        var editPoly = function(item){
                        var params = {action:'set',id:item.id,params:item};
                        map.Feature.event(params);
                        obj.measureControl('showList');
                        obj.createPanel('measure');
        };
        var getPoly = function(id){
            var result = null;
            for (var x in list){
                var item = list[x];
                if (item.id == id){
                    result = item;
                    break;
                };
            };
            return result;
        };
        //manejo de los poligonos
        var newPolygon = function(){
            type = $('#'+obj.id+'_measure_typeSet :radio:checked').attr('value');
            $('#'+obj.id+'_measure_btnEndAction').css('display','');
            $('#'+obj.id+'_measure_btnFinish').css('display','');
            $('#'+obj.id+'_measure_typeSet').css('display','none');
            
            map.event.setEventDisableCtl(function(data){
            });
            map.activeCtl({control:type,active:true});
            map.event.setFeatureAdded(function(data){savePoly(data);});
            map.event.setFeatureCanceled(function(){});
            map.event.setEventCatchMeasure(function(data){
                $('#'+obj.id+'_measure_value').html(obj.convertionUnit(
                                                           $('#'+obj.id+'_measure_unitSet :radio:checked').attr('value'),
                                                           $('#'+obj.id+'_measure_typeSet :radio:checked').attr('value'),
                                                           data
                                                           )).attr('value',data);
            });
            map.event.setEventPoiAdded(function(e){});
            map.event.setEventPoiCanceled(function(){});
            map.event.setEventDisableCtl(function(data){
               clickEnd();
            });
        };
        var savePoly = function(data){
            if (!(data === undefined) && data.type == 'measure'){
                var ban = false;
                data.data.unit = $('#'+obj.id+'_measure_unitSet :radio:checked').attr('value');
                data.tools = [];
                for (var x in list){
                    var item = list[x];
                    if (item.id == data.id){
                        ban = true;
                        item = data;
                        break;
                    };
                };
                if (!ban){
                    list.push(data);
                };
                showList();
                
                $('#'+obj.id+'_measurePanel').attr('idref',data.id);
                obj.createPanel('measure');
                obj.curr_measure = data;
                obj.temporalView();
                obj.blinkElement(data.id);
                map.Feature.event({select:true,id:data.id});
                
                //sobre escribe con unidad de medida seleccionada
                var params = {action:'set',id:data.id,params:data};
                map.Feature.event(params);
            };
        };
        //atrapa evento solicitado
        if (map != null){
            if (opc == 'none'){
                obj.options.map.activeCtl({control:'none',active:true});
            }else{
                switch (opc){
                    case 'showList':
                         showList();
                        break;
                    case 'editPoly':
                        editPoly(data);
                        break;
                    case 'startNew':
                            clickNew();
                            newPolygon();
                        break;
                    case 'endCreation':
                            clickEnd();
                        break;
                    case 'addNew':
                            newPolygon();
                        break;
                };    
            };
        };
     },
     //Buffer control------------------------
     
     showBufferList:function(){
        var obj = this;
        var buffer = obj.buffer;
        var geo = $.extend(true,{},obj.geo);
        var tgeo = [];
        //bufferLayers
        saveLayerSelected = function(layer,idPos){
            buffer[idPos] = {crossLayer:layer};
        };
        for (var x in geo){
            if (geo[x].data.type == 'polygon'){
                var cross = '';
                if (!(buffer[geo[x].id] === undefined)){
                    cross = buffer[geo[x].id].crossLayer;
                };
                geo[x].crossLayer = cross;
                geo[x].tools = ['selection'];
                geo[x].lock = true;
                tgeo.push(geo[x]);
            };
        };
        geo = tgeo;
        var cadena = obj.createPolyList(geo);
        $('#'+obj.id+'_buffer_result').html(cadena); //impresion de datos
        
        $('#'+obj.id+'_buffer_result select').each(function(){
            $(this).change(function(e){
                var layer = $(this).val();
                var idref = $(this).attr('idref');
                saveLayerSelected(layer,idref);
                e.stopPropagation();
            });
            
        });
        $('#'+obj.id+'_buffer_result button[type="selection"]').each(function(){
            $(this).click(function(){
               var idref = $(this).attr('idref');
               var layer = $('#'+idref+'_layer').val();
               obj.getBufferLayerData(idref,layer);
            });
        });
        
     },
     identificableToCombo:function(id,sel){
        var obj = this;
        var baseLayers = obj.options.getBaseLayers();
        var list = obj.options.bufferLayers;
        var activeL = obj.options.getActiveLayers();
        var tactive = [];
       
        var cadena = '<select id="'+id+'_layer" idref="'+id+'" class="dinamicPanel-layerSelect">';
        if (sel == '')+'<option selected="selected" value="-1">Seleccione una capa</option>';
        for (var x in list){
            var layer = list[x];
            for (var i in activeL){
                if (layer.nombre == activeL[i].idLayer){
                    tactive.push(layer.nombre);
                    var selec = (sel != '' && sel == layer.nombre )?' selected="selected" ':'';
                    cadena+= '<option value="'+layer.nombre+'" '+selec+'>'+layer.alias+'</option>';
                    break;
                };
            };
        };
        
        //inclusion de capas base
        for (var x in list){
            var layer = list[x];
            var blayer = baseLayers[layer.nombre]; //incluye capas solo si no existe en las activas que ya se agregaron
            if (!(blayer === undefined) && (tactive.indexOf(layer.nombre) < 0)){
                var selec = (sel != '' && sel == layer.nombre )?' selected="selected" ':'';
                cadena+= '<option value="'+layer.nombre+'" '+selec+'>'+layer.alias+'</option>';   
            };
        };
        
        cadena+= '</select>';
        return cadena;
     },
     //spinner
     dataSpinner:function(ban){
        var obj = this;
       if (ban){
          $('#'+obj.id+'_spinner').addClass('ajax-loader');
       }else{
          $('#'+obj.id+'_spinner').removeClass('ajax-loader');
       };
     },
     //cruce de datos----------------------------------
     convertBufferLayerData:function(data){
        var pointer = data.data.value;
        var filterFields= function(label){
            var tlabel = label;
            switch (label){
                case 'ID':
                        tlabel = '_id';
                    break;
                case 'ubicacion':
                        tlabel = '_hidden_extent';
                    break;
                case 'tabla':
                        tlabel = '_hidden_tabla';
                    break;
            };
            return tlabel;
        };
        convertField = function(field){
            //var label = field.aliasName;
            //var value = field.value;
            //switch (label){
            //    case ''
            //    
            //}
        };
        for (var x in pointer){
            var id = '';
            var tabla = '';
            var row = pointer[x];  //sube un nivel el fields
                row.fields = row.fields.fields;
                listf = row.fields;
                for (var i in listf){
                    var field = listf[i];
                    //field = convertField(field);
                    field['label'] = filterFields(field.aliasName);
                    
                    if(field.label == 'tabla')tabla = field.value;
                    if(field.label == '_id')id = field.value;
                    
                };
                listf.push({label:'_btn_identificar',value:tabla,text:'Informaci&oacute;n',sprite:'dinamicPanel-sprite dinamicPanel-info'});
        };
        data.data.pageSize = 50;
        data.data.recordCount = data.data.totalFields;
       return data; 
     },
     //cruce de datos----------------------------------
     convertIdentifyData:function(data){
        var pointer = data.data.value;
        var filterFields= function(label){
            var tlabel = label;
            switch (label){
                case 'ID':
                        tlabel = '_id';
                    break;
                case 'ubicacion':
                        tlabel = '_hidden_extent';
                    break;
                case 'tabla':
                        tlabel = '_hidden_tabla';
                    break;
            };
            return tlabel;
        };
        convertField = function(field){
            //var label = field.aliasName;
            //var value = field.value;
            //switch (label){
            //    case ''
            //    
            //}
        };
        if (pointer.length > 0){
        
        //for (var x in pointer){
			pointer = pointer[0];

            var id = '';
            var tabla = '';
            var row = pointer;  //sube un nivel el fields
                row.fields = row.tables[0].fields.fields;
                data.data.recordCount = row.totalFields;
                data.data.currentPage = row.currentPage;
                data.data.tabla = row.tabla;
                tabla = row.tabla;
                listf = row.fields;
                for (var i in listf){
                    var field = listf[i];
                    //field = convertField(field);
                    field['label'] = filterFields(field.aliasName);
                    
                    if(field.label == 'tabla')tabla = field.value;
                    if(field.label == '_id')id = field.value;
                };
                listf.push({label:'_btn_identificar',value:tabla,text:'Informaci&oacute;n',sprite:'dinamicPanel-sprite dinamicPanel-info'});
                listf.push({label:'_hidden_tabla',value:tabla});


        //};
        data.data.value = [{fields:listf}];
        data.data.pageSize = 50;
        data.data.response = {success:true};
        //data.data.recordCount = data.data.totalFields;
        }
       return data; 
     },
     pageSourceResults:function(url,params){
        var obj = this;
        var firstRun = false;
            
            //var message = obj.messageHeader('Procesando datos');
            var printDetailHeader = function(data){
                //message.hide();
                var totales = data.totales;
                var cadena = '';
                var title = 'Resultados';
                if (!(totales === undefined) && totales != null){
                    title = 'Totales';
                    var list = data.totales[0].fields.fields;
                    for (var x in list){
                        var item = list[x];
                        cadena+= '<div class="customDetail-header-item"><label>'+item.aliasName+'</label><span>'+parseInt(item.value,10).formatMoney()+'</span></div>';
                    };
                }
                $('#dinamicPanel_customDetail_header').html(cadena);
                $('#dinamicPanel_customDetail_title').html(title);
            };
            var winHeight = $(window).height()/2;
            var detalle = {};
                //var content = '<div id="dinamicPanel_customDetail_header" class="dinamicPanel-customDetail-header"></div>';
                var content = '<div class="dinamicPanel-customDetail" style="height:'+winHeight+'px;">';
                    content+= '     <div class="dinamicPanel-customDetail-container" style="height:'+winHeight+'px">';
                    content+= '         <div id="dinamicPanel_buffer" class="dinamicPanel-customDetail-body"></div>';
                    content+= '     </div>';
                    content+= '</div>';
                detalle.content = content;
                detalle.onClose = function(){obj.createPanel('buffer');};
                detalle.onCreate = function(){
                    //oculta resultados
                    $('#'+obj.id+'_detail').css('display','none');
                    $('#'+obj.id+'_buffer_result').html('');
                    
                    var msg = obj.options.map;
                    obj.showResults();
                    //var dataSource = obj.options.dataSource.identify;
                   // var proyName = dataSource.proyName;
                    
                    
                    /*
     	identify:{
        			url:'http://10.28.19.73:8080/TableAliasV60/identifica',
                    //url:'http://10.1.30.102/TableAliasV60/identifica',
                    field:'busqueda',
                    type: 'POST',
                    contentType : "application/json; charset=utf-8",
                    dataType: "json",
                    resolution:0
        },
                    
                    pagina: "1"
					proyName: "mdm6"
					resolution: 76.43702827148438
					tablas: "c102,c110,c102m,c311,c793,c795,c101,c100,c300,c301,c302,c112,c310,c203,c200,c202,c206,c111,c103,c354,c201"
					tipo: "identificar"
					where: ""
					width: 76.43702827187516
					x1: -11386379.077014
					y1: 2497217.1115289
                    
                    */
                    // var params = {
                        // 'tabla':layers,
                        // 'pagina':1,
                        // "totalesConsulta":"Totales",
                        // "proyName":proyName,
                        // "where": ""
                    // };
                    
                    $("#dinamicPanel_buffer").smartDataTable({
                              //response json
                              successBan:'response.success',
                              dataPos:'',
                              stringify:true,
                              searchParams:{urlData:url},
                              extraParams:params,
                              canWrite:false,
                              spinnerImg:function(ban){
                                obj.dataSpinner(ban);
                                if (ban){
                                    msg = obj.options.map.Notification({message:'Procesando informaci&oacute;n'});
                                }
                                else{
                                    msg.hide();
                                }
                                
                              },
                              convertData:function(data){
                              	var tdata = obj.convertIdentifyData(data); 
                                return tdata.data;
                              },
                              buttonAction:function(id,action,opc){
                                switch(action){
                                    case 'record':
                                        //var element = $('#dinamicPanel_buffer_tableContainer div[idref*="'+id+'"]'); 
                                        //var tabla = element.attr('tabla');
                                        //obj.options.map.Feature.addArea(id,tabla,0);
                                        break;
                                    case 'data':
                                         if (!firstRun){
                                            firstRun = true;
                                            $('#'+obj.id+'_detail').fadeIn('fast');
                                            printDetailHeader(opc);
                                         }
                                        break;
                                     case 'identificar':
                                         var element = $('#dinamicPanel_buffer_tableContainer div[idref*="'+id+'"]'); 
                                         var tabla = element.attr('tabla');
                                         obj.searchDetail(id,tabla);
                                         break;
                                    
                                    
                                };
                              }
                            });
                };
            obj.showDetail(detalle,'content','hidden');
     },
     getBufferLayerData:function(idPoly,layer){
        var obj = this;
        var firstRun = false;
        var poly = obj.options.map.Feature.event({action:'get',id:idPoly});
        poly = poly.data.db;
        if (!(poly === undefined)){
            //var message = obj.messageHeader('Procesando datos');
            var printDetailHeader = function(data){
                //message.hide();
                var totales = data.totales;
                var cadena = '';
                var title = 'Resultados';
                if (!(totales === undefined) && totales != null){
                    title = 'Totales';
                    var list = data.totales[0].fields.fields;
                    for (var x in list){
                        var item = list[x];
                        cadena+= '<div class="customDetail-header-item"><label>'+item.aliasName+'</label><span>'+parseInt(item.value,10).formatMoney()+'</span></div>';
                    };
                }
                $('#dinamicPanel_customDetail_header').html(cadena);
                $('#dinamicPanel_customDetail_title').html(title);
            };
            var winHeight = $(window).height()/2;
            var detalle = {};
                //var content = '<div id="dinamicPanel_customDetail_header" class="dinamicPanel-customDetail-header"></div>';
                var content = '<div class="dinamicPanel-customDetail" style="height:'+winHeight+'px;">';
                    content+= '     <div class="dinamicPanel-customDetail-container" style="height:'+winHeight+'px">';
                    content+= '         <div id="dinamicPanel_buffer" class="dinamicPanel-customDetail-body"></div>';
                    content+= '     </div>';
                    content+= '</div>';
                detalle.content = content;
                detalle.onClose = function(){obj.createPanel('buffer');};
                detalle.onCreate = function(){
                    //oculta resultados
                    $('#'+obj.id+'_detail').css('display','none');
                    $('#'+obj.id+'_buffer_result').html('');
                    
                    var msg = obj.options.map;
                    
                    obj.showResults();
                    var dataSource = obj.options.dataSource.bufferLayer;
                    var proyName = obj.options.dataSource.proyName;
                    var params = {
                        'tabla':layer,
                        'pagina':1,
                        "totalesConsulta":"Totales",
                        "poligono":poly,
                        "proyName":proyName,
                        "where": ""
                    };
                    $("#dinamicPanel_buffer").smartDataTable({
                              //response json
                              successBan:'response.success',
                              dataPos:'data',
                              stringify:true,
                              searchParams:{urlData:dataSource.url},
                              extraParams:params,
                              canWrite:false,
                              spinnerImg:function(ban){
                                obj.dataSpinner(ban);
                                if (ban){
                                    msg = obj.options.map.Notification({message:'Procesando informaci&oacute;n'});
                                }
                                else{
                                    msg.hide();
                                }
                                
                              },
                              convertData:function(data){
                                return obj.convertBufferLayerData(data);
                              },
                              buttonAction:function(id,action,opc){
                                switch(action){
                                    case 'record':
                                        //var element = $('#dinamicPanel_buffer_tableContainer div[idref*="'+id+'"]'); 
                                        //var tabla = element.attr('tabla');
                                        //obj.options.map.Feature.addArea(id,tabla,0);
                                        break;
                                    case 'data':
                                         if (!firstRun){
                                            firstRun = true;
                                            $('#'+obj.id+'_detail').fadeIn('fast');
                                            printDetailHeader(opc);
                                         }
                                        break;
                                    case 'identificar':
                                        var element = $('#dinamicPanel_buffer_tableContainer div[idref*="'+id+'"]'); 
                                        var tabla = layer;/*element.attr('tabla');*/
                                         obj.searchDetail(id,tabla);
                                        break;
                                    
                                    
                                };
                              }
                            });
                };
            obj.showDetail(detalle,'content','hidden');
        };
     },
     //-------------------------------
     createPolyList:function(list){
        var obj = this;
        var tools = [];
        obj.identificableToCombo();
        var getItemTools = function(item,pos){
            var labels = {selection:'Procesar Selecci&oacute;n',
                          buffer:'Convertir a una &Aacute;rea de influencia',
                          edit:'Editar el elemento'
                          };
            var tools = item.tools;
            var cadena = '';
            for (var x in tools){
                cadena+='<button idref="'+item.id+'" pos="'+pos+'" alt="'+labels[tools[x]]+'" title="'+labels[tools[x]]+'" type="'+tools[x]+'" class="dinamicPanel-featureBtn dinamicPanel-sprite dinamicPanel-'+tools[x]+'"></button>'; 
            };
            return cadena;
        };
        var cadena = '';
        if (typeof(list) != 'undefined'){
           var count = 0;
           for (var x in list){
                var item = list[x];
                var tools = (!(item.tools === undefined))?getItemTools(item,count):'';
                var value = obj.convertionUnit(item.data.unit,item.data.type,item.data.measure);
                
                var closeBtn = (item.lock === undefined)?'<span pos="'+x+'" idref="'+item.id+'" class="feature-rem-button dinamicPanel-sprite dinamicPanel-close-short"></span>':'';
                var editBtn = (item.lock === undefined)?'<div class="dinamicPanel-featureEditName" idref="'+item.id+'"><span class="ui-icon ui-icon-pencil"></span></div><div class="dinamicPanel-featureOkName" idref="'+item.id+'" style="display:none"><span class="ui-icon ui-icon-check"></span></div>':'';
                var comboLayer = (!(item.crossLayer === undefined))?obj.identificableToCombo(item.id,item.crossLayer):'';

                cadena+= '<div id="'+item.id+'" pos="'+count+'" class="dinamicPanel-featureItem">';
                cadena+= '  <span class="dinamicPanel-featureIcon dinamicPanel-sprite dinamicPanel-icon-'+item.data.type+'"></span>';
                cadena+= '  <div class="dinamicPanel-editBtns">';
                cadena+= editBtn;
                //cadena+= '      <div class="dinamicPanel-featureOkName" idref="'+item.id+'" style="display:none"><span class="ui-icon ui-icon-check"></span></div>';
                cadena+= '  </div>';
                cadena+= '  <div class="dinamicPanel-featureText">';
                cadena+= '      <label class="dinamicPanel-featureName" idref="'+item.id+'">'+item.data.name+'</label>';
                cadena+= '      <input type="text" id="inputText_'+item.id+'" value="'+item.data.name+'" idref="'+item.id+'" class="dinamicPanel-featureInputName" style="display:none">';
                cadena+= '      <label class="dinamicPanel-featureInfo">'+value+'</label>';
                cadena+= '  </div>';
                cadena+= closeBtn;
                cadena+= '  <div class="dinamicPanel-featureTools">'+tools+'</div>';
                cadena+= comboLayer;
                cadena+= '</div>';
                count++;
           };
        };
       return cadena; 
     },
     //--------------------------------------
     geoControl:function(opc,data){
        var obj = this;
        var clock = null;
        var list = obj.geo;   //listado mediciones
        var map = obj.options.map; //objeto map externo
        //control de interface
        var removeItem = function(pos,item){
            if(item.data.type=='point'){
                        map.Mark.event({action:'delete',items:[{id:item.id}],type:item.type});
            }else{
                        map.Feature.event({action:'delete',id:item.id});
            };
            list.splice(pos,1);
            map.activeCtl({control:'georeference',active:false});
            var status = 'enable';
            if(list.length==0){
                status = 'disable';  
            };
            $("#"+obj.id+'_geo_btnExport').button(status);
            enableBufferPoints();
            //$("#"+obj.id+'_geo_btnCreateBuffers').button(status);
        };
        var showGeoList = function(){
          /*
          if(clock){clearTimeout(clock);}
          var evento = showGeoList;
          clock = setTimeout(function(){
          */ 
          
                
            $('#'+obj.id+'_geo_result').html(obj.createGeoList(list));
            
            $('.dinamicPanel-geoEditName').each(function(){
                $(this).click(function(){
                   var idref = $(this).attr('idref');
                   $(this).css('display','none');
                   $('.dinamicPanel-geoOkName[idref="'+idref+'"]').css('display','').click(function(){
                        var idRef = $(this).attr('idref');
                        var item = getGeo(idRef);
                        item.data.name = $('#inputText_'+idRef).val();
                        editGeo(item);
                    });
                   $('.dinamicPanel-geoName[idref="'+idref+'"]').css('display','none');
                   $('#inputText_'+idref).css('display','').focus();
                   obj.setInputTextRestriction('inputText_'+idref,function(ban){
                        if (ban){$('.dinamicPanel-geoOkName[idref="'+idref+'"]').css('display','');}
                        else{$('.dinamicPanel-geoOkName[idref="'+idref+'"]').css('display','none');};
                    },function(){
                        if ($('#inputText_'+idref).val() != '')$('.dinamicPanel-geoOkName[idref="'+idref+'"]').click();
                    });
                });
            });
            $('.dinamicPanel-geoEditDesc').each(function(){
                $(this).click(function(){
                   var idref = $(this).attr('idref');
                   $(this).css('display','none');
                   $('.dinamicPanel-geoOkDesc[idref="'+idref+'"]').css('display','').click(function(){
                        var idRef = $(this).attr('idref');
                        var item = getGeo(idRef);
                        item.data.description = $('#inputText_'+idRef+'_description').val();
                        item.data.desc = item.data.description;
                        editGeo(item);
                    });
                   $('.dinamicPanel-geoInfo[idref="'+idref+'"]').css('display','none');
                   $('#inputText_'+idref+'_description').css('display','').focus();
                   obj.setInputTextRestriction('inputText_'+idref+'_description',function(ban){
                        if (ban){$('.dinamicPanel-geoOkDesc[idref="'+idref+'"]').css('display','');}
                        else{$('.dinamicPanel-geoOkDesc[idref="'+idref+'"]').css('display','none');};
                    },function(){
                        if ($('#inputText_'+idref+'_description').val() != '')$('.dinamicPanel-geoOkDesc[idref="'+idref+'"]').click();
                    });
                });
            });
            $('.dinamicPanel-geoItem').each(function(){
                  $(this).click(function(e){
                    var id =  $(this).attr('id');
                    var pos = parseInt($(this).attr('pos'),10);
                    var item = getGeo(id);
                    map.Mark.event({action:'unselect',items:'all',type:item.type});
                    if(item.data.type=='point'){
                        map.Mark.event({action:'select',items:[{id:item.id}],type:item.type});
                    }else{
                        map.Feature.event({select:true,id:id});
                    };
                    
                    //obj.createPanel('measure',item);
                    e.stopPropagation();  
                  })
                  .dblclick(function(){
                        var id =  $(this).attr('id');
                        var item = getGeo(id);
                        if(item.data.type=='point'){
                            map.Mark.event({action:'locate',id:id});
                        }else{
                            map.Feature.event({select:false,action:'locate',id:id});
                        };
                   });
            });
            $('.dinamicPanel-panelResult .dinamicPanel-geobuffer').each(function(){
                  $(this).click(function(e){
                    var id =  $(this).attr('idref');
                    var pos = parseInt($(this).attr('pos'),10);
                    var item = getGeo(id);
                    //map.Feature.addBuffer(item.id);
                    map.Feature.addBufferGeoreference(item);
                    e.stopPropagation();  
                  }); 
            });
            $('.geo-rem-button').each(function(){
                  $(this).click(function(e){
                    var id =  $(this).attr('idref');
                    var pos = parseInt($(this).attr('pos'),10);
                    var item = getGeo(id);
                    
                    if (id == $('#'+obj.id+'_geoPanel').attr('idref')){
                        $('#'+obj.id+'_geoPanel').attr('idref','');
                        obj.createPanel('geo');
                    };
                    removeItem(pos,item);
                    obj.geoControl('showGeoList');
                    e.stopPropagation();  
                  });
            });
            
            $('.dinamicPanel-geoPupup').each(function(){
                      
               $(this).click(function(){
                    var id = $(this).attr('idref');
                    var item = getGeo(id);
                    map.showDataImporter(item.data.name,item.data.description);
               });
            });
            
          //},5000);
        };
        var enableBufferPoints = function(){
            var status = 'disable';
            for(x in list){
                if(list[x].data.type=='point'){
                    status='enable';
                    break;
                };
            };
            $("#"+obj.id+'_geo_btnCreateBuffers').button(status);
        };
        var clickNew = function(){
            $('#'+obj.id+'_geoPanel').attr('idref','');
            $('#'+obj.id+'_geo_btnEndAction').css('display','');
            $('#'+obj.id+'geo_btnFinish').css('display','');
            $('#'+obj.id+'_geo_line').attr('checked',true);
            $('#'+obj.id+'_geo_typeSet').buttonset('refresh').css('display','');
            setTimeout(function(){
                $('#'+obj.id+'_geo_typeSet :radio:checked').click();
            },100);
        };
        var clickEnd = function(){
            $('#'+obj.id+'_geo_btnEndAction').css('display','none');
            $('#'+obj.id+'_geo_btnFinish').css('display','none');
            
            $('#'+obj.id+'_geo_typeSet').css('display','');
            obj.createPanel('geo');
            obj.geoControl('none');
        };
        var editGeo = function(item){
                        if(item.data.type=='point'){
                            var datos = {nom:item.data.name,desc:item.data.description};
                            var params = {action:'set',items:[{id:item.id}],type:item.type,params:datos};
                            map.Mark.event(params);
                        }else{
                            var params = {action:'set',id:item.id,params:item};
                            map.Feature.event(params);
                        };
                        obj.geoControl('showGeoList');
                        obj.createPanel('geo');
        };
        var getGeo = function(id){
            var result = null;
            for (var x in list){
                var item = list[x];
                if (item.id == id){
                    result = item;
                    break;
                };
            };
            return result;
        };
        var events = function(){
            type = $('#'+obj.id+'_geo_typeSet :radio:checked').attr('value');
            map.activeCtl({control:type,active:true});
            map.event.setEventGeoAdded(function(data,multiple){saveGeo(data,multiple);});
        };
        //manejo de las georeferencias
        var newGeo = function(){
            $('#'+obj.id+'_geo_btnEndAction').css('display','');
            $('#'+obj.id+'_geo_btnFinish').css('display','');
            $('#'+obj.id+'_geo_typeSet').css('display','none');
            obj.geoControl('declareEvents');
        };
        var saveGeo = function(data,multiple){
          var ref;
          if(multiple){
               ref=data[data.length-1];
          }else{
               ref=data;
          }
          if (!(data === undefined) && ref.type == 'georeference'){
                var ban = false;
                
                //data.data.unit = $('#'+obj.id+'_geo_unitSet :radio:checked').attr('value');
                ref.data.unit = $('#'+obj.id+'_geo_unitSet :radio:checked').attr('value');
                //data.tools = ['geobuffer'];
                if(typeof multiple==='undefined'){
                    data.tools = ['geobuffer'];
                    for (var x in list){
                        var item = list[x];
                        if (item.id == data.id){
                            ban = true;
                            item = data;
                            break;
                        };
                    };
                    if (!ban){
                        list.push(data);
                    };
                }else{
                    for(var x in data){
                         data.tools = ['geobuffer'];
                         list.push(data[x]);
                    }
                }
                
               showGeoList();
               $('#'+obj.id+'_geoPanel').attr('idref',ref.id);
                obj.createPanel('geo');
                obj.curr_geo = ref;
                obj.temporalView();
                
                obj.blinkElement(ref.id);
                map.Feature.event({select:true,id:ref.id});
                
                //sobre escribe con unidad de medida seleccionada
                var params = {action:'set',id:ref.id,params:ref};
                map.Feature.event(params);
                
                $("#"+obj.id+'_geo_btnExport').button('enable');
                enableBufferPoints();
                //$("#"+obj.id+'_geo_btnCreateBuffers').button('enable');
                
            };
            
        };
        var bufferPoits = function(){
            map.Mark.addBufferAll();
        };
        //atrapa evento solicitado
        if (map != null){
            if (opc == 'none'){
                obj.options.map.activeCtl({control:'none',active:true});
            }else{
                switch (opc){
                    case 'showGeoList':
                         showGeoList();
                        break;
                    case 'editGeo':
                        editGeo(data);
                        break;
                    case 'startNew':
                            clickNew();
                            newGeo();
                        break;
                    case 'endCreation':
                            clickEnd();
                        break;
                    case 'addNew':
                            newGeo();
                        break;
                    case 'declareEvents':
                            events();
                        break;
                    case 'appyBuffersForAllPoints':
                        bufferPoits();
                        break;
                    case 'enableBufferPoints':
                        enableBufferPoints();
                        break;
                };    
            };
        };
     },
    getAbstract:function(data){
            var text = (data.text==undefined)?'Sin descripci&oacute;n':data.text;
            if(text.length>data.max){
                text = text.substring(0,data.max);
                text+=data.sufix;
            };
            return text;
    },
     hasHtml:function(text){
          var response = false;
          if (text.match(/<(\w+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/)) {
             response=true;
          }
          return response;
     },
     createGeoList:function(list){
        var obj = this;
        var tools = [];
        var getItemTools = function(item,pos){
            var labels = {geobuffer:'Generar &aacute;rea de influencia',
                          edit:'Editar el elemento'
                          };
            var tools = item.tools;
            var cadena = '';
            for (var x in tools){
                cadena+='<button idref="'+item.id+'" pos="'+pos+'" alt="'+labels[tools[x]]+'" title="'+labels[tools[x]]+'" type="'+tools[x]+'" class="dinamicPanel-geoBtn dinamicPanel-sprite dinamicPanel-'+tools[x]+'"></button>'; 
            };
            return cadena;
        };
        var cadena = '';
        if (typeof(list) != 'undefined'){
           var count = 0;
           for (var x in list){
                var item = list[x];
                var hasHTML = obj.hasHtml(((item.data.description)?item.data.description:''));
                var tools = (!(item.tools === undefined))?getItemTools(item,count):'';
                var value = (item.data.desc)?item.data.desc:item.data.description; //obj.convertionUnit(item.data.unit,item.data.type,item.data.measure);
                var temValue = obj.getAbstract({text:value,max:35,sufix:'...'});
                var valueTitle = (item.name)?item.data.nom:item.data.name; //obj.convertionUnit(item.data.unit,item.data.type,item.data.measure);
                var temValueTitle = obj.getAbstract({text:valueTitle,max:35,sufix:'...'});
                var classHide='';
                cadena+= '<div id="'+item.id+'" pos="'+count+'" class="dinamicPanel-geoItem">';
                cadena+= '  <span class="dinamicPanel-geoIcon dinamicPanel-sprite dinamicPanel-icon-'+item.data.type+'"></span>';
                if(hasHTML){
                    cadena+= '  <span idref="'+item.id+'" class="dinamicPanel-geoPupup dinamicPanel-sprite dinamicPanel-info-short" style="float:left"></span>';
                    classHide='hidden';
                    temValue='';
                    value='';
                }
                cadena+= '  <div class="dinamicPanel-editBtns '+classHide+'">';
                cadena+= '      <div class="dinamicPanel-geoEditName" idref="'+item.id+'"><span class="ui-icon ui-icon-pencil"></span></div>';
                cadena+= '      <div class="dinamicPanel-geoOkName" idref="'+item.id+'" style="display:none"><span class="ui-icon ui-icon-check"></span></div>';
                cadena+= '      <div class="dinamicPanel-geoEditDesc" idref="'+item.id+'"><span class="ui-icon ui-icon-pencil"></span></div>';
                cadena+= '      <div class="dinamicPanel-geoOkDesc" idref="'+item.id+'" style="display:none"><span class="ui-icon ui-icon-check"></span></div>';
                cadena+= '  </div>';
                cadena+= '  <div class="dinamicPanel-geoText">';
                cadena+= '      <label class="dinamicPanel-geoName" title="'+((hasHTML)?valueTitle:'')+'" idref="'+item.id+'">'+((hasHTML)?temValueTitle:item.data.name)+'</label>';
                cadena+= '      <input type="text" id="inputText_'+item.id+'" value="'+item.data.name+'" idref="'+item.id+'" class="dinamicPanel-geoInputName" style="display:none">';
                cadena+= '      <label class="dinamicPanel-geoInfo '+classHide+'" idref="'+item.id+'" alt="'+value+'" title="'+value+'">'+temValue+'</label>';
                cadena+= '      <input type="text" id="inputText_'+item.id+'_description" value="'+((hasHTML)?'':item.data.description)+'" idref="'+item.id+'" class="dinamicPanel-geoInputDesc" style="display:none">';
                cadena+= '  </div>';
                cadena+= '  <span pos="'+x+'" idref="'+item.id+'" class="geo-rem-button dinamicPanel-sprite dinamicPanel-close-short"></span>';
                cadena+= '  <div class="dinamicPanel-geoTools">'+tools+'</div>';
                cadena+= '</div>';
                count++;
           };
        };
       return cadena; 
     },
     //--------------------------------------
     pointControl:function(opc,data){
        var obj = this;
        var list = obj.points;   //listado puntos
        var map = obj.options.map; //objeto map externo
        //control de interface
        var removeItem = function(pos,id){
            map.Poi.event({action:'delete',poi:id});
            list.splice(pos,1);
            map.activeCtl({control:'poi',active:false});
            if(list.length==0){
                $("#"+obj.id+'_point_btnCreateBuffers').button("disable");
                $("#"+obj.id+'_point_btnExport').button("disable");
            };
        };
        var showList = function(){
            $('#'+obj.id+'_point_result').html(obj.createPointList(list));//obj.createPolyList(list)
            $('.dinamicPanel-pointEditName').each(function(){
                $(this).click(function(){
                   var idref = $(this).attr('idref');
                   $(this).css('display','none');
                   $('.dinamicPanel-pointOkName[idref="'+idref+'"]').css('display','').click(function(){
                        var idRef = $(this).attr('idref');
                        var item = getPoint(idRef);
                        item.data.name = $('#inputText_'+idRef).val();
                        editPoint(item);
                    });
                   $('.dinamicPanel-pointName[idref="'+idref+'"]').css('display','none');
                   $('#inputText_'+idref).css('display','').focus();
                   obj.setInputTextRestriction('inputText_'+idref,function(ban){
                        if (ban){$('.dinamicPanel-pointOkName[idref="'+idref+'"]').css('display','');}
                        else{$('.dinamicPanel-pointOkName[idref="'+idref+'"]').css('display','none');};
                    },function(){
                        if ($('#inputText_'+idref).val() != '')$('.dinamicPanel-pointOkName[idref="'+idref+'"]').click();
                    });
                });
            });
            $('.dinamicPanel-pointItem').each(function(){
                  $(this).click(function(e){
                    var id =  $(this).attr('id');
                    var pos = parseInt($(this).attr('pos'),10);
                    var item = getPoint(id);
                    map.Poi.event({action:'ubicate',poi:id});
                    e.stopPropagation();  
                  });
            });
            $('.dinamicPanel-panelResult .dinamicPanel-buffer').each(function(){
                  $(this).click(function(e){
                    var id =  $(this).attr('idref');
                    var pos = parseInt($(this).attr('pos'),10);
                    var item = getPoint(id);
                    map.Poi.event({action:'addBuffer',poi:id});
                    e.stopPropagation();
                  });
            });
            $('.point-rem-button').each(function(){
                  $(this).click(function(e){
                    var id =  $(this).attr('idref');
                    var pos = parseInt($(this).attr('pos'),10);
                    var item = getPoint(id);
                    if (id == $('#'+obj.id+'_pointPanel').attr('idref')){
                        $('#'+obj.id+'_pointPanel').attr('idref','');
                        obj.createPanel('point');
                    };
                    removeItem(pos,id);
                    obj.pointControl('showList');
                    e.stopPropagation();
                  });
            });
        };
        var clickNew = function(){
            $('#'+obj.id+'_pointPanel').attr('idref','');
            $("#"+obj.id+'_point_btnEndAction').css('display','');
            $("#"+obj.id+'_point_btnStartAction').css('display','none');
        };
        var clickEnd = function(){
            $("#"+obj.id+'_point_btnStartAction').css('display','');
            $("#"+obj.id+'_point_btnEndAction').css('display','none');
            obj.createPanel('point');
            obj.pointControl('none');
        };
        var editPoint = function(item){
                        var params = {action:'set',poi:item.id,params:item};
                        map.Poi.event(params);
                        obj.pointControl('showList');
                        obj.createPanel('point');
        };
        var getPoint = function(id){
            var result = null;
            for (var x in list){
                var item = list[x];
                if (item.id == id){
                    result = item;
                    break;
                };
            };
            return result;
        };
        //manejo de los poligonos
        var newPoint = function(){
            map.activeCtl({control:'poi',active:true});
            map.event.setEventPoiAdded(function(data){
                savePoint(data);
                $("#"+obj.id+'_point_btnCreateBuffers').button("enable");
                $("#"+obj.id+'_point_btnExport').button("enable");
            });
            map.event.setEventPoiCanceled(function(){
                clickEnd();
            });
        };
        var savePoint = function(data){
            //if (!(data === undefined) && data.type == 'measure'){
                var ban = false;
                data.tools = ['buffer'];
                for (var x in list){
                    var item = list[x];
                    if (item.id == data.id){
                        ban = true;
                        item = data;
                        break;
                    };
                };
                if (!ban){
                    list.push(data);
                };
                showList();
                
                $('#'+obj.id+'_pointPanel').attr('idref',data.id);
                obj.createPanel('point');
                obj.curr_point = data;
                obj.temporalView();
                obj.blinkElement(data.id);
            //}
        };
        var applyBuffers = function(){
            map.Poi.generateBuffers();
        };
        var addBuffer = function(){
            
        };
        //atrapa evento solicitado
        if (map != null){
            if (opc == 'none'){
                obj.options.map.activeCtl({control:'none',active:true});
            }else{
                switch (opc){
                    case 'showList':
                         showList();
                        break;
                    case 'editPoint':
                        editPoint(data);
                        break;
                    case 'startNew':
                            clickNew();
                            newPoint();
                        break;
                    case 'endCreation':
                            clickEnd();
                        break;
                    case 'addNew':
                            newPoint();
                        break;
                    case 'appyBuffersForAll':
                            applyBuffers();
                        break;
                    case 'addBuffer':
                            addBuffer();
                        break;
                        
                };    
            };
        };
     },
     createPointList:function(list){
        var obj = this;
        var tools = [];
        var getItemTools = function(item,pos){
            var labels = {buffer:'Asignar una &Aacute;rea de influencia',
                          edit:'Editar el elemento'
                          };
            var tools = item.tools;
            var cadena = '';
            for (var x in tools){
                cadena+='<button idref="'+item.id+'" pos="'+pos+'" alt="'+labels[tools[x]]+'" title="'+labels[tools[x]]+'" type="'+tools[x]+'" class="dinamicPanel-pointBtn dinamicPanel-sprite dinamicPanel-'+tools[x]+'"></button>'; 
            };
            return cadena;
        };
        var cadena = '';
        if (typeof(list) != 'undefined'){
           var count = 0;
           for (var x in list){
                var item = list[x];
                var tools = (!(item.tools === undefined))?getItemTools(item,count):'';
                var value = item.data.date;
                
                cadena+= '<div id="'+item.id+'" pos="'+count+'" class="dinamicPanel-pointItem">';
                cadena+= '  <span class="dinamicPanel-pointIcon dinamicPanel-sprite dinamicPanel-icon-'+item.data.type+'"></span>';
                cadena+= '  <div class="dinamicPanel-editBtns">';
                cadena+= '      <div class="dinamicPanel-pointEditName" idref="'+item.id+'"><span class="ui-icon ui-icon-pencil"></span></div>';
                cadena+= '      <div class="dinamicPanel-pointOkName" idref="'+item.id+'" style="display:none"><span class="ui-icon ui-icon-check"></span></div>';
                cadena+= '  </div>';
                cadena+= '  <div class="dinamicPanel-pointText">';
                cadena+= '      <label class="dinamicPanel-pointName" idref="'+item.id+'">'+item.data.name+'</label>';
                cadena+= '      <input type="text" id="inputText_'+item.id+'" value="'+item.data.name+'" idref="'+item.id+'" class="dinamicPanel-pointInputName" style="display:none">';
                cadena+= '      <label class="dinamicPanel-pointInfo">'+value+'</label>';
                cadena+= '  </div>';
                cadena+= '  <span pos="'+x+'" idref="'+item.id+'" class="point-rem-button dinamicPanel-sprite dinamicPanel-close-short"></span>';
                cadena+= '  <div class="dinamicPanel-pointTools">'+tools+'</div>';
                cadena+= '</div>';
                count++;
           };
        };
       return cadena; 
     },
     //--------------------------------------
     createRouteUI:function(){
        var obj = this;
        var route = obj.route;
        var list = route.list;
        
        //inner functions
        var insertItem = function(pos,item){
            list.splice(pos,0,item);
        };
        var removeItem = function(pos){
            list.splice(pos,1);
        };
        var division= function(id){
                var cadena = '';
                if (!(id=== undefined))
                    cadena = '<div class="route-separation"><div class="route-line-separation"></div><span pos="'+id+'" class="route-add-button dinamicPanel-sprite dinamicPanel-add-short"></span></div>';
                else
                    cadena = '<div class="route-separation"><div class="route-line-separation"></div></div>';
                return cadena;
        };
        
            var start = '<div class="route-item"><label id="route_start_label" class="route-item-label '+((route.a != null)?'':'route-gray-text')+'">A</label><div id="route_start"></div></div>';
            var end   = '<div class="route-item"><label id="route_end_label" class="route-item-label '+((route.b != null)?'':'route-gray-text')+'">B</label><div id="route_end"></div></div>';
        
        var cadena = '';
            cadena+= (route.a != null && route.b != null)?division(0):'';
            var count = 1;
            for (var x in list){
                cadena+= '<div class="route-item" pos="'+x+'">';
                cadena+= '  <label id="route_label_'+x+'" class="route-item-label '+((list[x] != null)?'':'route-gray-text')+'">'+(count)+'</label>';
                cadena+= '  <div id="route_location_'+x+'" class="route-location" pos="'+x+'"></div>';
                cadena+= '  <span pos="'+x+'" class="route-rem-button dinamicPanel-sprite dinamicPanel-close-short"></span>';
                cadena+= '</div>';
                cadena+= (list[x] != null)?division(count):division();
                count++;
            };
            
        cadena= start+cadena+end;
        
        $('#'+obj.id+'_route_result').html(cadena);
        
        $('#route_start').customAutocomplete({
            itemValue:route.a,
            urlService:'http://10.28.19.73:8081/solr/ruteo/select',
            jsonCallbackName:'json.wrf',
            labelField:'busqueda',
            idField:'gid',
            jsonDataSource:'response.docs',
            onSelect:function(item){
              $('#route_start_label').removeClass('route-gray-text');
              route.a = item;
              obj.createRouteUI();
            }
        });
        $('#route_end').customAutocomplete({
            itemValue:route.b,
            urlService:'http://10.28.19.73:8081/solr/ruteo/select',
            jsonCallbackName:'json.wrf',
            labelField:'busqueda',
            idField:'gid',
            jsonDataSource:'response.docs',
            onSelect:function(item){
              $('#route_end_label').removeClass('route-gray-text');
              route.b = item;
              obj.createRouteUI();
            }
        });
        
        //Events jquery
        $('.route-location').each(function(){
                var pos = parseInt($(this).attr('pos'),10);
                $(this).customAutocomplete({
                    itemValue:list[pos],
                    urlService:'http://10.28.19.73:8081/solr/ruteo/select',
                    jsonCallbackName:'json.wrf',
                    labelField:'busqueda',
                    idField:'gid',
                    jsonDataSource:'response.docs',
                    onSelect:function(item){
                      $('#route_label_'+pos).removeClass('route-gray-text');
                      list[pos] = item;
                      obj.createRouteUI();
                    }
            });
        });
        $('.route-add-button').each(function(){
            $(this).click(function(e){
                var pos = parseInt($(this).attr('pos'),10);
                insertItem(pos);
                obj.createRouteUI();
                e.stopPropagation();
            });
        });
        $('.route-rem-button').each(function(){
            $(this).click(function(e){
                var pos = parseInt($(this).attr('pos'),10);
                removeItem(pos);
                obj.createRouteUI();
                e.stopPropagation();
            });
        });
        
        
     },
     createTabs:function(){
        var obj = this;
        var cadena = '';
        var width = Math.floor(100/obj.panels.length)-1;
        for (var x in obj.panels){
            var item = obj.panels[x];
            cadena+= '<div style="width:'+width+'%" id="'+obj.id+'_'+item.id+'_tab" idref="'+item.id+'" alt="'+item.desc+'" title="'+item.desc+'" class="dinamicPanel-tab"><div class="dinamicPanel-tabIconContainer"><center><span class="dinamicPanel-tabIcon '+item.icon+'"></span></center></div><span class="dinamicPanel-tabDescription">'+item.label+'</span><span class="dinamicPanel-selector dinamicPanel-hidde"></span></div>';
        };
        return cadena;
     },
     createResultPanels:function(){
        var obj = this;
        var cadena = '';
        for (var x in obj.panels){
            var item = obj.panels[x];
            cadena+= '<div id="'+obj.id+'_'+item.type+'_result" style="display:none" class="dinamicPanel-panelResult"></div>';
        };
        return cadena;
     },
     createPanels:function(){
        var obj = this;
        var cadena = '';
        for (var x in obj.panels){
            var item = obj.panels[x];
            cadena+= '<div id="'+obj.id+'_'+item.id+'" style="display:none" class="dinamicPanel-panel"></div>';
        };
        return cadena;
     },
     openToolPanel:function(size){
        var obj = this;
        //reset Map control
        var height = (size === undefined)?135:size;
        $('#'+obj.id+'_toolSet').animate({'height':height+'px'});
     },
     isToolPanelFill:function(){
       return ($('#'+this.id+'_'+this.currentTool+'Panel').html() != '');
     },
     isToolPanelOpen:function(){
        return ($('#'+this.id+'_toolSet').height() > 55);
     },
     closeToolPanel:function(){
        var obj = this;
        $('#'+obj.id+'_toolSet').animate({'height':'55px'});
        obj.showPanel();
     },
     switchToolPanel:function(){
        var obj = this;
        var open = ($('#'+obj.id+'_toolSet').height() > 55);
        if (open){obj.closeToolPanel();}else{obj.openToolPanel();}
     },
     getPanel:function(id){
        var obj = this;
        var panels = obj.panels;
        var item = null;
        for (var x in panels){
            if (panels[x].id == id){
                item = panels[x];
                break;
            };
        };
        return item;
     },
     //-----------------------------------------------------------------
     //Results Manage --------------------------------------------------
     //-----------------------------------------------------------------
     processCategoryData:function(data,extra){
       var obj = this;
       var cadena = '';
       var searchText = data.searchText;
       if (!(data.response === undefined) && data.response.numFound > 0){
            searchText = data.searchText;
            var list = data.facet_counts.facet_fields.descripcion;
            for (var x = 0; x < list.length; x++){
                var value = list[x+1];
                if (value > 0){
                    cadena+= '<div class="dinamicPanel-box-sizing dinamicPanel-categoryItem" searchtext="'+searchText+'" name="'+list[x]+'">'+list[x]+'</div>';
                };
                x++;
            };
            cadena=(cadena != '')?'<div class="dinamicPanel-categoryItem-container"><div class="dinamicPanel-box-sizing dinamicPanel-categoryItem-title">Otros resultados</div><div class="dinamicPanel-categoryItem-list dinamicPanel-box-sizing">'+cadena+'</div></div>':'';
       };
       var cadena2 = '';
       if (!(extra === undefined) && extra.length > 0){
            var list = extra;
            for (var x = 0; x < list.length; x++){
                var value = list[x+1];
                if (value > 0){
                    cadena2+= '<div class="dinamicPanel-box-sizing dinamicPanel-categoryItem-left" searchtext="'+searchText+'" name="'+list[x]+'">'+list[x]+'</div>';
                };
                x++;
            };
            cadena2=(cadena2 != '')?'<div class="dinamicPanel-categoryItem-container-left"><div class="dinamicPanel-box-sizing dinamicPanel-categoryItem-title">Otros resultados</div><div class="dinamicPanel-categoryItem-list dinamicPanel-box-sizing">'+cadena2+'</div></div>':'';
       };
       
       $('#'+obj.id+'_searchPanel').html(cadena2+cadena);
       
       $('.dinamicPanel-categoryItem').each(function(){
            $(this).click(function(e){
                var name = $(this).attr('name');
                var text = $(this).attr('searchtext');
                obj.searchCategoryResult(name,text);
                e.stopPropagation();    
            });
        });
        $('.dinamicPanel-categoryItem-left').each(function(){
            $(this).click(function(e){
                var name = $(this).attr('name');
                var text = $(this).attr('searchtext');
                obj.searchCategoryResultDeep(text,name);
                e.stopPropagation();    
            });
        });
       
       
       obj.showPanel('searchPanel');
     },
     stringAsType:function(text){
                    text = text.toLowerCase();
                    text = text.replace(/[\u00E1]/gi,'a');
                    text = text.replace(/[\u00E9]/gi,'e');
                    text = text.replace(/[\u00ED]/gi,'i');
                    text = text.replace(/[\u00F3]/gi,'o');
                    text = text.replace(/[\u00FA]/gi,'u');
                    text = text.replace(/[\u00F1]/gi,'n');
                    
                    text = text.replace(/&aacute;/g, 'a');
                    text = text.replace(/&eacute;/g, 'e');
                    text = text.replace(/&iacute;/g, 'i');
                    text = text.replace(/&oacute;/g, 'o');
                    text = text.replace(/&uacute;/g, 'u');
                    text = text.replace(/&ntilde;/g, 'n');
                    
                    text = text.replace(/,/g, '');
                    
                    text = text.replace(/\s/g, '');
                    return text;
     },
     searchCategoryResultDeep:function(text,search,type){
        var obj = this;
        var listSource = obj.options.dataSource.deepSearch;
            var dataSource = listSource;
            var params = { //Params----------------------
                'hl':true,
                'hl.fl':dataSource.field,
                'hl.simple.post':'</strong>',
                'hl.simple.pre':'<strong>',
                'facet':'true',
                'facet.field':'tipo',
                'fq':'tipo:"'+search+'"',
                'q':text,
                'rows':10,
                'wt':'json'
            };
            if (type === undefined){
                var location = obj.getMapCenter();
                var distance = location.distance;
                location = location.centroid.lat+', '+location.centroid.lon;
                params.indent=true;
                params.fq=['{!bbox}','tipo:"'+search+'"'];
                params.sfield='locacion';
                params.pt=location;
                params.d=(distance/1000); //a metros
            };
            jQuery.ajaxSettings.traditional = true;
            obj.getData(dataSource,params, 
            function(data){ //success
                var object = {};
                if (!(data === undefined)){
                    if (data.response.numFound == 0){
                        obj.searchCategoryResultDeep(text,search,'nacional');
                    }else{
                        object.total = data.response.numFound;
                        var listA = data.response.docs;
                        object.list = [];
                        for (var x in listA){
                            var item = listA[x];
                            var busqueda = item.busqueda.split(',');
                            item.nombre = busqueda[busqueda.length-1];
                            label = busqueda.join();
                            item.label = label;
                            
                            
                            //var label = (!(item.edo === undefined))?item.edo:'';
                            //label = (!(item.mun === undefined))?
                            //            (label != '')?label+','+item.mun:item.mun
                            //            :label;
                            //label = (!(item.nombre === undefined))?
                            //            (label != '')?label+','+item.nombre:item.nombre
                            //            :label;
                            //
                            
                            item.label = label; //extrae etiqueta marcada
                            item.id = item.gid; delete item['gid']; //renombra gid por id
                            item.name = item.nombre;
                            item.type = obj.stringAsType(item.tipo);
                            item.position = {geo:item.locacion, merc:item.coord_merc}; delete item['locacion'];delete item['coord_merc']; //reubica locacion y coord_merc
                            object.list.push(item);
                        };
                    };
                };
                obj.processData(object);
            },
            function(){
                obj.processCategoryData();    
            }, //error
            function(){
                $('#'+obj.id+'_spinner').addClass('ajax-loader');
                }, //before
            function(){
                $('#'+obj.id+'_spinner').removeClass('ajax-loader');
                }  //complete
            );    

     },
     searchCategoryResult:function(text,search,type){
        var obj = this;
        var listSource = obj.options.dataSource.category;
        //for (var x in listSource){
            var dataSource = listSource;
            
            var params = { //Params----------------------
                hl:true,
                'hl.fl':dataSource.field,
                'hl.simple.post':'</strong>',
                'hl.simple.pre':'<strong>',
                'facet':'true',
                'facet.field':dataSource.facetField,
                'fq':dataSource.facetField+':"'+text+'"',
                q:'busqueda:"'+search+'"',
                rows:10,
                wt:'json'
             };
            
            if (type === undefined){
                var location = obj.getMapCenter();
                var distance = location.distance;
                location = location.centroid.lat+', '+location.centroid.lon;
                params.indent=true;
                params.fq='{!bbox}';
                params.sfield='locacion';
                params.pt=location;
                params.d=(distance/1000); //a metros
             };
            
            obj.getData(dataSource,params, 
            function(data){ //success
                var object = {};
                if (!(data === undefined)){
                    if (data.response.numFound == 0){
                        obj.searchCategoryResult(text,search,'nacional');
                    }else{
                        object.total = data.response.numFound;
                        var listA = data.response.docs;
                        object.list = [];
                        for (var x in listA){
                             var item = listA[x];
                            var label = '';
                            var busqueda = item.busqueda.split(',');
                            item.nombre = busqueda[busqueda.length-1];
                            label = busqueda.join();
                            item.label = label;
                            
                            
                            //var label = (!(item.edo === undefined))?item.edo:'';
                            //label = (!(item.mun === undefined))?
                            //            (label != '')?label+','+item.mun:item.mun
                            //            :label;
                            //label = (!(item.nombre === undefined))?
                            //            (label != '')?label+','+item.nombre:item.nombre
                            //            :label;
                            //
                            
                            item.label = label; //extrae etiqueta marcada
                            item.id = item.gid; delete item['gid']; //renombra gid por id
                            item.name = item.nombre;
                            item.type = obj.stringAsType(item.tipo);
                            item.position = {geo:item.locacion, merc:item.coord_merc}; delete item['locacion'];delete item['coord_merc']; //reubica locacion y coord_merc
                            object.list.push(item);
                            
                            
                            //var item = listA[x];
                            //item.label = item[dataSource.field]; //extrae etiqueta marcada
                            //item.id = item.gid; delete item['gid']; //renombra gid por id
                            //item.name = item[dataSource.field];
                            //item.type = obj.stringAsType(item[dataSource.facetField]);
                            //item.position = {geo:item.locacion/*, merc:item.coord_merc*/}; delete item['locacion'];/*delete item['coord_merc'];*/ //reubica locacion y coord_merc
                            //object.list.push(item);
                        };
                        obj.processData(object);
                    };
                };
            },
            function(){
                obj.processCategoryData();    
            }, //error
            function(){
                $('#'+obj.id+'_spinner').addClass('ajax-loader');
                }, //before
            function(){
                $('#'+obj.id+'_spinner').removeClass('ajax-loader');
                }  //complete
            );    
        //};
     },
     searchInCategory:function(data){  //busqueda de categorias para elemento seleccionado
           var obj = this;
		   var cadena = '';
		   var searchText = data.data.text;
		   var list = data.data.types
		   var service = data.service;
		   
			var cadena2 = '';
			var count = 0;
			for (var x  in list){
				var value = list[x];
				if (value){
					var service = value.split('|')[0];
					value = value.split('|')[1];
					var showCount = (service == 'entidades')?'<span>'+value+'</span>':'';
					cadena2+= '<div class="dinamicPanel-box-sizing dinamicPanel-categoryItem-left" service="'+service+'" searchtext="'+searchText+'" name="'+value+'">'+showCount+'<label>'+value+'</label></div>';
					count++;
				};
				x++;
			};
			cadena2='<div class="dinamicPanel-categoryItem-container-left"><div class="dinamicPanel-box-sizing dinamicPanel-categoryItem-title">Otros resultados</div><div class="dinamicPanel-categoryItem-list dinamicPanel-box-sizing">'+cadena2+'</div></div>';
		   
		   if(count > 0){
			   $('#'+obj.id+'_searchPanel').html(cadena2);
			   
				$('.dinamicPanel-categoryItem-left').each(function(){
					$(this).click(function(e){
						var name = $(this).attr('name');
						var text = $(this).attr('searchtext');
						var service = $(this).attr('service');
						obj.initSearch(text,'search','deep',service);
						e.stopPropagation();  
					});
					
				});
			   obj.showPanel('searchPanel');
		   }else{
			  obj.closeToolPanel();   
		   }
		/*var obj = this;
        var listSource = obj.options.dataSource.category;
        
        //for (var x in listSource){
            var dataSource = listSource;//listSource[x];
            obj.getData(dataSource,
            { //Params----------------------
                hl:true,
                'hl.fl':dataSource.field,
                'hl.simple.post':'</strong>',
                'hl.simple.pre':'<strong>',
                'facet':'true',
                'facet.field':dataSource.facetField,
                q:'busqueda:"'+text+'"',
                rows:10,
                wt:'json'
             }, 
            function(data){ //success
                data.searchText = text;
                data.field = dataSource.field;
                obj.processCategoryData(data,extra);
            },
            function(){
                obj.processCategoryData();    
            }, //error
            function(){
                $('#'+obj.id+'_spinner').addClass('ajax-loader');
                }, //before
            function(){
                $('#'+obj.id+'_spinner').removeClass('ajax-loader');
                }  //complete
            );    
       // }*/
     },
     hiddeResults:function(clear){
        var obj = this;
        $('#'+this.id+'_results').attr('visible',false).fadeOut('fast',function(){
            if (!(clear === undefined)){
                $('#'+obj.id+'_search_result').html('');
            };
        });
        //$('#'+this.id+'_detail').addClass('dinamicPanel-hidde');
     },
     navResults:function(key){
        var obj = this;
        
        if (obj.results.list.length > 0){
            var index = obj.results.index;
            var list = obj.results.list;
            var ban = false;
            switch(key){
                case 40: //flecha abajo
                       ban = true;
                       if (index < (list.length-1)){
                            index = index+1;
                       }else{
                            index = 0;
                       };
                    break;
                case 38:
                        ban = true;
                        if (index > 0){
                            index = index-1;
                            
                        }else{
                            index = list.length-1;
                        };
                    break;
                case 13:
                        //if (index >= 0){
                            obj.clickOnResultItem(index);
                            //if (obj.searchType == 'autocomplete'){
                            //    obj.updateTextSearch(index);
                            //    obj.resetToSearchPanel();
                            //    obj.hiddeResults();
                            //    obj.deepSearch($('#'+obj.id+'_inputSearch').val());
                            //}else{
                            //    obj.showDetail(index);
                            //}
                        //}else{
                        //    obj.deepSearch($('#'+obj.id+'_inputSearch').val());
                        //    obj.resetToSearchPanel();
                        //    obj.hiddeResults();
                        //}
                    break;
            };
            obj.results.index = index;
            if (ban){
               $('#'+obj.id+'_results .dinamicPanel-resultSelected').each(function(){
                    $(this).removeClass('dinamicPanel-resultSelected');
                });
               $('#'+obj.id+'_'+list[index].id).addClass('dinamicPanel-resultSelected');
            };
          }else{
          	if (key == 13){
          		obj.clickOnResultItem();
          	}
          };
     },
     //--------------------------------------------------------------------
     //Identify Recive ----------------------------------------------------
     //--------------------------------------------------------------------
     identifyPoint:function(data){
        var obj = this;
        var dataSource = obj.options.dataSource.identify;
        var proyName = obj.options.dataSource.proyName;
        //layers
        var baseLayers = obj.options.getBaseLayers();
        var activeLayers = obj.getActiveLayers(baseLayers);
        
        var isResolution = (!(dataSource.resolution === undefined));
        
        var params = { //Params----------------------
            'tablas':activeLayers,
            'pagina':'1',
            'x1':data.lon,
            'y1':data.lat,
            'width': obj.options.map.getWidth(),
            'proyName':proyName,
            'where': '',
            'tipo': 'identificar',
			//Anexo
			 resolution:obj.options.map.getWidth()
          };
         if (isResolution){
        	params.resolution = obj.options.map.getResolution();
        	obj.pageSourceResults(dataSource.url,params);
         }else{
		         var  params = JSON.stringify(params);
		          
		        obj.getData(dataSource,params, 
		        function(dataRes){ //success
		            if (!(dataRes === undefined)){
		                var tables = dataRes.data.value;
		                if (tables != null){
		                    var recCount = 0;
		                    var tabCount = 0;
		                    var point =  obj.options.map.transformToDegrees(data.lon,data.lat);
		                    var dataObject = {
		                            id:'Informaci&oacute;n del punto:',
		                            name:'<label style="font-size:85%">'+point.lon+', '+point.lat+'</label>'
		                    };
		                    var listTables = [];
		                    for (var t in tables){
		                        tabCount++;
		                        var tabla ={};
		                        tabla.label = tables[t].aliasUsuario;
		                        var results = tables[t].tables;
		                        var idTabla = tables[t].tabla;
		                        var tablaRecord = [];
		                        for (var r in results){
		                            recCount++;
		                            var fields = results[r].fields.fields;
		                            var record = {};
		                            for (i in fields){
		                                var nameField = obj.stringAsType(fields[i].aliasName.toLowerCase());
		                                if(nameField != 'coordenada'){
											nameField = (nameField =='tabla' || nameField =='id' || nameField =='nombre')?nameField:'value';
											record[nameField]=fields[i].value;
										}
		                            };
		                            record['tabla'] = idTabla;
		                            
		                            tablaRecord.push(record);
		                        };
		                        tabla.list = tablaRecord;
		                        listTables.push(tabla);
		                    };
		                    //listTables.reverse();
		                    var lastItem = listTables[0].list[0];
		                    
		                    if (listTables[0].list.length == 1)  //incluye identificacion solo si el elemento a mostrar no cuenta con lista
		                        dataObject.tools =[{type:'info',id:lastItem.id,value:lastItem.tabla}];
		                    
		                    dataObject.tables = tabCount;
		                    dataObject.total = recCount;
		                    dataObject.list =listTables;
		                    obj.showDetail(dataObject,'identify');
		                }else{
		                    //console.log(dataRes.response.message.toString());
		                };
		            };
		            
		        },
		        function(a,b){console.log(a,b);}, //error
		        function(){
		            $('#'+obj.id+'_spinner').addClass('ajax-loader');
		            }, //before
		        function(){
		            $('#'+obj.id+'_spinner').removeClass('ajax-loader');
		            }  //complete
		        );
		   }
     },
     //--------------------------------------------------------------------
     //category Search ------------------------------------------------------
     //--------------------------------------------------------------------
     searchDetail:function(id,table){
        var obj = this;
        var dataSource = obj.options.dataSource.identifyDetail;
        var proyName = obj.options.dataSource.proyName;
        obj.getData(dataSource,
         JSON.stringify({ //Params----------------------
            'gid':id,
            'tabla':table,
            'pagina':'1',
            'proyName':proyName,
            'where': '',
            'tipo': 'identificar'
         }), 
        function(dataRes){ //success
                var tabla =dataRes.data;
                var dataObject = {};
                    dataObject.id = '';
                    var _table = tabla.tabla;
                    dataObject.tools = [];
                    dataObject.list = [];
                    dataObject.name = tabla.aliasUsuario;
                    var fields = tabla.value[0].fields.fields;
                    var record = {};
                    for (i in fields){
                        var field = fields[i].aliasName.toLowerCase();
                        var nameField = obj.stringAsType(field);
                        switch (nameField){
                            case 'id':
                                    record.id = fields[i].value;
                            break;
                            case 'nombre':
                                    dataObject.id = dataObject.id+' '+fields[i].value;
                            break;
                            case 'tabla':
                                    dataObject.table = fields[i].value;
                            break;
                            case 'buffer': case 'metadato': case 'ubicacion': case '_download': case '_sistemas': case '_gallery':
                                    var lab = (nameField.substr(0,1) == '_')?nameField.substr(1,nameField.length-1):nameField;
                                    if (fields[i].value != ''){
                                        dataObject.tools.push({id:fields[i].value,type:lab,value:_table});
                                    };
                            break;
							case 'coord_merc': case 'coordenada': case 'locacion':
								case 'gid': case 'busqueda': case 'referencia': break;
							
                            default:
                                //dataObject.list.push(record);
                                dataObject.list.push({name:fields[i].aliasName,value:fields[i].value});
                        };
                    };
                    
                
                obj.showDetail(dataObject,'identifyDeep');
        },
        function(){}, //error
        function(){
            $('#'+obj.id+'_spinner').addClass('ajax-loader');
            }, //before
        function(){
            $('#'+obj.id+'_spinner').removeClass('ajax-loader');
            }  //complete
        );
     },
     closeDetail:function(){
       var obj= this;
       if ($('#'+obj.id+'_detail').html() != ''){
            $('#'+obj.id+'_detail').slideDown('fast',function(){
                 $('#'+obj.id+'_detail').addClass('dinamicPanel-hidde').html('');
                 $('#'+obj.id+'_detail').fadeOut('fast');
             });
       }else{
            $('#'+obj.id+'_detail').css('display','none');
       };
     },
     resetToSearchPanel:function(){
        var obj = this;
        $('#'+obj.id+'_search_result').html('');
        //obj.showResults('search');
        //obj.closeToolPanel();
        obj.results.index = -1;
        obj.results.list = [];
        obj.lastSearch = '';
        obj.searchType  = 'search';
        obj.showTools();
     },
     updateTextSearch:function(pos){
        var obj = this;
        var item = null;
        if (pos >= 0 || pos != ''){
            switch (typeof(pos)){
                case 'object':
                        $('#'+obj.id+'_inputSearch').focus().val(pos.busqueda);
                    break;
                case 'string':
                        $('#'+obj.id+'_inputSearch').focus().val(pos);
                    break;
                case 'number':
                        $('#'+obj.id+'_inputSearch').focus().val(obj.results.list[pos].busqueda);
                    break;
            };
        };
        //var item = (typeof(pos) != 'object')?obj.results.list[pos]:pos
        //$('#'+obj.id+'_inputSearch').focus().val(item.busqueda);
     },
     showDetail:function(pos,type,hidde){
        var obj = this;
        if (type == 'content'){ //este boque solo se usa para sustituciones completas
            var content = pos.content;
            var onClose = pos.onClose;
            var onCreate = pos.onCreate;
            var cadena = '<div class="dinamicPanel-detailContent">';
                cadena+= '  <div class="dinamicPanel-detailHeader">';
                cadena+= '  <div id="dinamicPanel_customDetail_title" class="dinamicPanel-customDetail-title"></div>';
                cadena+= '  <div id="dinamicPanel_customDetail_header" class="dinamicPanel-customDetail-header"></div>';
                cadena+= '      <div class="dinamicPanel-detailClose"><span id="'+obj.id+'_btnDetailClose" class="dinamicPanel-sprite dinamicPanel-close-short"></span></div>';
                cadena+= '  </div>';
                cadena+=        content;
                cadena+= '</div>';
                
                $('#'+obj.id+'_detail').html(cadena);
                    
                    if ($.isFunction(onCreate))
                            onCreate();
                    
                
                $('#'+obj.id+'_btnDetailClose').click(function(e){
                        if ($.isFunction(onClose))
                            onClose();
                            
                        obj.closeDetail();
                        
                        //regresa panel de existir resultados
                        obj.panelTransparency();
                        
                        e.stopPropagation(); 
                });
        }else{  //recibe detalle normal
            if (!(pos === undefined)){
                
                //hidde Categorys
                 $('#'+obj.id+'_searchPanel').html('');
                 obj.showPanel('searchPanel');
                 obj.hiddeResults();
                
                
                var item = (typeof(pos) != 'object')?obj.results.list[pos]:pos;
                var id = (item.id === undefined)?'':item.id;
                var desc = item.name;
                var list = item.list;
                var extent = '';
                var img = 'http://maps.googleapis.com/maps/api/streetview?size=100x80&location=46.414382,10.013988&heading=151.78&pitch=-0.76&sensor=false';
                var cadena = '<div class="dinamicPanel-detailContent">';
                    cadena+= '  <div class="dinamicPanel-detailHeader"><div class="dinamicPanel-detailTitle">'+id+'</div>';
                    cadena+= '      <div class="dinamicPanel-detailClose"><span id="'+obj.id+'_btnDetailClose" class="dinamicPanel-sprite dinamicPanel-close-short"></span></div>';
                    cadena+= '      <div class="dinamicPanel-detailDescription">'+desc+'</div>';
                    cadena+= '  </div>';
                    
                    //area de tools
                    //item.tools.push({type:'gallery',id:4515,value:'asasasa'});
                    if (!(item.tools === undefined)){
                        var tools = item.tools;
                        cadena+= '  <div class="dinamicPanel-detailTools">';
                        for(var x in tools){
                            var tool = tools[x];
                            if (tool.type != 'ubicacion'){
                                cadena+= '<div idref="'+tool.id+'" tableref="'+tool.value+'" class="dinamicPanel-btn-'+tool.type+' dinamicPanel-sprite dinamicPanel-'+tool.type+'"></div>';
                            }else{
                                extent = tool.id;
                            };
                        };
                        cadena+= '  </div>';
                    };
               
                    var rlist = [];
                    var rowLines = [];
                    if (!(list === undefined)){
                        rlist = [];
                        var count = 0;
                        var mainLabel = '';
                        var prefijo = '';
                        for (var x in list){
                            if (type == 'identify'){
                                var innerList = list[x].list;
                                if (innerList.length == 1){
                                    if (x == 0){
                                        prefijo = list[x].label+' ';
                                        mainLabel = list[x].list[0].nombre;
                                    }else{
                                        rlist.push(list[x].list[0].nombre);
                                    };
                                }else{
                                    rowLines  = rowLines.concat(innerList);  
                                };
                            }else{
                                var item = list[x];
                                var tcadena = '';
                                item.value = (item.value.search('http') > -1)?'<a href="'+item.value.split('|')[1]+'" target="_blank">'+item.value.split('|')[0]+'</a>':item.value;
                                
                                //rlist.push({name:list[x].list[0].nombre,value:})
                                cadena+='<div class="dinamicPanel-detailList-item"><strong>'+item.name+' </strong><label>'+item.value+'</label>'+tcadena+'</div>';
                            };
                        };
                        if (type == 'identify'){
                            rlist = rlist.toString();
                            //rlist = obj.textToSearchLink(rlist);
                            //mainLabel = obj.textToSearchLink(mainLabel,rlist);
                            cadena+='   <div class="dinamicPanel-detailPoint">';
                            cadena+='       <div class="dinamicPanel-detailMainLabel">'+prefijo+mainLabel+'</div>';
                            cadena+='       <div class="dinamicPanel-detailUbication">'+rlist+'</div>';
                            cadena+= '  </div>';
                        };
                    };
                    
                    //despliegue de lineas extra de elementos enviados
                    if (rowLines.length > 0){
                        var count = 0;
                        if (rowLines.length > 0)cadena+='<div class="dinamicPanel-detailList-container">';
                        for(var x in rowLines){
                            var item = rowLines[x];
                            cadena+='<div class="dinamicPanel-detailList-item"><label>'+item.nombre+'</label><span idref="'+item.id+'" tableref="'+item.tabla+'" class="dinamicPanel-btn-info dinamicPanel-sprite dinamicPanel-info-short"></span></div>';
                            count++;
                            if (count >= 10) break;
                        };
                        if (rowLines.length > 0)cadena+='</div>';
                    };
                    
                    cadena+= '</div>';
                    
                    
                    $('#'+obj.id+'_detail').css('display','none');
                    var alt = $('#'+obj.id+'_search_result').height();
                    //$('#'+obj.id+'_results').css('height',alt+'px');
                    
                    $('#'+obj.id+'_detail').removeClass('dinamicPanel-hidde').
                        html(cadena).
                        slideDown('slow');
                    if (extent != ''){
                        obj.mapExtend(extent);
                        $('#'+obj.id+'_detail').bind('click',function(e){
                           obj.mapExtend(extent);
                        }).addClass('dinamicPanel-detailPointer');
                    }else{
                        $('#'+obj.id+'_detail').unbind('click').removeClass('dinamicPanel-detailPointer');
                    };
                    
                        
                    obj.assignSearchOnLink();
                    
                    $('.dinamicPanel-btn-info').each(function(){
                        $(this).click(function(e){
                           var idref = $(this).attr('idref');
                           var tableref = $(this).attr('tableref');
                           obj.searchDetail(idref,tableref);
                           e.stopPropagation();
                        }); 
                    });
                    $('.dinamicPanel-btn-metadato').each(function(){
                        $(this).click(function(e){
                           var idref = $(this).attr('idref');
                           var tableref = $(this).attr('tableref');
                           obj.openLinkWindow(idref);
                           e.stopPropagation();
                        }); 
                    });
                    
                    $('.dinamicPanel-btn-buffer').each(function(){
                        $(this).click(function(e){
                           var idref = $(this).attr('idref');
                           var tableref = $(this).attr('tableref');
                           obj.createPanel('buffer');
                           obj.options.map.Feature.addArea({id:idref,table:tableref});
                           e.stopPropagation();
                        }); 
                    });
                    
                    $('.dinamicPanel-btn-gallery').each(function(){
                        $(this).click(function(e){
                           var idref = $(this).attr('idref');
                           obj.showGallery(idref);
                           e.stopPropagation();
                        }); 
                    });
                    
                    $('.dinamicPanel-btn-download').each(function(){
                        $(this).click(function(e){
                           var idref = $(this).attr('idref');
                           var tableref = $(this).attr('tableref');
                           window.open(idref);
                           e.stopPropagation();
                        }); 
                    });
                    
                    $('.dinamicPanel-btn-sistemas').each(function(){
                        $(this).click(function(e){
                           var idref = $(this).attr('idref');
                           var tableref = $(this).attr('tableref');
                           window.open(idref);
                           e.stopPropagation();
                        }); 
                    });
                    
                    
                    
                    
                    
                  //eventos
                  $('#'+obj.id+'_btnDetailClose').click(function(e){
                        obj.closeDetail();
                        
                        //regresa panel de existir resultados
                        obj.panelTransparency();
                        
                        e.stopPropagation(); 
                   });
                
                
                //oculta resultados al presentar info
                if (obj.searchType == 'autocomplete'){
                    $('#'+obj.id+'_search_result').html('');
                    obj.showResults();
                };
                
                //obj.results.list = [];
                obj.results.index = -1;
            };
        };
     },
     //--------------------------------------------------------------------
     //Input control ------------------------------------------------------
     //--------------------------------------------------------------------
     trackInput:function(){
        var obj = this;
        clearTimeout(obj.searchTimer);
        obj.searchTimer = setTimeout(function(){
            
            //si no esta activa la busqueda la activa
            if (obj.currentTool != 'search')obj.createPanel('searchPanel');
            
            var text = $('#'+obj.id+'_inputSearch').val();
            var searchType = obj.getSearchType(text);
            
            if (text.length > 2 && text != obj.lastSearch && searchType == ''){
                        //obj.initSearch(text,'autocomplete');
            }else{
                $('#'+obj.id+'_search_result').html('');
                obj.showResults();
                obj.resetToSearchPanel();
            };
        },obj.options.timeToSearch);
     },
     setInputTextRestriction:function(id,callback,callbackEnter){
        var obj = this;
        $('#'+id).bind("keypress", function(evt){
			var otherresult = 12;
			if(window.event != undefined){
                otherresult = window.event.keyCode;
			};
			var charCode = (evt.which) ? evt.which : otherresult;  
			if(charCode == 13 || charCode == 12){
				if (charCode==13)/*$("#"+idClick).click();*/
				if (charCode ==12 && evt.keyCode == 27){  //atrapa esc y limpia
                    setTimeout(function(){$('#'+id).val('');},100);
				};
			}else{
                var keyChar = String.fromCharCode(charCode);
                var keyChar2 = keyChar.toLowerCase();
                var re = /[\u0020\u0027\u00B0\u00E0-\u00E6\u00E8-\u00EB\u00EC-\u00EF\u00F2-\u00F6\u00F9-\u00FC\u0061-\u007a\u00f10-9\-\,\.]/;
				//var re = /[\u00E0-\u00E6\u00E8-\u00EB\u00EC-\u00EF\u00F2-\u00F6\u00F9-\u00FC\u0061-\u007a\u00f10-9\-\,\.]/;
                var result = re.test(keyChar2);
                result = (charCode == 8)?true:result;
                return result; 
			};
		}).keyup(function(e){
                if ($.isFunction(callback))callback($('#'+id).val());
                if (e.which == 13)
                    if ($.isFunction(callbackEnter)){
                        callbackEnter();
                    }
        });
     },
    setInputText:function(id,callback){
        var obj = this;
        $('#'+id).bind("keypress", function(evt){
			var otherresult = 12;
			if(window.event != undefined){
                otherresult = window.event.keyCode;
			};
			var charCode = (evt.which) ? evt.which : otherresult;  
			if(charCode == 13 || charCode == 12){
				if (charCode==13)/*$("#"+idClick).click();*/
				if (charCode ==12 && evt.keyCode == 27){  //atrapa esc y limpia
                    setTimeout(function(){$('#'+id).val('');},200);
				};
			}else{
                var keyChar = String.fromCharCode(charCode);
                var keyChar2 = keyChar.toLowerCase();
                var re = /[\u0020\u0027\u00B0\u00E0-\u00E6\u00E8-\u00EB\u00EC-\u00EF\u00F2-\u00F6\u00F9-\u00FC\u0061-\u007a\u00f10-9\-\,\.]/;
				//var re =   /[\u00E0-\u00E6\u00E8-\u00EB\u00EC-\u00EF\u00F2-\u00F6\u00F9-\u00FC\u0061-\u007a\u00f10-9 \-\,\.]/;
                var result = re.test(keyChar2);
                result = (charCode == 8)?true:result;
                if (result){
                    if ($.isFunction(callback))callback();  
                };
                return result; 
				
			};
		}).keydown(function(e){
           if(e.which == 46 && $.isFunction(callback)){
                callback();
           };
           if(e.which == 27){
              setTimeout(function(){$('#'+id).val('');},200);
              obj.hiddeResults();
              obj.resetToSearchPanel();
           };
           if(e.which == 38 || e.which == 40 || e.which == 13){obj.navResults(e.which);};
           if(e.which == 8)if ($.isFunction(callback))callback();  
        });
     },
    //--------------------------------------------------------------------
    //Data Transactions---------------------------------------------------
    //--------------------------------------------------------------------
     assignSearchOnLink:function(){
       var obj = this;
       $('.dinamicPanel-searchLink').each(function(){
            if ($(this).attr('assigned') === undefined){
                $(this).attr('assigned',true);
                $(this).click(function(e){
                   var search = $(this).attr('search');
                   obj.updateTextSearch(search);
                   obj.resetToSearchPanel();
                   obj.hiddeResults();
                   obj.deepSearch(search);
                   e.stopPropagation();
                });
            };
        });
       
     },
     initSearchCoords:function(coord){
        //Modificado por Manuel
     	var obj = this;
        var lonlat = obj.options.map.transformToMercator(coord[0],coord[1]);
        lonlat = obj.options.map.intersectExtent(lonlat.lon,lonlat.lat);
     	if (
     	      lonlat 
     	){
     		obj.identifyPoint(lonlat);
     		
     		var params = {action:'delete',items:'all',type:'identify'};
        	obj.options.map.Mark.event(params);

			obj.mapNewMarker('coordenada: '+coord[0]+','+coord[1],
                             lonlat.lon,
                             lonlat.lat,
                             'identify',
                             'Punto: '+coord[0]+','+coord[1],
                             function(){});
     		
     		obj.mapExtend(coord,true);
     		
     	}else{
     		obj.messageHeader('La coordenada esta fuera de los limites de visualizaci&oacute;n');
     	}
	//Fin Manuel
     	
     },
     initSearchCross:function(text){
     	var obj = this;
        var dataSource = obj.options.dataSource.crossSearch;
        var proyName = obj.options.dataSource.proyName;
        //auto complete data
        var params = {
            tabla:"geolocator",
			pagina:1,
			searchCriteria:text,
			proyName:proyName,
			idUser:"",
			where:"",
			paramProy:""
         };
        jQuery.ajaxSettings.traditional = true;
        obj.getData(dataSource,
        JSON.stringify(params), 
        function(data){ //success
            //conversion de respuesta a objeto generico
            var object = {};
            if (!(data === undefined) && data.response.success){
                data = data.data.value;
                object.total = data.length;
                object.list = [];
                
                
                for (var x in data){
                	var fields = data[x].fields.fields;
                	
                	var rec ={};	
                	for (var i in fields){
                		var field = fields[i].aliasName.toLowerCase();
                		var value = fields[i].value;
                		
                        var nameField = obj.stringAsType(field);
                        switch (nameField){
                            case 'calle':
                            	  if (rec.type === undefined){
	                                  	rec.type = 'calle';
	                                  	rec.name = value;   
	                              }else{
	                              		rec.name = rec.name+' cruce con: '+value;
	                              }
                            break;
                            case 'entidadmunicipio':
                            	  rec.label = value;
                            	  rec.busqueda = value;
                            break;
                            case '_coordenada':
                            	 value = value.substr(6,value.length-7).split(' ');
                            	 value = value[1]+','+value[0];
                            	 rec.position = {
                            	 	geo:value,
                            	 	merc:value
                            	 };
                            break;
                            case 'ubicacion':
                            	rec.location = value;
                            break;
                        };
                	}
                	rec.position.geo = rec.location;
                	rec.label+=', '+rec.name;
                	object.list.push(rec);
                };
            };
            obj.searchType = 'cross';
            obj.processData(object);
        },
        function(){}, //error
        function(){
            $('#'+obj.id+'_spinner').addClass('ajax-loader');
            }, //before
        function(){
            $('#'+obj.id+'_spinner').removeClass('ajax-loader');
            }  //complete
        );
     },
     initSearchEstab:function(text,type){  //deep realiza busqueda profunda
        var obj = this;
        obj.searchType = 'search';//(!(deep === undefined) && deep == 'deep')?'search':'autocomplete';
        var dataSource = obj.options.dataSource.denue;
        
        var location = obj.getMapCenter();
        	location = location.centroid.lat+', '+location.centroid.lon;
        //auto complete data
        var params = {
            hl:true,
            'hl.fl':dataSource.field,
            //'hl.simple.post':'</strong>',
            //'hl.simple.pre':'<strong>',
            q:text,
            rows:10,
            wt:'json',
            indent:true,
            facet:true,
            'facet.field':'tipo',
            sfield:'locacion',
            sort:'geodist() asc',
            //fl:'dist:geodist()',
            
            pt:location
         };
        
        obj.getData(dataSource,
        params, 
        function(data){ //success
            //conversion de respuesta a objeto generico
            var object = {};
            if (!(data === undefined)){
                if (data.response.numFound > 0){
                    object.total = data.response.numFound;
                    console.log(object.total);
                    var listA = data.response.docs;
                    var listB = data.highlighting;
                    object.list = [];
                    for (var x in listA){
	                        var item = listA[x];
	                        var hl = listB[item.gid];
	                        if (!(item === undefined)){
		                        
	                            var label = '';
                                var busqueda = item.busqueda.split(',');
                                item.nombre = busqueda[busqueda.length-1];
                                label = busqueda.join();
	                            item.label = label;
		                        
		                        // var loca = item.coord_merc.split(',');
		                        // loca = 'POINT('+loca[1]+','+loca[0]+')';
		                        
		                        item.id = (item.id === undefined)?item.gid:item.id; 
		                        item.name = item.nombre; delete item['nombre']; //renombra nombre por name
		                        item.type = obj.stringAsType(item.tipo); delete item['tipo']; //renombra tipo por type
		                        item.position = {geo:location, merc:item.coord_merc}; delete item['locacion'];delete item['coord_merc']; //reubica locacion y coord_merc
		                        
		                        object.list.push(item);
		                  };
	                    
                    };
                };
            };
            obj.searchType = 'estab';
            obj.processData(object);
        },
        function(){}, //error
        function(){
            $('#'+obj.id+'_spinner').addClass('ajax-loader');
            }, //before
        function(){
            $('#'+obj.id+'_spinner').removeClass('ajax-loader');
            }  //complete
        );
     },
     deepSearch:function(text){
        var obj = this;
        obj.initSearch(text,'search','deep');
     },
     initSearch:function(text,type,deep,table){  //deep realiza busqueda profunda
        var obj = this;
        obj.searchType = type;//(!(deep === undefined) && deep == 'deep')?'search':'autocomplete';
        var dataSource = (obj.searchType == 'search')?obj.options.dataSource.deepSearch:obj.options.dataSource.mainSearch;
        //auto complete data
		var location = obj.getMapCenter();
		
        var params = {
            hl:true,
            'hl.fl':dataSource.field,
            'hl.simple.post':'</strong>',
            'hl.simple.pre':'<strong>',
            q:text,
            rows:10,
            wt:'json'
         };
        
		
		if (obj.searchType == 'search'){
            params.facet=true,
            params['facet.field']='tipo';
        };
		
        //if (obj.searchType == 'autocomplete' && deep != 'nacional'){
        if (deep != 'nacional'){
            var location = obj.getMapCenter();
            var distance = location.distance;
            location = location.centroid.lat+', '+location.centroid.lon;
            params.indent=true;
            params.fq='{!bbox}';
            params.sfield='locacion';
            params.pt=location;
            params.d=(distance/1000); //a metros
        };
		
		
		if (type == 'search'  && $.isFunction(obj.options.translate_params)){
			dataSource = obj.options.translate_params(params,'search');
			if(table){
				dataSource.params.tabla = table;	
			}
			deep = 'nacional';
			params = {};
		};
		
		
        obj.getData(dataSource,
        params, 
        function(data){ //success
			var _data = data;
			if (type == 'search' && $.isFunction(obj.options.translate_results)){
				data = obj.options.translate_results(data,'search');
			};
		
		
            //conversion de respuesta a objeto generico
            var object = {};
            if (!(data === undefined)){
                if (data.response.numFound == 0 && deep != 'nacional'){
                    if (obj.searchType == 'autocomplete'){
                        obj.initSearch(text,'autocomplete','nacional');
                    };
                    if (obj.searchType == 'search'){
                        obj.initSearch(text,'search','nacional');
                    };
                }else{
                    if (obj.searchType == 'search' && !(data.facet_counts === undefined)){
                        //busca las categorias
                        _data.data.text = text;
						obj.searchInCategory(_data);
                    };
                    
                    object.total = data.response.numFound;
                    var listA = data.response.docs;
                    var listB = data.highlighting;
                    object.list = [];
                    for (var x in listA){
	                        var item = listA[x];
	                        var hl = listB[item.gid];
	                        if (!(listB === undefined) && !(hl === undefined) && !($.isEmptyObject(hl)) ){
		                        if (obj.searchType == 'search'){
		                            var label = '';
		                                var busqueda = item.busqueda.split(',');
		                                item.nombre = busqueda[busqueda.length-1];
		                                label = busqueda.join();
		                            
		                            item.label = label;
		                        }else{
		                            item.label = listB[item.gid].busqueda[0]; //extrae etiqueta marcada    
		                        };
		                        item.id = (item.id === undefined)?item.gid:item.id; 
		                        item.name = item.nombre; delete item['nombre']; //renombra nombre por name
								item.type = obj.stringAsType(item.tipo); delete item['tipo']; //renombra tipo por type
								item.position = {geo:item.locacion, merc:item.coord_merc}; delete item['locacion'];delete item['coord_merc']; //reubica locacion y coord_merc
		                        
		                        object.list.push(item);
		                  };
	                    
                    };
                };
            };
            obj.processData(object);
			
			if (data.response.numFound == 0 && obj.searchType == 'search' && deep == 'nacional'){
					obj.searchNotFound(text);
			}
        },
        function(){}, //error
        function(){
            $('#'+obj.id+'_spinner').addClass('ajax-loader');
            }, //before
        function(){
            $('#'+obj.id+'_spinner').removeClass('ajax-loader');
            }  //complete
        );
     },
	searchNotFound:function(search){
		 var obj = this;
		 var msg = '<span class="ui-icon ui-icon-info"></span><label>No se encontraron resultados para <b>'+search+'</b></label>';
		 
		 obj.hiddeResults();
		 obj.closeToolPanel();
		 obj.mapDeleteMarkers('search');
		 $('#'+obj.id+'_messages').html(msg).css('display','none').removeClass('dinamicPanel-hidde');
		 $('#'+obj.id+'_messages').fadeIn('slow');
		 setTimeout(function(){
			 $('#'+obj.id+'_messages').fadeOut('fast',function(){
			 	$('#'+obj.id+'_messages').addClass('dinamicPanel-hidde');
			 });
		 },4000);
		// obj.showDetail(cont,'content',true);
	 },
     textToSearchLink:function(text, extra){
        
        var plainText = function(text){
            text = text.replace('/','');
            var filter = text.replace(/<strong>/ig,'');
            return filter;
        };
        var textToLinkLabel = function(text,extra){
            var oldText = text;
            var filter = plainText(text);
            extra = (!(extra === undefined) && extra != '')?plainText(extra)+',':'';
            text =  '<label class="dinamicPanel-searchLink" search="'+extra+filter+'">'+oldText+'</label>';
            return text;
        };
        var r = '';
        if (typeof(text) == 'object' && text.length > 0){
            var list = text;
            var count = 0;
            var arrastre = '';
            for (var x in list){
                if (count > 0){
                    r+= ', ';
                };
                r+= textToLinkLabel(list[x],arrastre);
                arrastre= (arrastre != '')?arrastre+','+plainText(list[x]):plainText(list[x]);
                count++;
            };
        }else{
            r+= textToLinkLabel(text,extra);
        };
        return r;
     },
     clickOnResultItem:function(pos){
        var obj = this;
        if (!(pos === undefined) && pos > -1){
            if (obj.searchType == 'autocomplete'){
                obj.updateTextSearch(pos);
                obj.deepSearch($('#'+obj.id+'_inputSearch').val());
                obj.resetToSearchPanel();
            }else{
                obj.showDetail(pos);
            };
        }else{
        	var text = $('#'+obj.id+'_inputSearch').val();
        	if (text.trim() != ''){
        		
        		var searchType = obj.getSearchType(text);
        		
        		if (searchType != ''){
        			//si se detecta busqueda por coordenada
	            	if (searchType == 'coord'){
	            		var isCoord = obj.isCoord(text);
	    				obj.initSearchCoords([isCoord.lon,isCoord.lat]);            	
	                }else{
	                	//si se detecta busqueda de cruce
	                	if (searchType == 'cross'){
	                		obj.initSearchCross(text);
	                	}else{
			                obj.initSearchEstab(text,searchType);
		                }
                	}
                }else{
                	//busqueda profunda cuado no se detecte un tipo reservado de busqueda
                	obj.deepSearch(text);
                }
                
                obj.resetToSearchPanel();
	            obj.hiddeResults();
	           	
	            
            }
        };
     },
     processData:function(data){
        var obj = this;
        
        var params = {action:'delete',items:'all',type:'identify'};
        obj.options.map.Mark.event(params);
        
        var textToDeepSearch = function(){
               
        };
        var dataSource = obj.options.dataSource.mainSearch;
        if (typeof(data) != 'undefined' && data.total > 0){
            
           if (obj.searchType  == 'autocomplete'){
               obj.hiddeTools();
           }else{
               obj.lastResults = data;
               obj.mapDeleteMarkers('search');
           };
           
           var cadena = '';
           var list = data.list;
           var count = 0;
           for (var x in list){
                var id = list[x].id;
               // list.push(list[x]);
                var formatLabel = list[x].label.split(',');
                var mainLabel = formatLabel.pop();
                var links = list[x].busqueda.split(',');
					links.pop();
				
                var coords = '';
                var table = '';
                if (obj.searchType  != 'autocomplete'){
                    coords = (obj.searchType == 'cross')?list[x].position.geo:list[x].position.merc;
                    table = (!(list[x].tabla === undefined))?list[x].tabla:'';
                };
                
                
                formatLabel ='<div class="mainLabel">'+mainLabel+'</div>'+
                            ((links.length > 0)?'<div class="detailLabel">'+obj.textToSearchLink(links)+'</div>':'');
                var icon = obj.options.getIcon(list[x].type);
                var isCross= (/cross/.test(obj.searchType))?obj.searchType+'="true"':'';
                
                cadena+= '<div id="'+obj.id+'_'+id+'" idref="'+list[x].id+'" '+isCross+' table="'+table+'" coords="'+coords+'" pos="'+count+'" class="dinamicPanel-resultItem">';
                cadena+= '  <span class="dinamicPanel-dataIcon '+icon+'"></span>';
                cadena+= '  <div class="dinamicPanel-resultText">'+formatLabel+'</div>';
                cadena+= '</div>';
                count++;
                
                
                //agrega elementos a la vista
                if (obj.searchType  != 'autocomplete'){
                	coords = list[x].position.merc;
                    position = coords.split(',');
                    obj.mapNewMarker(mainLabel,
                                     position[1],
                                     position[0],
                                     'search',
                                     obj.textToSearchLink(formatLabel),
                                     function(){});
                };
                
           };
           obj.results.index = -1;
           obj.results.list = list;
           
           if (cadena != ''){
                $('#'+obj.id+'_results').css('display','none');
                //$('#'+obj.id+'_results').removeClass('dinamicPanel-hidde');
                $('#'+obj.id+'_search_result').html(cadena);
                $('#'+obj.id+'_search_result .dinamicPanel-resultItem').each(function(){
                   $(this).click(function(e){
                        var pos = parseInt($(this).attr('pos'),10);
                        var coords = $(this).attr('coords');
                        //var estab = $(this).attr('estab');
                        var cross = $(this).attr('cross');
                        var table = $(this).attr('table');
                        var idref = $(this).attr('idref');
                        
                        if(!(cross=== undefined)){// || !(estab=== undefined)){
                        	obj.mapExtend(coords);
                        }else{
	                        if (table=== undefined || table == ''){
	                            obj.clickOnResultItem(pos);    
	                        }else{
	                            obj.searchDetail(idref,table);    
	                        }
                        }
                        //if (typeof(coords) != 'undefined' && coords != ''){
                        //    coords=coords.split(',');
                        //    obj.mapExtend(coords);
                        //};
                        e.stopPropagation();
                    });
                });
                
                obj.assignSearchOnLink();
                
                if (obj.searchType != 'autocomplete')
                    obj.showPanel('searchPanel');
           
                obj.showResults('search');
                //oculta detalle de haber encontrado algun resultado
                obj.closeDetail();
           }else{
                obj.showResults();
                $('#'+obj.id+'_search_result').html(cadena); 
           };
        }else{
            $('#'+obj.id+'_search_result').html(cadena);
            obj.showResults();
        };
     },
     // the constructor
     _create: function() {
         this.id = this.element.attr('id');
         this.element
         // add a class for theming
         .addClass("custom-dinamicPanel");
         // prevent double click to select text
         //.disableSelection();
         // bind click events on the changer button to the random method
         this._refresh();
     },
     // called when created, and later when changing options
     adjustResultHeight:function(height){
        var obj = this;
        height = (height === undefined)?$(window).height():height;
        //if (height < 750){
            $('#'+obj.id+'_results').css('max-height',(height-330)+'px').css('overflow-y','auto');    
        //}else{
        //    $('#'+obj.id+'_results').css('max-height','').css('overflow-y','');    ;     
        //};
     },
     _refresh: function() {
        $(window).resize(function(){obj.adjustResultHeight($(this).height());});
        var obj = this;
            //barra de busqueda
        var cadena = '<div id="'+obj.id+'_search" class="dinamicPanel-search dinamicPanel-border dinamicPanel-shadow dinamicPanel-box-sizing">';
            cadena+= '  <div class="dinamicPanel-searchContainer">';
            cadena+= '      <span id="'+obj.id+'_spinner" class="dinamicPanel-spinner"></span>';
            cadena+= '      <input type="text" id="'+obj.id+'_inputSearch" class="ui-corner-all dinamicPanel-inset-focus dinamicPanel-transition" value="" placeholder="Buscar">';
            cadena+= '      <span id="'+obj.id+'_btnClearSearch" class="dinamicPanel-sprite dinamicPanel-close-short dinamicPanel-clearSearch"></span>';
            cadena+= '      <span id="'+obj.id+'_btnSearch" class="dinamicPanel-sprite dinamicPanel-search-big dinamicPanel-btnSearch"></span>';
            cadena+= '  </div>';
            cadena+= '</div>';
            
            cadena+= '<div class="dinamicPanel-dinamicSection">'; //inicia seccion dinamica
            
            //area de herramientas
            cadena+= '<div id="'+obj.id+'_toolSet" class="dinamicPanel-box-sizing dinamicPanel-toolSet dinamicPanel-border dinamicPanel-shadow">';
            cadena+= '  <div id="'+obj.id+'_toolContainer" class="dinamicPanel-toolContainer">';
            cadena+= '      <div id="'+obj.id+'_toolTabs" class="dinamicPanel-toolTabs">';
            cadena+=          obj.createTabs();
            cadena+= '      </div>';
            cadena+= '  </div>';
            //divisor
            cadena+= '  <span class="dinamicPanel-h-line" ></span>';
            cadena+= '  <div class="dinamicPanel-panelClose" ><span id="btnPanelClose" class="dinamicPanel-sprite dinamicPanel-close-short"></span></div>';
            cadena+= '  <div id="'+obj.id+'_panelContainer" class="dinamicPanel-panelContainer" >';
            cadena+=    obj.createPanels();
            cadena+= '  </div>';
            cadena+= '</div>';
            
			//area de mensajes
			cadena+= '<div id="'+obj.id+'_messages" class="dinamicPanel-hidde dinamicPanel-messages dinamicPanel-box-sizing dinamicPanel-border dinamicPanel-shadow">';
            cadena+= '</div>';			
			
            //area de herramientas
            cadena+= '<div id="'+obj.id+'_results" style="display:none" visible="false" class="dinamicPanel-box-sizing dinamicPanel-results dinamicPanel-border dinamicPanel-shadow">';
            cadena+=  obj.createResultPanels();
            cadena+= '</div>';
            
            //area de herramientas
            cadena+= '<div id="'+obj.id+'_detail" class="dinamicPanel-hidde dinamicPanel-detail dinamicPanel-box-sizing dinamicPanel-border dinamicPanel-shadow">';
            cadena+= '</div>';
            
            cadena+= '</div>'; //fin de secci�n dinamica
            
            
            obj.element.html(cadena);
            obj.adjustResultHeight();
            
            
            $('#'+obj.id+'_btnSearch').click(function(e){
                obj.clickOnResultItem();
                // obj.deepSearch($('#'+obj.id+'_inputSearch').val());
                // obj.resetToSearchPanel();
                // obj.hiddeResults();
                e.stopPropagation();    
            });
            
            $('#'+obj.id+'_inputSearch').blur(function(){
                $('#'+obj.id+'_results .dinamicPanel-resultSelected').each(function(){
                    $(this).removeClass('dinamicPanel-resultSelected');
                });
                obj.results.index = -1;
            });
            $('#btnPanelClose').click(function(){
                obj.closeToolPanel();

                if (obj.currentTool == 'search'){
                    $('#'+obj.id+'_searchPanel').html('');
                    obj.showPanel('searchPanel');
                };
                
            });
            $('.dinamicPanel-tab').each(function(){
                $(this).click(function(){
                  var idref = $(this).attr('idref');
                  obj.showPanel(idref);
                });
            });
            $('#'+obj.id).mouseleave(function(){
                obj.mouseOnPanel = false;
                obj.toolsTimer = setTimeout(function(){obj.panelTransparency('activate');},obj.toolsOpacityTimer);
            }).mouseenter(function(){
                obj.mouseOnPanel = true;
                obj.panelTransparency();
                clearTimeout(obj.toolsTimer);
            });
            
            $('#'+obj.id+'_btnClearSearch').click(function(){
              $('#'+obj.id+'_inputSearch').val('');
                obj.mapDeleteMarkers('search');
                obj.hiddeResults();
                obj.resetToSearchPanel();
                $('#'+obj.id+'_searchPanel').html('');
                obj.showPanel('searchPanel');
                $('#'+obj.id+'_inputSearch').focus();
            });
            
            obj.setInputText(obj.id+'_inputSearch',function(){obj.trackInput();});
         // trigger a callback/event
         this._trigger("change");
     },
     _destroy: function(){
         // remove generated elements
     },
     // _setOptions is called with a hash of all options that are changing
     // always refresh when changing options
     _setOptions: function() {
         // _super and _superApply handle keeping the right this-context
         this._superApply(arguments);
         this._refresh();
     },
     // _setOption is called for each individual option that is changing
     _setOption: function(key, value) {
         // prevent invalid color values
         //if (/red|green|blue/.test(key) && (value < 0 || value > 255)) {
         //    return;
         //}
         this._super(key, value);
     },
    make_base_auth:function(user, password) {
        var tok = user + ':' + password;
        var hash = btoa(tok);
        return "Basic " + hash;
    },
    getSearchType:function(text){
    	var obj = this;
    	var type = '';
    	
    	if (obj.isCoord(text)){
    		type = 'coord';
    	}else{
    		if (text.indexOf('--') > -1){
    			type = 'cross';
    		}else{
    			var list = obj.options.dataSource.synonyms.list;
				var estab = false;
				for (var x in list){
					var syn = list[x];
					    if (obj.compareText(text,x)){
					    	estab = x;
					    	break;
					    }else{
							for (var i in syn){
								var ban = obj.compareText(text,syn[i]);
								if(ban){
									estab = x;
									break;
								}
							}
						}
					if (estab)
						break;
				}
				if (estab){
					type = estab;
				}	
    		}
    	}
    	 
    	return type;
    	
    },
    getData:function(source,params,callback,error,before,complete){
			var obj = this;
			
			//Anexo de parametros que vengan definidos desde fuente de datos
			var s_params = source.params;
            if (s_params){
            	for (var x in s_params){ //anexo de la conifuracion del origen de datos
                	params[x] = s_params[x];
            	};
            }
			
			
			var stringify = source.stringify;
			
			if (!(stringify === undefined) && stringify){
				params = JSON.stringify(params);
			}
			
			//Estructura basica de peticion
            var dataObject = {
                   data: params,
                   success:function(json,estatus){callback(json,estatus);},
                   beforeSend: function(solicitudAJAX) {
                        if ($.isFunction(before)){
                            before(params);
                        };
                   },
                   error: function(solicitudAJAX,errorDescripcion,errorExcepcion) {
                        if ($.isFunction(error)){
                            error(errorDescripcion,errorExcepcion);
                        };
                   },
                   complete: function(solicitudAJAX,estatus) {
                        if ($.isFunction(complete)){
                            complete(solicitudAJAX,estatus);
                        };
                   }
            };
            //anexo de la conifuracion del origen de datos
            for (var x in source){ 
                if ( !(/field|name|id|params/.test(x)))dataObject[x] = source[x];
            };
            
            jQuery.support.cors = true;
            $.ajax(dataObject);
    },
    blinkElement:function(id){
        var obj = this;
        setTimeout(function(){
            $('#'+id).addClass('blinkBlue');
            setTimeout(function(){
                $('#'+id).removeClass('blinkBlue');
                setTimeout(function(){
                    $('#'+id).addClass('blinkBlue');
                    setTimeout(function(){
                        $('#'+id).removeClass('blinkBlue');
                    },500);
                },500);
                
            },500);
        },500);
     },
     textSearchFormat:function(text){
        text = text.toLowerCase();
        
        text = text.replace(/[\u00E1]/gi,'a');
		text = text.replace(/[\u00E9]/gi,'e');
		text = text.replace(/[\u00ED]/gi,'i');
		text = text.replace(/[\u00F3]/gi,'o');
		text = text.replace(/[\u00FA]/gi,'u');
		text = text.replace(/[\u00F1]/gi,'n');
        
        text = text.replace(/&aacute;/g, 'a');
        text = text.replace(/&eacute;/g, 'e');
        text = text.replace(/&iacute;/g, 'i');
        text = text.replace(/&oacute;/g, 'o');
        text = text.replace(/&uacute;/g, 'u');
        text = text.replace(/&ntilde;/g, 'n');
        
        text = text.replace(/rr/g, 'r');
        text = text.replace(/h/g, '');
        text = text.replace(/ll/g, 'l');
        text = text.replace(/x|z|c/g, "s");
        return text;
    },
    compareText:function(a,b){
        var obj = this;
        if (typeof(a) == 'object'){
            var ban = false;
            for (var x in a){
                var a_s = (obj.textSearchFormat(a[x]));
                var b_s = (obj.textSearchFormat(b));
                if(a_s.search(b_s) >= 0)ban = true; 
            }
            return ban;
        }else{
            var a_s = (obj.textSearchFormat(a));
            var b_s = (obj.textSearchFormat(b));
            return (a_s.search(b_s) >= 0);    
        }
    },
    getDecimal:function(d){
    	//Modificado por Manuel
          var r=0;
          var f=1;
          for (var i=0; i<d.length; i++) {
              r+= d[i]/f;
              f *= 60;
          }
          r=r.toFixed(5);
          return r;
     },
     isCoord:function(value){
			var r = null;
	
	        var getCoordsRegExp = /(-?\d+(?:\.\d+)?)\s?,\s?(-?\d+(?:\.\d+)?)/;
	        var degreesRegExp = /[�"']/;
	        //var degreesSplitRegExp = /^(-?\d{1,3})�?(?:\s+(\d{1,2})"?)?(?:\s+(\d{1,2})'? ?[onON]?)?(?:\s+)?,(?:\s+)?(-?\d{1,3})�?(?:\s+(\d{1,2})"?)?(?:\s+(\d{1,2})'? ?[onON]?)?$/;
			var degrees = /\+?(\d{1,3})(?:\u00B0|\u002A)?\s+?(\d{1,2})'?(?:\s+?(?:(\d+?(?:\.\d+?)?))"?)?\s*([nsewNSEW])?\s*?,\s*\+?(\d{1,3})(?:\u00B0|\u002A)?\s+?(\d{1,2})'?(?:\s+?(?:(\d+?(?:\.\d+?)?))"?)?\s*([nsewNSEW])?\s*$/i;
	        var coord1 = 0.0;
	        var coord2 = 0.0;
	        var ldegree = 0;
	        var lminute = 0;
	        var lsecond = 0;
	        var rdegree = 0;
	        var rminute = 0;
	        var rsecond = 0;
	        var isDegrees = degrees.exec(value);
                
	        if(isDegrees){
	            ////////////////////////////
                         
                         var i = isDegrees;
                         var g1 =i[1];
                         var m1 =i[2];
                         var s1 =(i[3])?i[3]:0;
                         var d1 =i[4];
                         var g2 =i[5];
                         var m2 =i[6];
                         var s2 =(i[7])?i[7]:0;
                         var d2 =i[8];
             
                         r = {lon:(parseFloat(this.getDecimal([g1,m1,s1]))),lat:parseFloat(this.getDecimal([g2,m2,s2]))};
                         //r = this.options.map.isValidCoordinate(getDecimal([g1,m1,s1]),getDecimal([g2,m2,s2]));     
                         if(r.lon<r.lat){
                              var aux = r.lon;
                              r.lon = r.lat;
                              r.lat = aux;
                         }
                         r.lon = r.lon*-1;
                         coord1 = parseFloat(r.lon);
                         coord2 = parseFloat(r.lat);
                    //////////////////////////////
	        }
	        else if(!isDegrees){
	            //alert('segundo');
	            var match = getCoordsRegExp.exec(value);
	            if (match != null) {
	                coord1 = parseFloat(match[1]);
	                coord2 = parseFloat(match[2]);
	                //alert("coord1 = " + coord1 + ", coord2 = " + coord2);
	            }
	        }
	        if(coord2 < 0){
	            var tmp = coord2;
	            coord2 = coord1;
	            coord1 = tmp;
	        }
			
			if (coord1 != 0 && coord2 !=0){
				//alert(coord1+' '+coord2);
				var coords = coord1+'|'+coord2;
				//$('#iconBuscar').attr('src','imagenes/skin2/iconCoord.png');
				r = {lon:coord1, lat:coord2};
				
			}
			//alert("resultado es " + coord1 + " , " + coord2);
			return r;
     }
     //Fin Manuel
 });