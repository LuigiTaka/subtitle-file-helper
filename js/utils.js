const trackStorageId = (track) => "subtitle-order-"+track.order;


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



 function get(selector) { 
    const token = selector.substr(0,1);
    selector = selector.substr(1);
    let $els = null;

    if(token === '.'){
        $els = window.document.getElementsByClassName(selector);
    }else if(token === '#'){
        $els = window.document.getElementById(selector);
    }else{
        throw Error('Seletor: '+selector+" inválido. Esperado # ou . recebeu: "+token);
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

 function setFileLoaderOn()  { 
    get("#file-description").text = 'Carregando...'
}

 function setFileLoderOff() { 
    get("#file-description").text = 'Pronto.'
}

 function handleFileContent(file) {
    let read = new FileReader();    
    setFileLoaderOn();
    window.cfile = file;
    read.onload = function(event) {
        event.preventDefault() 
        const content = event.target.result;
        const contentId = generateId();
    
        let lines = parser.parse( {content:content} );  
        lines = JSON.stringify(lines);
        window.localStorage.setItem(contentId + "_content",lines);
        setTimeout(() => { 
            setFileLoderOff();
            window.location.href = '/edit.html?id='+contentId;
        },700);
    }
    read.readAsText(file); 
}

 function dropHandler (e) { 
    let dt = e.dataTransfer
    let file = null;
    if (e.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < 1; i++) {
        // If dropped items aren't files, reject them
             if (e.dataTransfer.items[i].kind === 'file') {
                 file = e.dataTransfer.items[i].getAsFile();
                console.log('... file[' + i + '].name = ' + file.name);
            }
        }
    }
    handleFileContent(file);
    
}