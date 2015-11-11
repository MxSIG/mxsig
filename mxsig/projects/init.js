var evento = function(){
  
};

var getContenido = function(){
  return '<div id="mdmp"><div>';
};

var getContenidoBottom = function(){
  
  var chain = '<div id="grapher"></div>';
  return chain;
}
var params = {
  'panel':            {
                        'right':{
                                  width:'300px',
                                  content:getContenido(),
                                  load:function(){
									 
									 $.when(
									 	$.getScript("projects/code/cofigSources.js"),
							            $.getScript("projects/code/main.js"),
										$.Deferred(function( deferred ){
											$( deferred.resolve );
										})
        							 ).done(function(){
										mdmp.init();
                                                                                //MDMWeeks('init');
									 });
									
                                  },
								  internals:[ 
								   {id:'mdmp_panel01',content:'<div id="mdmp_panel_01"></div>'},
								   {id:'mdmp_panel02',content:'<div id="mdmp_panel_02"></div>'}
                                  ],
                                  externals:[
                                    {id:'mdmp_e_panel01',content:'<div id="mdmp_e_panel_01"></div>'},
									{id:'mdmp_e_panel02',content:'<div id="mdmp_e_panel_02"></div>'}
                                  ]
                                },
                        'bottom':{
                                  height:'200px',
                                  type:'overlay',
                                  title:'Gr&aacute;ficas',
                                  content:getContenidoBottom(),
                                  load:function(){
                                    //MDMGrapher('init');
                                    
                                  }
                                }
                      },
  'aditionalLayers':[
                      {
                        type:'Wms',
                        label:'escuelas',		             
                        url:'http://10.1.30.102/fcgi-bin/mapserv.exe?map=/opt/map/mercator.map&',
                        layer:'',
                        tiled:false,
                        format:'png'
                      }
                    ],
  'onLoad':           evento,
  'onMoveEnd':function(){},
  'onZoomEnd':function(){},
  'onIdentify':function(){},
  'btnTogglePanels':true
};
//MDM6('init',params);


//MDM6('setParams','escuelas',params)