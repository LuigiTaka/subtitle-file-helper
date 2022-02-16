const trackStorageId = (track) => "subtitle-order-"+track.order;

function getAppHistory() {
    let appHistory = JSON.parse(window.localStorage.getItem("app_history"));
    if(!appHistory){
        return [];
    }
    return appHistory;
}

function addAppHistory(id){
    let history = getAppHistory();
    history.push(id);
    return window.localStorage.setItem("app_history",JSON.stringify(history));
}

function createElement(template,wrapperTag = 'div') { 
    const $wrapper = document.createElement(wrapperTag);
    $wrapper.innerHTML = template;
    return $wrapper;
}

function deleteTrack(id){
    [ id+"_content", id+"_metadata" ].forEach( id => { 
        window.localStorage.removeItem(id);
    } );

    let history = getAppHistory();
    history = history.filter( x => x !== id );
    history = JSON.stringify(history);
    window.localStorage.setItem("app_history",history);
}

function getTracks(id){
    if(!id){
        throw Error("id da legenda  não informado.")
    }
    let data = JSON.parse(window.localStorage.getItem(id+"_content"));
    return data;
}

function getParams (url = window.location) {
	let params = {};
	new URL(url).searchParams.forEach(function (val, key) {
		if (params[key] !== undefined) {
			if (!Array.isArray(params[key])) {
				params[key] = [params[key]];
			}
			params[key].push(val);
		} else {
			params[key] = val;
		}
	});
	return params;
}

function getWorkareaMetadata(id) { 
    let data = window.localStorage.getItem(id+"_metadata");
    let json = JSON.parse(data);
    return json;
}

function getTrackByOrder(order) {
    const key = trackStorageId({order:order});
    let item = window.localStorage.getItem(key);
    if(!item){
        return false;
    }

    return item;
}

function updateTrack(tracks,id) {
    const strId = id+"_content";
    const data = JSON.stringify(tracks);
    return window.localStorage.setItem( strId,data );
}

function updateTrackMetadata(metadata,id){
    id = id+"_metadata";
    const data = JSON.stringify(metadata);
    return window.localStorage.setItem(id,data);
}


 function get(selector) { 
    const token = selector.charAt(0);
    let $els = null;
    let isTag = false;
    if(token === '.'){
        $els = window.document.getElementsByClassName(selector.substr(1));
    }else if(token === '#'){
        $els = window.document.getElementById(selector.substr(1));
    }else{
        isTag = true;
        $els = window.document.getElementsByTagName(selector);
    }

    if(isTag && $els.length === 0){
        throw Error(`Nenhuma tag: ${selector} encontrada.`);
    }else if(!isTag && $els.length === 0) {
        throw Error(`Nehum seletor:${token}${selector}  encontrado.`);
    }

    return $els;
}

 function downloadFile({ filename,data,type }) { 
    let file = new Blob([data],{type:type});
    if (window.navigator.msSaveOrOpenBlob) {  /* IE10+*/
        window.navigator.msSaveOrOpenBlob(file, filename);
    }else{ 
        const url = URL.createObjectURL(file),
        anchor = document.createElement('a');

        anchor.href = url;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        setTimeout(function() {
            document.body.removeChild(anchor);
            window.URL.revokeObjectURL(url);  
        }, 1);
    }
}

 function generateId(){ 
    // @todo verificar se existe esse id e gerar outro caso sim.
    let id = Math.random().toString();
    return id;
}