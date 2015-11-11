define(function(){
    var sprite = {
		//base router from sprite
		zoologico:'zoologico',
		hospital:'hospital',
		iglesia:'iglesia',
		escuela:'escuela',
		ccomercial:'ccomercial',
		departamental:'departamental',
		autobus:'autobus',
		historico:'historico',
		hotel:'hotel',
		museo:'museo',
		restaurant:'restaurant',
		
		gasolinera:'gasolinera',
		
		banco:'banco',
		
		aeropuerto:'aeropuerto',
		
		edo:'edo',
		mun:'mun',
		loc:'loc',
		locurb:'loc-urb',
		ageb:'ageb',
		col:'col',
		mzn:'mzn',
		calle:'calle',
		dom:'dom',
		
		hidro:'hidro',
		geodesia:'geodesia',
		oro:'oro',
		
		//router class
		entidadfederativa:'edo',
		localidad:'loc',
		localidadurbana:'loc',
		localidadrural:'loc-urb',
		municipio:'mun',
		rasgoshidrograficos:'hidro',
		rasgosorograficos:'oro',
		domicilio:'dom',
		calles:'calle',
		colonia:'col',
		manzana:'mzn',
		marcasgeodesicas:'geodesia',
		restaurante:'restaurant',
		tiendadepartamental:'departamental',
		sitiohistorico:'historico',
		centraldeautobuses:'autobus',
		supermercado:'ccomercial'
		
		
/*		
            //construcciones--------------------------
            house:'house',
            appartment:'apartment',
            govBuilding:'govBuilding',
            school:'school',
            //caminos---------------------------
            road:'road',
            //simbolos urbanos---------------------------
            corner:'corner',
            blocks:'blocks',
            address:'address',
            
            calle:'address',
            //transporte---------------------------
            airplane:'airplane',
            bus:'bus',
            //razgos topograficos---------------------------
            water:'water',
            river:'river',
            lake:'lake',
            //tipos de lementos terrestres---------------------------
            isle:'isle',
            
            nombresdeareasnaturalesyculturales:'isle',
            //simbologia---------------------------
            star:'star'
*/        }
    var getIcon = function(text){
        var icon = '';
        var list = sprite;
        if (!(list[text] === undefined)){
            icon = 'mainSprite mainSprite-icon-'+list[text];
        }else{
            icon = 'mainSprite mainSprite-icon-loc-urb';
        }
        return icon;
    }
    return {list:sprite,getIcon:getIcon};
})