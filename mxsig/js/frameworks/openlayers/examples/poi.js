define(['OpenLayers','marker','modal'],function(OL,Marker,Modal) {    
    
    var Map;
    var modal;
    var init = function(){
        Map = arguments[0];
        modal = Modal.get();
        modal.declare({title:'Nuevo punto de intres',content:'nuevo punto de interes'});
        modal.show();
        
    }
    var module = (function(){
        var _item = {
            id:'',
            name:'',
            description:'',
            location:{
                lon:0,
                lat:0
            },
            hour:'',
            date:'',
            zoom:0,
            set:function(){
                var a = arguments[0];
                for(x in a){
                    this[x]=a[x];
                }
            },
            ubicate:function(){
                var l = this.location;
                var lonlat = new OL.LonLat(parseFloat(l.lon),parseFloat(l.lat));
                Map.map.setCenter(lonlat,this.zoom);
                //falta markcar como seleccionada
            }
        };
        return {
            declare:function(){
                _item.set(arguments);
            },
            locate:function(){
                _item.ubicate();
            }
        }
    }());
    
    var ModulePoi = (function(){
        var _poi = {
            idStorage:'Pois',
            reg:{},
            add:function(){
                var a = arguments[0];
                if(!this.find(a.id)){
                    var newPoi = jQuery.extend({},module);
                    newPoi.declare(a);
                    this.reg[a.id]=newPoi;
                }
            },
            del:function(){
                var a = arguments[0];
                if(this.find(a.id)){
                    delete this.reg[a.id];
                }
            },
            set:function(){
                var a = arguments[0];
                if(this.find(a.id)){
                    this.reg[a.id].declare(a);
                }
            },
            find:function(id){
                var exist = false;
                if(this.reg[id]){
                    exist=!exist;
                }
                return exist;
            },
            get:function(id){
               var response = null;
               if(this.find(a.id)){
                    response = this.reg[a.id];
               }
               return response;
            },
            store:function(){
                //store all pois
                
            },
            restore:function(){
                //restore information from storage
            },
            start:function(){
                Map.activeControl({control:'poi',active:true});
            },
            finish:function(){
                
            },
            replayModal:function(){
                Modal.show();
            }
            
        };
        return {
            add:function(){
                _poi.add(arguments[0]);
            },
            store:_poi.storeAll,
            start:_poi.start,
            finish:_poi.finish,
            modal:_poi.replayModal
        }
    }());
    
    return {
        add:ModulePoi.add,
        load:init,
        start:ModulePoi.start,
        finish:ModulePoi.finish,
        showModal:ModulePoi.modal
    }
});