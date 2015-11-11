define([],function() {    
    
    var moduleWindow =(function(){
        var _window={
            root:arguments[0].root,
            data:{
                id:arguments[0].id,
                title:'',
                content:'',
                events:null
            },
            created:false,
            declare:function(){
                var a = arguments[0];
                for(x in a){
                    this.data[x]=a[x];
                }
            },
            assingEvents:function(){
                var id=this.data.id;
                $("#"+id+"_btnClose").click(function(){
                    $("#"+id).fadeIn();
                    $("#"+id+"_blocker").fadeOut();
                });  
            },
            getInterface:function(){
                var i = this.data;
                var chain = '<div id="'+i.id+'_blocker" class="ui-widget-overlay" style="display:none"></div>'+
                            '<div id="'+id+'" style="display:none" class="Modal" style="top:-50%">'+
                                '<div align="center" class="titleOL" style="border-bottom:solid #CCCCCC 2px;">'+
                                    '<div align="left" id="'+i.id+'_title">'+i.title+'</div>'+
                                    '<span title="cerrar" id="'+i.id+'_btnClose" class="closeLineTime ui-icon ui-icon-circle-close"></span>'+
                                '</div>'+
                                '<div id="'+id+'_content" align="center" class="contOL">'+
                                    i.content+
                                '</div>'+
                            '</div>';
            },
            build:function(){
                $("#"+this.root).append(this.getInterface());
            },
            show:function(){
                var i=this.data.id;
                $("#"+id).fadeIn();
                $("#"+id+"_blocker").fadeIn();
            },
            hide:function(){
                $("#"+this.data.id+"_blocker").click();
            },
            setTitle:function(){
                this.data.title = arguments[0];
                $("#"+this.data.id+"_title").html(this.data.title);
                
            },
            run:function(){
                if(!this.created){
                    this.build();
                    if(this.data.events!=null){
                        this.data.events();
                    }
                }
                this.show();
            }
        }
        return {
            declare:_window.declare,
            show:_window.show,
            hide:_window.hide,
            setAttr:function(){
                switch(arguments[0]){
                    case 'title':
                            _window.setTitle(arguments[1]);
                        break;
                }
            }
        }
    }())
    var moduleModal = (function(){
        var _modal = {
            root:'map',
            idModal:'Modal',
            counter:0,
            getId:function(){
                this.counter+=1;  
                return this.idModal+this.counter;  
            },
            getModal:function(){
                var data = {id:this.idModal(),root:this.root};
                return jQuery.extend({},moduleWindow(data));
            }
        };
        return {
            get:_modal.getModal
        }
    }());
    
    return {
        show:moduleModal.get
    }
});