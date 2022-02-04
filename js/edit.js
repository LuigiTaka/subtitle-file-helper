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
}

const id = "0.6981381395160569";

console.log("Render example: "+id);


const EditData = { 
    text:'',
    timestamp:{start:'',end:''},
    order:"",
    oldText:'',
};

const onListItemClick = (e,track) => { 
    console.info("on click handler");
    console.log(track);
    let edit = Object.assign(EditData,track);
    renderEditMode(edit);

}

const tracks = getTracks(id);
console.log(tracks);

$list = document.getElementById("subtitle-list");



tracks.forEach(element => {
    let $el = renderListItem(element,{ onClick: onListItemClick,track:element });
    $list.appendChild($el);
});