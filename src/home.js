import {get,generateId,handleFileContent,dropHandlercl} from './utils';

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
    window.location.href = '/edit.html?id='+id;
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
