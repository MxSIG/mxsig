$.widget( "custom.lightGallery", {
      id:'',
      // default options
      options: {
        data:[]
      },
 
      // the constructor
      _create: function() {
        var obj = this;
        obj.id = obj.element.attr('id');
        
        this.element
          // add a class for theming
          .addClass( "custom-lightGallery" )
          // prevent double click to select text
          .disableSelection();
 
            var data = obj.options.data;
            var list = data.imagenes;
            var name = data.title;
            var id = data.id;
            var lcadena = '<div class="lightGallery-gallery-imgList">';
            for (var x in list){
                var item = list[x];
                lcadena+= '<a href="'+item.imagen+'" rel="'+id+'" class="lightGallery-imageItem lightgallery-shadow" title="'+name+' '+item.titulo+'">';
                lcadena+= ' <img src="'+item.thumb+'" alt="'+name+' '+item.titulo+'">';
                lcadena+= '</a>';
            }
            lcadena+= '</div>';
            
            $('#dinamicPanel_lightGallery_main').remove();
            var cadena = '';
                cadena+= '  <div class="ui-widget-overlay"></div>';
                cadena+= '  <div class="lightGallery-logo"><div class="lightGallery-sprite lightGallery-mainlogo"></div></div>';
                cadena+= '  <div class="lightGallery-gallery-header lightgallery-shadow">';
                cadena+= '      <div class="lightGallery-gallery-title">'+name+'</div>';
                cadena+= '      <span id="lightGallery_gallery_close" class="lightGallery-sprite lightGallery-close"></span>';
                cadena+= '  </div>';
                cadena+= '  <div class="lightGallery-gallery-container">'+lcadena+'</div>';
                cadena+= '';
                
            $('#'+obj.id).append(cadena);
            $(".lightGallery-imageItem").fancybox({
                  prevEffect		: 'none',
                  nextEffect		: 'none',
                  closeBtn		: true,
                  helpers		: {
                      title	: { type : 'inside' },
                      buttons	: {}
                  }
              });

            
            $('#lightGallery_gallery_close').click(function(e){
               $('#'+obj.id).remove();
               e.stopPropagation(); 
            });
        
        this._refresh();
      },
 
      // called when created, and later when changing options
      _refresh: function() {
        // trigger a callback/event
        this._trigger( "change" );
      },
 
      // events bound via _on are removed automatically
      // revert other modifications here
      _destroy: function() {
        // remove generated elements
        this.changer.remove();
 
        this.element
          .removeClass( "custom-lightGallery" )
          .enableSelection()
          .css( "background-color", "transparent" );
      },
 
      // _setOptions is called with a hash of all options that are changing
      // always refresh when changing options
      _setOptions: function() {
        // _super and _superApply handle keeping the right this-context
        this._superApply( arguments );
        this._refresh();
      },
 
      // _setOption is called for each individual option that is changing
      _setOption: function( key, value ) {
        this._super( key, value );
      }
    });