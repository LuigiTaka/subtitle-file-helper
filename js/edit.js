import './../css/utils.css';
import './../css/edit.css';
alert("here ;)");

const renderListItem = (t) => {
    return `
    <li class='subtitle-list-item d-flex>
                        <div class="subtitle-timestamp d-flex flex-column">
                            <input type="text" v-model='${t.timestamp.start}'>
                            <input type="text" v-model='${t.timestamp.end}'>
                        </div>
                        <div class="subtitle-content flex-center">
                            ${t.text}
                        </div>
                        <div class='ml-auto text-light'>
                            ${t.order}
                        </div>
                    </li>
    `;
}

const getTracks = (id) => { 
    const content = window.localStorage.getItem(id+"_content");
    const json = JSON.parse(content);
    return json;
}

const id = "0.6981381395160569";

console.log(id);