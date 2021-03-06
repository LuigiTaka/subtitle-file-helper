
const $saveTrackTrigger = get("#save-track");
const $downloadTrigger = get("#downloadBtn");
const $changeAllColorsTrigger = get("#change-all-colors");
const $filename = get("#filename");
const $saveAll = get("#save-all");
const $colorpickerWrapper = get("#all-colorpick-wrapper")
const $editAllColorpick = get("#all-colors");
const $editColorpick = get("#subtitle-color");
const $editTimestampStart = get("#timestamp-start");
const $editTimestampEnd = get("#timestamp-end");
const $editWrapper = get("#edit-area");
const $subtitleListWrapper = get("#subtitle-list");
const $editText = get('#subtitle-text');

const id = getParams().id;
const tracks = getTracks(id);
const metadata = getWorkareaMetadata(id);
let appData = {
    id: id,
    elements:{
        'saveAllList': $saveAll,
        'filename': $filename,
        'changeAllColorsTrigger': $changeAllColorsTrigger,
        'changeAllColors': $editAllColorpick,
        "download": $downloadTrigger,
        'editWrapper': $editWrapper,
        'editSaveSubtitle':$saveTrackTrigger,
        "editColor": $editColorpick,
        'editTimeStart': $editTimestampStart,
        'editTimeEnd': $editTimestampEnd,
        'editText': $editText,
        "listWrapper": $subtitleListWrapper,
        'lastListItem':null,
    },
    tracksMetadata: metadata,
    tracks:tracks,
    editData:undefined,
    templates:{
        listItem: (subtitle) => { 
            let cssStyle = '';
            if(subtitle.metadata.color){
                cssStyle = 'color:'+subtitle.metadata.color+";";
            }

            let text = subtitle.text;

            if(text.match(/<font/)){
                let regex = RegExp(/(<font (.*?)>|<\/font>)/,'g');
                text = text.replaceAll(regex,'').trim();
            }


            let template = `
            <div class="subtitle-timestamp d-flex flex-column">
                <input type="text" value='${subtitle.timestamp.start}' disabled>
                <input type="text" value='${subtitle.timestamp.end}' disabled>
            </div>
            <div class="subtitle-content flex-center" style='${cssStyle}'>
                ${text}
            </div>
            <div class='ml-auto text-light'>
                ${subtitle.order}
            </div>`;

            return template;
        }
    },
    start: async function(appData){
        appData.elements.editWrapper.classList.add("d-none");
        appData.elements.saveAllList.classList.add("d-none"); //esconde a funcionalidade de salvar todas as legendas.

        appData.elements.filename.value = appData.tracksMetadata.filename;
        appData.elements.filename.addEventListener('change',appData.updateFilenameHandler);

        let $listClone = appData.elements.listWrapper.cloneNode(true);
        $listClone.innerHTML = '';

        let editOrder = false;
        let $lastEdit = false;
        if(appData.editData){
            editOrder = appData.editData.order;
        }
        appData.tracks.forEach(subtitle => {
            let listItemString = appData.templates.listItem(subtitle);
            let $li = createElement(listItemString,'li');
            $li.classList.add("subtitle-list-item");
            $li.classList.add("d-flex");
            
            //define os dados da legenda para ser usado pelos eventos.
            $li.subtitleData = subtitle;
            $li.addEventListener("click",appData.startEditMode,true);
            $listClone.appendChild( $li );
            if( editOrder && subtitle.order === editOrder ){
                appData.elements.lastListItem = $li;
            }
         
        });

        appData.elements.listWrapper.parentNode.replaceChild($listClone,appData.elements.listWrapper);
        appData.elements.listWrapper = $listClone;

        appData.elements.download.addEventListener("click",appData.downloadHandler);
        appData.elements.changeAllColorsTrigger.addEventListener("click",appData.changeAllColorClickHandler);

        return appData;
    },
    updateFilenameHandler:function(e){
        let filename = e.target.value;
        appData.updateFilename(filename);
    },
    updateFilename: function(filename){
        appData.tracksMetadata.filename = filename;
        updateTrackMetadata(appData.tracksMetadata,appData.id);
    },
    changeAllColorClickHandler: function(e){
        appData.elements.changeAllColors.click();
        appData.elements.changeAllColors.addEventListener('change',appData.switchAllColorHandler);
    },
    switchAllColorHandler: function(e){
        let color = e.target.value;
        appData.tracks.forEach(sbt => {
            sbt.metadata.color = color;
        });
        updateTrack(appData.tracks,appData.id);
          
    },
    startCallback: function(app){
        if(app.elements.lastListItem){
            app.elements.lastListItem.click();
        }
        return;
    },
    downloadHandler: function(e){
        //carrega as legendas do localStorage e cria o arquivo.
        let parser = new SrtParser;
        let tracks = getTracks(appData.id);
        let filedata = parser.build( tracks );
        let filename = appData.tracksMetadata.filename;

        if(!filename.match(/\.srt$/)){
            filename = filename + ".srt";
        }
        downloadFile({
            filename:filename,
            data: filedata,
            type:'text'
        });
    },
    startEditMode: function(e) { 
        //da pra percorrer os elementos e pegar o primeiro com a chave que queremos, mas agora n??o.
        let editData = e.target.subtitleData || e.target.parentNode.subtitleData || e.target.parentNode.subtitleData;
        //espera a chave e.target.subtitleData;
        if(!editData){ 
            e.parentNode
            console.warn("subtitleData n??o encontrado.");
            console.log(e);
            console.groupEnd();
            throw Error("N??o h?? dados para come??ar a edi????o.");
        }
        let $save = appData.elements.editSaveSubtitle;
        $save.editData = editData;
        $save.addEventListener('click',appData.saveSubtitleHandler);

        $changeElements = [
            { type: 'start', el: appData.elements.editTimeStart, value: editData.timestamp.start },
            {type:'end', el: appData.elements.editTimeEnd, value: editData.timestamp.end },
            {type:"text",el: appData.elements.editText, value: editData.text},
            {type:'color',el: appData.elements.editColor, value: editData.metadata.color||''}
        ];

        appData.prepareEditElements($changeElements,editData).then(()=>{
            appData.elements.editWrapper.classList.remove("d-none");
        });
       
    },
    prepareEditElements: async function(elements,editData){
        elements.forEach((data,index) => { 
            data.el.dataset.type = data.type;
            data.el.value = data.value;
            data.el.editData = editData;
            if(data.type == 'color'){
                data.el.select();
                data.el.editData = editData;
            }
            data.el.addEventListener("change",appData.subtitleChangeHandler);
        });
    },
    subtitleChangeHandler: (e) => { 
        console.info("change handler");
        let type = (e.target.dataset.type);
        let value = e.target.value;
        //@todo adicionar valida????es para os campos
        switch (type) {
            case 'color':
                e.target.editData.metadata.color = value;
                break;
            case 'end':
            case 'start':
                e.target.editData.timestamp[type] = value;
                break;
            case 'text':
                e.target.editData.text = value;
                break;
            default:
                throw Error("Tipo "+type+" n??o mapeado para a edi????o.");
                break;

        }
    },
    saveSubtitleHandler: (e) => { 
        let editData = e.target.editData;
        appData.saveSubtitle(editData).then(() => { 
            appData.editData = editData;
            appData.start( Object.assign({},appData) ).then( (app) => { 
                console.info("start callback wraper");
                console.log(app);
                appData.startCallback(app);
            } );
        });
       
    },
    saveSubtitle:async  function(newSubtitle){ 
        console.info("saveSubtitle");
        let current = appData.tracks.find( x => x.order === newSubtitle.order );
        current = Object.assign(current,newSubtitle);
        return updateTrack(appData.tracks,appData.id);
    }
}

if(!appData.tracks && !appData.tracks.lenght){
    throw Error("N??o existe nenhuma legenda com o identificador: " + appData.id);
}

let t = appData.start(appData);
console.log(t);