window.edit = new Vue({
    el:"#app",
    data() {
        return {
            id:"0.6981381395160569",
            tracks: [],

        }
    },
    mounted() {
        if(this.id){
            this.setTracksContent(this.id);
        }
    },
    methods:{
        setEditMode: function(subtitle){
            console.log(subtitle)
        },
        setTracksContent: function(id) { 
            const content = window.localStorage.getItem(id+"_content");
            const json = JSON.parse(content);
            this.tracks = json;
        },

    }

})