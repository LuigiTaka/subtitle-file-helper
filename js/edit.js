

const renderListItem = (t,options) => {
    const $li = document.createElement("li");
    $li.classList.add("subtitle-list-item");
    $li.classList.add("d-flex");

    $li.addEventListener("click",(e) => { 
        options.onClick(e,options.track);
    });

    $li.innerHTML =  `
                        <div class="subtitle-timestamp d-flex flex-column">
                            <input type="text" value='${t.timestamp.start}'>
                            <input type="text" value='${t.timestamp.end}'>
                        </div>
                        <div class="subtitle-content flex-center">
                            ${t.text}
                        </div>
                        <div class='ml-auto text-light'>
                            ${t.order}
                        </div>
    `;
    return $li;
}

const getTracks = (id) => { 
    const content = window.localStorage.getItem(id+"_content");
    const json = JSON.parse(content);
    return json;
}

const renderEditMode = (editData) => { 
    const $textarea = document.getElementById("subtitle-text");
    $textarea.innerText = editData.text;

    $textarea.addEventListener('change',(e) => {
        //dispara apenas quando o foco sai do elemento
        let  text = e.target.value;
        editData.text = text;
    });

    let $saveTrackTrigger = get("#save-track");
    $saveTrackTrigger.addEventListener("click",(e) => { 
        saveTrack( editData );
    });

}
let params = getParams();

const id = params.id;
const tracks = getTracks(id);
const EditData = { 
    text:'',
    timestamp:{start:'',end:''},
    order:"",
    oldText:'',
};

const onListItemClick = (e,track) => { 
    let edit = Object.assign(EditData,track);
    renderEditMode(edit);


}

const $saveTrackTrigger = get("#save-track");
const $downloadTrigger = get("#downloadBtn");

const saveTrack = (track) => {
    //carrega a legenda do localStorage... 
    const target = tracks.find( x => x.order === track.order );
    let updated = Object.assign(target,track);
    updated = updateTrack(tracks,id);
    renderList( tracks,renderConfig );
}



const downloadSubtitle = (id) => { 
    //will load all subtitles from localStorage and bind then in one  single file.
    let tracks = getTracks(id);
    let parser = new SrtParser;
    let content = parser.build( tracks );
    downloadFile({
        filename: 'subtitle.srt',
        data: content,
        type:'text',
    })

}

$downloadTrigger.addEventListener('click',(e) => {
    downloadSubtitle( id );
})

const renderList = (tracks,{ itemConfig,target }) => {
    target.innerHTML = '';
    tracks.forEach(element => {
        let config = Object.assign({},itemConfig);
        config.track = element;
        let $el = renderListItem(element,config);
        target.appendChild($el);
    });
}


$list = document.getElementById("subtitle-list");

const renderConfig = { 
    itemConfig: {onClick: onListItemClick,track:null },
    target:$list,
}; 

renderList( tracks,renderConfig );