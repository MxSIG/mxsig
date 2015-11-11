define(function() {
    var data = {
        themes:{
            T2:{
                label:'Edafolog&iacute;a',
                layers:[
                    'c416'
                ],
                desc:'Tipos de Suelo',
                img:'edafologia.jpg'
            },
            T3:{
                label:'Uso del Suelo',
                layers:[
                    'cusv5'
                ],
                desc:'Tipo de agricultura y vegetaci&oacute;n',
                img:'usv.jpg'
            },
            T4:{
                label:'Geolog&iacute;a',
                layers:[
                    'c405',
                    'c408',
                    'c413'
                ],
                desc:'Unidades de Roca',
                img:'geologia.jpg'
            },
            T5:{
                label:'Climas',
                layers:[
                    'c410',
                    'c418'
                ],
                desc:'Unidades de Climas',
                img:'climas.jpg'
            },
            T5:{
                label:'Fen&oacute;menos geol&oacute;gicos',
                layers:[
                    'c462',
					'c465'
                ],
                desc:'Fen&oacute;menos geol&oacute;gicos',
                img:'fenomenos.jpg'
            },
            T6:{
                label:'Geodesia',
                layers:[
                    'c150'
                ],
                desc:'Geodesia',
                img:'geodesia.jpg'
            },
            T7:{
                label:'Zonas Hidrogeol&oacute;gicas',
                layers:[
                    'c450',
                    'c452',
                    'c4453',
                    'c454',
					'c455',
					'c456',
					'c457'
                ],
                desc:'Zonas Hidrogeol&oacute;gicas',
                img:'zhidrogeo.jpg'
            }
        },
        baseLayers:{
            B1:{
                type:'Wms',
                label:'Topogr&aacute;fico - INEGI',
                img:'Wms.jpg',		             
                 //url:['http://gaiamapas3.inegi.org.mx/mdmCache/service/wms?'],
				 url:['http://gaiamapas1.inegi.org.mx/mdmCache/service/wms?','http://gaiamapas3.inegi.org.mx/mdmCache/service/wms?','http://gaiamapas2.inegi.org.mx/mdmCache/service/wms?'],
                // url:['http://10.152.11.19:82/mdmCache/service/wms?'],
				//layer:'MapaBaseTopograficov6',
				layer:'MapaBaseTopograficov61_sinsombreado',
                rights:'Derechos Reservados &copy; INEGI',
                tiled:true,
				legendlayer:['c100','c101','c102','c102-r','t700','c102m','c103','c109','c110','c111','c112','c200','c201','c202','c203','c206','c300','c301','c302','c310','c311','c354','c762','c793','c795'],
                desc:'REPRESENTACION DE RECURSOS NATURALES Y CULTURALES DEL TERRITORIO NACIONAL A ESCALA 1: 250 000, BASADO EN IMAGENES DE SATELITE DEL  2002 Y TRABAJO DE CAMPO REALIZADO EN 2003',
                clasification:'VECTORIAL'
            },
            B2:{
                type:'Wms',
                label:'Hipsogr&aacute;fico - INEGI',
                img:'baseHipsografico.jpg',		             
                url:['http://gaiamapas1.inegi.org.mx/mdmCache/service/wms?','http://gaiamapas3.inegi.org.mx/mdmCache/service/wms?','http://gaiamapas2.inegi.org.mx/mdmCache/service/wms?'],
                layer:'MapaBaseHipsografico',
				rights:'Derechos Reservados &copy; INEGI',
                tiled:true,
                legendlayer:['img_altimetria.png'],
                desc:'IMAGEN DE RELIEVE QUE MUESTRA UNA COMBINACION DE ELEVACION A TRAVES DE COLORES HIPSOGRAFICOS, GENERADA POR PROCESAMIENTO DEL CONTINUO DE ELEVACIONES MEXICANOS DE 3.0 DE 15 METROS.',
                clasification:'RASTER'
            },
            B3:{
                type:'Wms',
                label:'Ortofotos - INEGI',
                img:'baseOrtos.jpg',		             
                url:['http://gaiamapas1.inegi.org.mx/mdmCache/service/wms?','http://gaiamapas3.inegi.org.mx/mdmCache/service/wms?','http://gaiamapas2.inegi.org.mx/mdmCache/service/wms?'],
                layer:'MapaBaseOrtofoto',
				rights:'Derechos Reservados &copy; INEGI',
                tiled:true,
                desc:'CONJUNTO DE IMAGENES AEREAS ORTORECTIFICADAS A DIVERSAS ESCALAS Y RESOLUCIONES, PROVENIENTES DEL ACERVO DE ORTOFOTOS DE INEGI Y QUE CORRESPONDEN A TOMAS REALIZADAS EN EL LAPSO 2005-2012.',
                clasification:'RASTER'
                },			
            B4:{
                type:'Osm',
                label:'Open Street Map',
                img:'Osm.jpg',
                rights:'&copy; OpenStreetMap contributors',
                clasification:'VECTORIAL'
            },
           /* B5:{
                type:'Bing',
                label:'Bing maps',
                img:'Bing.jpg',
                key:'At-Y-dJe-yHOoSMPmSuTJD5rRE_oltqeTmSYpMrLLYv-ni4moE-Fe1y8OWiNwZVT',
                layer:'Aerial',
                rights:'&copy; Bing Maps',
                clasification:'RASTER'
            }, */
            B6:{
                type:'Google',
                label:'Google Satellite',
                img:'Google.jpg',
                layer:'google.maps.MapTypeId.SATELLITE',
                rights:'&copy; Google',
                clasification:'RASTER'
            }, 
	    B7:{
                type:'Esri',
                label:'Esri map',
                img:'Esri.jpg',
                url:'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/${z}/${y}/${x}',
                rights:'&copy; ESRI',
		clasification:'VECTORIAL'
            }
        
        },
		layers:{
            groups:{
			     G70:{
                    label:'Red Nacional de caminos (2014)',
                    layers:{
                        c200:{
                            label:'Red Nacional de caminos',
                            synonymous:['camino','carretera','terraceria'],
                            scale:0,
                            position:3,
                            active:false,
							texts:{
                                scale:0,
                                active:false
                            },
                        },
                        c200casetas:{
                            label:'Casetas de peaje',
                            synonymous:['caseta','peaje'],
                            scale:5,
                            position:201,
                            active:false
                        },
                        c200gasolineras:{
                            label:'Gasolineras',
                            synonymous:['gasolinera','estacion de carga'],
                            scale:12,
                            position:202,
                            active:false
                        },
						c200postedereferencia:{
                            label:'Postes de referencia',
                            synonymous:['poste de referancia'],
                            scale:11,
                            position:203,
                            active:false
                        }
                    }
                },
                G1:{
                    label:'Centros de informaci&oacute;n INEGI',
                    layers:{
                        c431:{
                            label:'Centros de informaci&oacute;n INEGI',
                            synonymous:['INEGI','centros'],
                            scale:0,
                            position:71,
                            active:false
                        },
						cfira:{
                            label:'Fira',
                            synonymous:['INEGI','centros'],
                            scale:0,
                            position:199,
                            active:false
                        }						
                    }
                },
                G2:{
                    label:'L&iacute;mites (Marco Geoestad&iacute;stico Nacional 2013)',
                    layers:{
                        c100:{
                            label:'Estatales',
                            synonymous:['estado','estatales'],
                            scale:0,
                            position:52,
                            active:false,
                            texts:{
                                scale:0,
                                active:false
                            }//,
							//metadato:'http://geoweb.inegi.org.mx/WSCBuscador/MuestraMetadatos.jsp?par1=52392&par2=INEGI1'
                            
                        },
                        c101:{
                            label:'Municipales',
                            synonymous:['municipio','municipales','municipal'],
                            scale:866685,
                            position:51,
                            active:false,
                            texts:{
                                scale:0,
                                active:false
                            }//,
							//metadato:'http://geoweb.inegi.org.mx/WSCBuscador/MuestraMetadatos.jsp?par1=52392&par2=INEGI1'
                        },
                        c109:{
                            label:'AGEB urbanas',
                            synonymous:['ageb','urbana'],
                            scale:216671,
                            position:53,
                            active:false,
                            texts:{
                                scale:0,
                                active:false
                            }
                        },
						c108:{
                            label:'AGEB rurales',
                            synonymous:['ageb','rurales'],
                            scale:216671,
                            position:40,
                            active:false,
                            texts:{
                                scale:0,
                                active:false
                            }
                        }
                    }
                },
                G3:{
                    label:'Geodesia (Actualizaci&oacute;n mensual)',
                    layers:{
                        c150:{
                            label:'Red geod&eacute;sica nacional',
                            synonymous:['red','geodesia'],
                            scale:433342,
                            position:72,
                            active:false
                        }
                    }
                },
                G4:{
                    label:'Infraestructura Hidr&aacute;ulica (1997-2007)',
                    layers:{
                        c300:{
                            label:'Acueductos',
                            synonymous:['acueducto','hidraulica','infraestructura'],
                            scale:27083,
                            position:53,
                            active:false
                        },
                        c301:{
                            label:'Canales',
                            synonymous:['canal'],
                            scale:27083,
                            position:54,
                            active:false
                        },
                        c302:{
                            label:'Presas',
                            synonymous:['presa','agua'],
                            scale:27083,
                            position:55,
                            active:false
                        }
                    }
                },
                G5:{
                    label:'Localidades (Marco Geoestad&iacute;stico Nacional 2013)',
                    layers:{
                        c102:{
                            label:'&Aacute;reas urbanas',
                            synonymous:['urbana'],
                            scale:0,
                            position:2,
                            active:false,
                            texts:{
                                scale:3466743,
                                active:false
                            }//,
							//metadato:'http://geoweb.inegi.org.mx/WSCBuscador/MuestraMetadatos.jsp?par1=52392&par2=INEGI1'
                        },
						c102m:{
                            label:'Manzanas',
                            synonymous:['urbana'],
                            scale:54167,
                            position:5,
                            active:false
							
                        },
                        c112:{
                            label:'Calles',
                            synonymous:['calle'],
                            scale:27083,
                            position:4,
                            active:false,
                            texts:{
                                scale:27083,
                                active:false
                            }
                        },
                        t700:{
                            label:'N&uacute;meros exteriores',
                            synonymous:['exterior','numeros'],
                            scale:3385,
							 position:1,
                           // position:73,
                            active:false
                        },
                       /* c115:{
                            label:'Colonias',
                            synonymous:['colonia'],
                            scale:27083,
                            position:4,
                            active:false,
                            texts:{
                                scale:27083,
                                active:false
                            }
                        },*/
						c110:{
                            label:'&Aacute;reas verdes / Parques  / Glorietas  / Camellones',
                            synonymous:['parque','areas'],
                            scale:216671,
                            position:6,
                            active:false
                        },
                        c111:{
                            label:'Servicios',
                            synonymous:['servicio'],
                            scale:6770,
                            position:2,
                            active:false,
							texts:{
                                scale:6770,
                                active:false
                            }
                        },
                        c103:{
                            label:'Rurales no amanzanadas',
                            synonymous:['rural','manzana'],
                            scale:27083,
                            position:75,
                            active:false,
                            texts:{
                                scale:27083,
                                active:false
                            }
                        },
                        c102r:{
                            label:'Rurales Amanzanadas',
                            synonymous:['rural','manzana'],
                            scale:3466743,
                            position:54,
                            active:false,
                            texts:{
                                scale:866685,
                                active:false
                            }
                        }

                    }
                },
                G6:{
                    label:'Nombres Geogr&aacute;ficos',
                    layers:{
                        c350:{
                            label:'Nombres de localidades',
                            synonymous:['localidad','nombre'],
                            scale:216671,
                            position:77,
                            active:false,
                            texts:{
                                scale:216671,
                                active:false
                            }
                        },
                        c351:{
                            label:'Nombres de rasgos hidrogr&aacute;ficos',
                            synonymous:['rasgo','nombre','hidrografico'],
                            scale:216671,
                            position:78,
                            active:false,
                            texts:{
                                scale:216671,
                                active:false
                            }
                        },
                        c352:{
                            label:'Nombres de rasgos orogr&aacute;ficos',
                            synonymous:['rasgo','nombre','ortografico'],
                            scale:216671,
                            position:79,
                            active:false,
                            texts:{
                                scale:216671,
                                active:false
                            }
                        },
                        c353:{
                            label:'Nombres de formas litorales',
                            synonymous:['rasgo','nombre','ortografico'],
                            scale:216671,
                            position:80,
                            active:false,
                            texts:{
                                scale:216671,
                                active:false
                            }
                        },
                         c354:{
                            label:'Nombres de &aacute;reas naturales y culturales',
                            synonymous:['areas','nombre','natural','cultural'],
                            scale:216671,
                            position:81,
                            active:false,
                            texts:{
                                scale:216671,
                                active:false
                            }
                        },
                        c355:{
                            label:'Nombres de obras de infraestructura',
                            synonymous:['obras','nombre','infraestructura'],
                            scale:216671,
                            position:82,
                            active:false,
                            texts:{
                                scale:216671,
                                active:false
                            }
                        }
                    }
                },
                G7:{
                    label:'Rasgos Hidrogr&aacute;ficos (1997-2007)',
                    layers:{
                        c310:{
                            label:'Corrientes de agua',
                            synonymous:['agua','corriente'],
                            scale:433342,
                            position:58,
                            active:false
                        },
                        c311:{
                            label:'Cuerpos de agua',
                            synonymous:['cuerpo','agua'],
                            scale:0,
                            position:6,
                            active:false,
							texts:{
                                scale:0,
                                active:false
                            }
                        }
                    }
                },
                G8:{
                    label:'V&iacute;as de Comunicaci&oacute;n',
                    layers:{
                        c201:{
                            label:'Aeropuertos (1997-2007)',
                            synonymous:['aeropuerto'],
                            scale:866685,
                            position:83,
                            active:false,
                            texts:{
                                scale:866685,
                                active:false
                            }
                        },
                        c203:{
                            label:'Caminos (1997-2007)',
                            synonymous:['camino'],
                            scale:216671,
                            position:59,
                            active:false
                        },
                       /* c200:{
                            label:'Carreteras (Edici&oacute;n 1 -2011)',
                            synonymous:['carretera'],
                            scale:0,
                            position:60,
                            active:false,
                            texts:{
                                scale:0,
                                active:false
                            }
                        },*/
                        c205:{
                            label:'Casetas de peaje (1997-2007)',
                            synonymous:['caseta','peaje'],
                            scale:433342,
                            position:84,
                            active:false
                        },
                        c202:{
                            label:'V&iacute;as f&eacute;rreas (1997-2007)',
                            synonymous:['via','ferrea','tren'],
                            scale:3466743,
                            position:61,
                            active:false
                        }
                    }
                },
                G9:{
                    label:'Datos del Relieve (Escala 1:50 000 1997-2007)',
                    layers:{
                        c206:{
                            label:'Curvas de nivel',
                            synonymous:['curva','nivel'],
                            scale:27083,
                            position:62,
                            active:false,
							texts:{
                                scale:27083,
                                active:false
                            }
                        }/*,
                        b53:{
                            label:'Hipsogr&aacute;fico',
                            synonymous:['hipsografico'],
                            scale:0,
                            position:1,
                            active:false
                        },
                        b54:{
                            label:'Modelo digital sombreado',
                            synonymous:['digital','sombra'],
                            scale:0,
                            position:1,
                            active:false
                        }*/
                    }
                },
                /*G10:{
                    label:'Ortofotos',
                    layers:{
                        b50:{
                            label:'Ortofotos',
                            synonymous:['ortofoto','orto','foto'],
                            scale:0,
                            position:0,
                            active:false
                        }
                    }
                },*/
                G11:{
                    label:'Territorio Insular (1999)',
                    layers:{
                        c793:{
                            label:'Oce&aacute;nicos costeros (Islas y cayos)',
                            synonymous:['costa','oceano'],
                            scale:0,
                            position:7,
                            active:false,
                            texts:{
                                scale:6933486,
                                active:false
                            }
                        },
                        c795:{
                            label:'Arrecifes',
                            synonymous:['arrecife'],
                            scale:3466743,
                            position:8,
                            active:false,
                            texts:{
                                scale:3466743,
                                active:false
                            }
                        },
                        c796:{
                            label:'Terrestres (Islas en cuerpos de agua continentales)',
                            synonymous:['tierra','terrestre'],
                            scale:433342,
                            position:9,
                            active:false,
                            texts:{
                                scale:433342,
                                active:false
                            }
                        }
                    }
                },
                G12:{
                    label:'Marco cartogr&aacute;fico',
                    layers:{
                        c801:{
                            label:'L&iacute;mites de cartas escala 1:10 000',
                            synonymous:['limite','escala','carta'],
                            scale:433342,
                            position:310,
                            active:false,
                            texts:{
                                scale:433342,
                                active:false
                            }
                        },
                        c802:{
                            label:'L&iacute;mites de cartas escala 1:20 000',
                            synonymous:['limite','escala','carta'],
                            scale:866685,
                            position:311,
                            active:false,
                            texts:{
                                scale:866685,
                                active:false
                            }
                        },
                        c803:{
                            label:'L&iacute;mites de cartas escala 1:50 000',
                            synonymous:['limite','carta','escala'],
                            scale:3466743,
                            position:312,
                            active:false,
                            texts:{
                                scale:3466743,
                                active:false
                            }
                        },
                        c804:{
                            label:'L&iacute;mites de cartas escala 1:250 000',
                            synonymous:['limite','carta','escala'],
                            scale:0,
                            position:313,
                            active:false,
                            texts:{
                                scale:0,
                                active:false
                            }
                        }
                    }
                },
                G13:{
                    label:'Aguas Superficiales 1:250 000 (2001-2010)',
                    layers:{
                        c402:{
                            label:'Cuencas hidrol&oacute;gicas',
                            synonymous:['cuenca','hidro'],
                            scale:0,
                            position:14,
                            active:false
                        },
                        c403:{
                            label:'Escurrimiento superficial de la precipitaci&oacute;n media anual',
                            synonymous:['escurrimiento','superficie','precipitacion','media','anual'],
                            scale:0,
                            position:15,
                            active:false
                        }
                    }
                },
                G14:{
                    label:'Aguas Subterr&aacute;neas 1:250 000 (1996-2008)',
                    layers:{
                        c400:{
                            label:'&Aacute;reas de concentraci&oacute;n de pozos',
                            synonymous:['areas','concentracion','pozo'],
                            scale:0,
                            position:16,
                            active:false
                        },
                        c412:{
                            label:'Puntos muestreados',
                            synonymous:['punto','muestra','muestreados'],
                            scale:1733371,
                            position:85,
                            active:false
                        },
                        c419:{
                            label:'Unidades geohidrol&oacute;gicas',
                            synonymous:['unidad','geo','hidro'],
                            scale:0,
                            position:17,
                            active:false
                        }
                    }
                },
                G15:{
                    label:'Nieves perpetuas y Salinas 1:250 000 (2003-2005)',
                    layers:{
                       /* c430:{
                            label:'Arrecifes',
                            synonymous:['arrecife'],
                            scale:0,
                            position:18,
                            active:false
                        },*/
                        c427:{
                            label:'Nieves perpetuas',
                            synonymous:['nieve','perpetua'],
                            scale:0,
                            position:19,
                            active:false
                        },
                        c429:{
                            label:'Salinas',
                            synonymous:['sal','salina'],
                            scale:0,
                            position:20,
                            active:false
                        }
                    }
                },
                G16:{
                    label:'Climas (1921-1975)',
                    layers:{
                        c401:{
                            label:'Can&iacute;cula',
                            synonymous:['canicula'],
                            scale:0,
                            position:21,
                            active:false
                        },
                        c404:{
                            label:'Evapotranspiraci&oacute;n',
                            synonymous:['evapo','transpiracion'],
                            scale:0,
                            position:63,
                            active:false
                        },
                        c407:{
                            label:'Humedad del suelo',
                            synonymous:['humedad','suelo'],
                            scale:0,
                            position:22,
                            active:false
                        },
                        c410:{
                            label:'Precipitaci&oacute;n media anual',
                            synonymous:['precipitacion','media','anual'],
                            scale:0,
                            position:64,
                            active:false
                        },
                        c417:{
                            label:'Temperatura media anual',
                            synonymous:['temperatura','media','anual'],
                            scale:0,
                            position:65,
                            active:false
                        },
                        c418:{
                            label:'Unidades clim&aacute;ticas',
                            synonymous:['unidad','clima'],
                            scale:0,
                            position:23,
                            active:false
                        }
                    }
                },
                G17:{
                    label:'Fisiograf&iacute;a 1:250 000 (1980-1982)',
                    layers:{
                        c411:{
                            label:'Provincias fisiogr&aacute;ficas',
                            synonymous:['provincia','fisiografia'],
                            scale:0,
                            position:24,
                            active:false
                        },
                        c414:{
                            label:'Sistema de Topoformas',
                            synonymous:['evapo','transpiracion'],
                            scale:0,
                            position:25,
                            active:false
                        },
                        c415:{
                            label:'Subprovincias fisiogr&aacute;ficas',
                            synonymous:['provincia','sub','fisiografica'],
                            scale:0,
                            position:26,
                            active:false
                        }
                    }
                },
                G18:{
                    label:'Geolog&iacute;a 1:250 000 (1978-1988)',
                    layers:{
                        c405:{
                            label:'Fallas, fracturas',
                            synonymous:['falla','fractura'],
                            scale:0,
                            position:66,
                            active:false
                        },
                        c408:{
                            label:'Minas y otras ubicaciones geol&oacute;gicas',
                            synonymous:['mina','ubicaciones','geologica','geologia'],
                            scale:0,
                            position:86,
                            active:false
                        },
                        c413:{
                            label:'Rocas',
                            synonymous:['roca'],
                            scale:0,
                            position:27,
                            active:false
                        }
                    }
                },
                G19:{
                    label:'Suelos 1:250 000 (2002-2007)',
                    layers:{
                        /*c406:{
                            label:'Fases f&iacute;sicas',
                            synonymous:['fase','fisica'],
                            scale:0,
                            position:28,
                            active:false
                        },
                        c409:{
                            label:'Perfiles de suelo',
                            synonymous:['perfil','suelo'],
                            scale:0,
                            position:87,
                            active:false
                        },*/
                        c416:{
                            label:'Suelos',
                            synonymous:['suelos'],
                            scale:0,
                            position:29,
                            active:false,
							//metadato:'http://geoweb.inegi.org.mx/WSCBuscador/MuestraMetadatos.jsp?par1=55021&par2=INEGI1'
                        }
                    }
                },
                G20:{
                    label:'Uso del suelo y vegetaci&oacute;n 1:250 000 (2011)',
                    layers:{/*
                        c422:{
                            label:'Vegetaci&oacute;n densa',
                            synonymous:['vegetacion','denso'],
                            scale:0,
                            position:30,
                            active:false
                        },
                        c420:{
                            label:'Uso del suelo y vegetaci&oacute;n Serie I',
                            synonymous:['suelo','uso','vegetacion','serie'],
                            scale:433342,
                            position:31,
                            active:false
                        },
                        c421:{
                            label:'Uso del suelo y vegetaci&oacute;n Serie II',
                            synonymous:['suelo','uso','vegetacion','serie'],
                            scale:433342,
                            position:32,
                            active:false
                        },
                        c789:{
                            label:'Uso del suelo y vegetaci&oacute;n Serie III',
                            synonymous:['suelo','uso','vegetacion','serie'],
                            scale:433342,
                            position:33,
                            active:false
                        },
						c799:{
                            label:'Uso del suelo y vegetaci&oacute;n Serie IV',
                            synonymous:['suelo','uso','vegetacion','serie'],
                            scale:0,
                            position:34,
                            active:false,
                            time:true
                        }*/
                       cusv5:{
                            label:'Uso del suelo y vegetaci&oacute;n',
                            synonymous:['suelo','uso','vegetacion','serie'],
                            scale:0,
                            position:34,
                            active:false,
                            time:true,
							//metadato:'http://geoweb.inegi.org.mx/WSCBuscador/MuestraMetadatos.jsp?par1=55021&par2=INEGI1'
                        }
                    }
                },
                G21:{
                    label:'Zonas de protecci&oacute;n a la naturaleza 1:250 000 (2002-2006)',
                    layers:{
                        c425:{
                            label:'Zonas de veda',
                            synonymous:['vegetacion','denso'],
                            scale:0,
                            position:35,
                            active:false
                        }
                    }
                },
                G22:{
                    label:'Zonas de fango, de inundaci&oacute;n, arenosas y pantanosa 1:250 000 (1997-2007)',
                    layers:{
                        c423:{
                            label:'Zona arenosa',
                            synonymous:['zona','arena'],
                            scale:0,
                            position:36,
                            active:false
                        },
                        c426:{
                            label:'Zonas de fango',
                            synonymous:['zona','fango'],
                            scale:0,
                            position:37,
                            active:false
                        },
                        c424:{
                            label:'Zonas de inundaci&oacute;n',
                            synonymous:['zona','inundacion'],
                            scale:0,
                            position:38,
                            active:false
                        },
                        c428:{
                            label:'Zonas pantanosas',
                            synonymous:['zona','pantano'],
                            scale:0,
                            position:39,
                            active:false
                        }
                    }
                },
               
                
                G25:{
                    label:'Cobertura de Im&aacute;genes de sat&eacute;lite',
                    layers:{
                       
						c902:{
                            label:'Landsat5 2011',
                            synonymous:['land'],
                            scale:0,
                            position:105,
                            active:false
                        },
						c903:{
                            label:'Landsat8 2013',
                            synonymous:['land'],
                            scale:0,
                            position:106,
                            active:false
                        },
                        /*c901:{
                            label:'Spot',
                            synonymous:['spot'],
                            scale:0,
                            position:68,
                            active:false
                        },
						c811:{
                            label:'Geoeye',
                            synonymous:['rapid','eye','geoeye'],
                            scale:0,
                            position:100,
                            active:false
                        },*/
						c815:{
                            label:'Geoeye 2009 - 2010',
                            synonymous:['rapid','eye','geoeye'],
                            scale:0,
                            position:107,
                            active:false
                        },
						c816:{
                            label:'Geoeye 2011',
                            synonymous:['rapid','eye','geoeye'],
                            scale:0,
                            position:108,
                            active:false
                        },
						c817:{
                            label:'Geoeye 2012',
                            synonymous:['rapid','eye','geoeye'],
                            scale:0,
                            position:109,
                            active:false
                        },
						c818:{
                            label:'Geoeye 2013',
                            synonymous:['rapid','eye','geoeye'],
                            scale:0,
                            position:110,
                            active:false
                        },
						c819:{
                            label:'Geoeye 2014',
                            synonymous:['rapid','eye','geoeye'],
                            scale:0,
                            position:111,
                            active:false
                        },
						/*c810:{
                            label:'Rapideye',
                            synonymous:['rapid','eye','geoeye'],
                            scale:0,
                            position:101,
                            active:false
                        },*/
						c812:{
                            label:'Rapideye 2010',
                            synonymous:['rapid','eye'],
                            scale:0,
                            position:102,
                            active:false
                        },
						c813:{
                            label:'Rapideye 2011',
                            synonymous:['rapid','eye'],
                            scale:0,
                            position:103,
                            active:false
                        },
						c814:{
                            label:'Rapideye 2012',
                            synonymous:['rapid','eye'],
                            scale:0,
                            position:104,
                            active:false
                        }
                    }
                },
               
                G27:{
                    label:'Cat&aacute;logo de entidades, municipios y localidades',
                    layers:{
                        c790:{
                            label:'Localidades rurales vigentes',
                            synonymous:['localidad','rural','vigente'],
                            scale:433342,
                            position:88,
                            active:false,
                            texts:{
                                scale:433342,
                                active:false
                            }
                        },
                        c794:{
                            label:'Localidades rurales dadas de baja',
                            synonymous:['localidad','rural','vigente','dada','baja'],
                            scale:433342,
                            position:89,
                            active:false,
                            texts:{
                                scale:433342,
                                active:false
                            }
                        }
                    }
                },
                G29:{
                    label:'Humedales Potenciales (2007)',
                    layers:{
                        c787:{
                            label:'Humedales',
                            synonymous:['humedal','humedad'],
                            scale:0,
                            position:45,
                            active:false
                        }
                    }
                },
                G30:{
                    label:'Manglares (2007)',
                    layers:{
                        c788:{
                            label:'Manglares',
                            synonymous:['manglar'],
                            scale:0,
                            position:46,
                            active:false
                        }
                    }
                },
                G32:{
                    label:'Sitios RAMSAR (2007)',
                    layers:{
                        c800:{
                            label:'Humedales Potenciales RAMSAR',
                            synonymous:['humedad','potencial','ramsar'],
                            scale:0,
                            position:47,
                            active:false,
                            texts:{
                                scale:866685,
                                active:false
                            }
                        }
                    }
                },
                G33:{
                    label:'Fen&oacute;menos Geol&oacute;gicos',
                    layers:{
                        c460:{
                            label:'Colapso',
                            synonymous:['colapso','colap'],
                            scale:0,
                            position:90,
                            active:false,
			    time:false
                        },
			c461:{
                            label:'Erosi&oacute;n costera',
                            synonymous:['Erosion','costera'],
                            scale:0,
                            position:91,
                            active:false,
			    time:false
                        },
			c462:{
                            label:'Inundaci&oacute;n',
                            synonymous:['inundacion','encharcamiento'],
                            scale:0,
                            position:92,
                            active:false,
			    time:false
                        },
			c463:{
                            label:'Inundaci&oacute;n - &Aacute;rea',
                            synonymous:['inundacion','encharcamiento'],
                            scale:0,
                            position:48,
                            active:false
                        },
			c464:{
                            label:'Movimiento en masa',
                            synonymous:['movimiento','masa'],
                            scale:0,
                            position:93,
                            active:false
                        },
			c465:{
                            label:'Sismos',
                            synonymous:['sismo','temblor'],
                            scale:0,
                            position:94,
                            active:false,
			    time:false
                        },
			c466:{
                            label:'Subsidencia',
                            synonymous:['erosion','disolucion'],
                            scale:0,
                            position:95,
                            active:false,
			    time:false
                        }
						
                    }
                },
		G34:{
                    label:'Zonas Hidrogeol&oacute;gicas',
                    layers:{
                        c450:{
                            label:'Unidades hidrogeol&oacute;gicas',
                            synonymous:['unidades','geohidro','hidrogeo'],
                            scale:0,
                            position:49,
                            active:false
                        },
		        c451:{
                            label:'Vulnerabilidad acu&iacute;fera',
                            synonymous:['vulnera','acuifera'],
                            scale:0,
                            position:50,
                            active:false
                        },
			c452:{
                            label:'Curvas de igual elevaci&oacute;n del nivel est&aacute;tico',
                            synonymous:['curvas','elevacion','estatico'],
                            scale:866685,
                            position:63,
                            active:false,
			    texts:{
                                scale:216671,
                                active:false
                            }
                        },
			c453:{
                            label:'Estructuras geol&oacute;gicas',
                            synonymous:['estructuras','geologicas','estatico'],
                            scale:866685,
                            position:71,
                            active:false
                        },
			c454:{
                            label:'Flujo de aguas subterr&aacute;neas',
                            synonymous:['flujo','agua','subterranea'],
                            scale:54167,
                            position:96,
                            active:false
                        },
			c455:{
                            label:'Pozos',
                            synonymous:['pozo'],
                            scale:866685,
                            position:97,
                            active:false
                        },
			c456:{
                            label:'Manantiales',
                            synonymous:['mamantiales'],
                            scale:866685,
                            position:98,
                            active:false
                        },
			c457:{
                            label:'Norias',
                            synonymous:['norias'],
                            scale:866685,
                            position:99,
                            active:false
                        }
                    }
                }
            }
            
        }
    };
    var getData = function(source,params,callback,error,before,complete){
			var obj = this;
            //jQuery.ajaxSettings.traditional = true;
            var dataObject = {
                   data: params,
                   success:function(json,estatus){callback(json,estatus)},
                   beforeSend: function(solicitudAJAX) {
                        if ($.isFunction(before)){
                            before(params);
                        }
                   },
                   error: function(solicitudAJAX,errorDescripcion,errorExcepcion) {
                        if ($.isFunction(error)){
                            error(errorDescripcion,errorExcepcion);
                        }
                   },
                   complete: function(solicitudAJAX,estatus) {
                        if ($.isFunction(complete)){
                            complete(solicitudAJAX,estatus);
                        }
                   }
            };
            for (var x in source){ //anexo de la conifuracion del origen de datos
                if ( !(/field|name|id/.test(x)))dataObject[x] = source[x];
            }
            $.ajax(dataObject);
    };
    var getLiveLayers = function(dataSource,proyName,callback){
        var params = {proyName:proyName,where:''};
        getData(dataSource,params, 
            function(tdata){ //success
                var list = tdata.list;
                if (!(list === undefined) && list.length > 0){
                    var buscables = [];
                    var identificables = [];
                    var list = tdata.list;
                    for (var x in list){
                        if (list[x].tipo.indexOf('I') > -1){
                            identificables.push(list[x]);
                        }
                        if (list[x].tipo.indexOf('B') > -1){
                            buscables.push(list[x]);
                        }
                    }
                    data.buscables =buscables;
                    data.identificables =identificables;
                    if($.isFunction(callback))
                        callback({buscables:buscables, identificables:identificables});
                }
            },
            function(){},
            function(){
                if($.isFunction(callback))
                   callback(null);
            }
        );
    };
    data.getLiveLayers = getLiveLayers;
    return data;
});
