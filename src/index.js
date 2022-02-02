import SrtParser from './SrtParser';
import './../css/index.css';
import './../css/utils.css';

const get = (selector) => { 
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

const downloadFile = ({ filename,data,type }) => { 
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

const generateId = () => { 
    // @todo verificar se existe esse id e gerar outro caso sim.
    let id = Math.random().toString();
    return id;
}

const setFileLoaderOn = () => { 
    get("#file-description").text = 'Carregando...'
}

const setFileLoderOff = () => { 
    get("#file-description").text = 'Pronto.'
}

const handleFileContent = (file) => {
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
            window.location.href = '/public/edit.html?id='+contentId;
        },700);
    }
    read.readAsText(file); 
}

const dropHandler = (e) => { 
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

const highlight = () => { 
    $dropArea.classList.add('highlight')
}

const unhighlight = () => { 
    $dropArea.classList.remove('highlight')
};

const handlerFunction = (e) => {
    e.preventDefault()
    e.stopPropagation()
 };


const $novaLegendaBtn = get("#nova-legenda-wrapper");
const $dropArea = get("#drop-area");
const $dropAreaInput = get("#subtitle-file");
const parser = new SrtParser();

['dragenter', 'dragover'].forEach(eventName => {
    $dropArea.addEventListener(eventName, highlight, false)
});

['dragleave', 'drop'].forEach(eventName => {
    $dropArea.addEventListener(eventName, unhighlight, false)
});


function dragstart_handler(ev) {
    console.log("dragStart");
    ev.dataTransfer.setData("text", ev.target.id);
}

$novaLegendaBtn.addEventListener("click",() => { 
    let id = generateId();
    window.location.href = '/public/edit.html?id='+id;
});


$dropArea.addEventListener("click",(e) => { 
    $dropAreaInput.click();
});

$dropAreaInput.addEventListener("change",(e) => {
    const f = e.target.files[0];
    handleFileContent(f);
});

$dropArea.addEventListener('dragenter', handlerFunction, false)
$dropArea.addEventListener('dragleave', handlerFunction, false)
$dropArea.addEventListener('dragover', handlerFunction, false)
$dropArea.addEventListener('drop', dropHandler, false)
