const $novaLegendaBtn = get("#nova-legenda-wrapper");
const $dropArea = get("#drop-area");
const $dropAreaInput = get("#subtitle-file");
const parser = new SrtParser(); 


let app = { 
    editHistory: [],
    parser:parser,
    elemenets:{
        dropArea: $dropArea,
        dropAreaInput: $dropAreaInput,
        novaLegenda:$novaLegendaBtn,
    },
    start:function(app){
        console.info("starting");
        app.setHandlers(app);
    },
    setHandlers:function(app) { 
        let $dropArea = app.elemenets.dropArea,
            $dropAreaInput = app.elemenets.dropAreaInput;

        ['dragenter', 'dragover'].forEach(eventName => {
            $dropArea.addEventListener(eventName, app.highlight($dropArea), false)
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            $dropArea.addEventListener(eventName, app.unhighlight($dropArea), false)
        });
        $dropArea.addEventListener('drop', app.handlers.dropHandler, false)         
        $dropArea.addEventListener("click",(e) => { 
            app.handlers.dropArealClick(e);
        });

        $dropAreaInput.addEventListener("change",(e) => {
            app.handlers.dropAreaInputChange(e);
        });
        
        $dropArea.addEventListener('dragenter', app.handlers.genericDropHandler, false)
        $dropArea.addEventListener('dragleave', app.handlers.genericDropHandler, false)
        $dropArea.addEventListener('dragover', app.handlers.genericDropHandler, false)
        app.elemenets.novaLegenda.addEventListener('click',app.handlers.novaLegenda);
        
    },
    handlers:{
        genericDropHandler:(e) => {
            e.preventDefault();
            e.stopPropagation();
        },
        dragStart:(e) => {
            console.log("dragStart");
            e.dataTransfer.setData("text", ev.target.id);
        },
        dropAreaInputChange: (e) => {
            const f = e.target.files[0];
            app.handleFileContent(f);
        },
        dropArealClick:(e) => { 
            $dropAreaInput.click();
        } ,
        dropHandler:(e) => { 
            let file = null;
            if (e.dataTransfer.items) {
                // Use DataTransferItemList interface to access the file(s)
                for (var i = 0; i < 1; i++) {
                // If dropped items aren't files, reject them
                     if (e.dataTransfer.items[i].kind === 'file') {
                         file = e.dataTransfer.items[i].getAsFile();
                    }
                }
            }
            if(!file){
                console.log(file);
                throw Error("Arquivo vazio.");
            }


            app.handleFileContent(file);
            
        },
        novaLegenda:(e) => {
            alert("Não foi implementado.");
            return;
            let id = generateId();
            window.location.href = '/public/edit.html?id='+id;
        }
    },
    highlight($el) { 
        $el.classList.add('highlight')
    },

    unhighlight($el) { 
        $el.classList.remove('highlight')
    },
    handleFileContent(file)  {
        let read = new FileReader();    
        app.setFileLoaderOn();
        read.onload = function(event) {
            event.preventDefault() 
            const content = event.target.result;
            const contentId = generateId();
            
            let lines = app.parser.parse( {content:content} );
            return;
            lines = JSON.stringify(lines);
            window.localStorage.setItem(contentId + "_content",lines);
            
            window.localStorage.setItem(contentId + "_metadata",JSON.stringify({
                filename: file.name,
                id: contentId,
            }));
    
            setTimeout(() => { 
                app.setFileLoderOff();
                window.location.href = '/public/edit.html?id='+contentId;
            },700);
        }
        read.readAsText(file); 
    },
    setFileLoaderOn() { 
        get("#file-description").text = 'Carregando...'
    },
    setFileLoderOff() { 
        get("#file-description").text = 'Pronto.'
    }
}

const dragStart = app.handlers.dragStart;
const dropHandler = app.handlers.dropHandler;

app.start(app);