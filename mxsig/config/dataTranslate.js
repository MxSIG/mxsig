requirejs.config({
    paths: {
        dataSource:'../config/dataSourceConfig'
    }
});
define(['dataSource'],function(dataSource){
	var params = function(data,type){
		var jsonData;
		switch (type){
				case 'search':
					var jsonData = $.extend(true,{},dataSource.deepSearchTranslate);
					jsonData.params.searchCriteria = data.q;
				break;
				case 'category':
					var jsonData = $.extend(true,{},dataSource.deepSearchTranslate);
					jsonData.params.searchCriteria = data.q;
					jsonData.params.whereTipo = data.fq[1].split(':')[1].replace(/"/g, '');
				break;
		}
		return jsonData;
	};
	var results = function(data,type){
		var response = {};
		switch (type){
				case 'search': case 'category':
					var dList = data.data.value;
					var total = (dList == null)?0:data.data.totalFields;
					var tList = data.data.types;
					var  rList = [];
					var  hList = {};
					//extrae los resultados
					for (var x in dList){  
						var fields = dList[x].fields.fields;
						var record = {};
						for (var y in fields){
							var field = fields[y];
							record[field.aliasName.toLowerCase()] = field.value;
							if(field.aliasName.toLowerCase() == 'busqueda'){
								
							}
						}
						var hl_record = {};
						hList[record.gid] = {'busqueda':record.busqueda};
						rList.push(record);
					}
					var tipoList = [];
					for (var x in tList){
						tipoList.push(tList[x]);
						tipoList.push(1);
					}
					var response = {
									"responseHeader":{
									  "status":0,
									  "QTime":0
									 },
									 "response":{
									  "numFound":total,
									  "start":0,
									  "docs":rList
									 },
									 "facet_counts":{
										  "facet_queries":{
										  },
										  "facet_fields":{
											 "tipo":tipoList
										  },
										  "facet_dates":{
										  },
										  "facet_ranges":{
										  }
									 },
									 "highlighting":hList
									}
			break;
		}
		return response;
	};
	
	return {params:params, results:results};
})