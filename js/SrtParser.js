const SrtSubtitle = {
    text:'',
    timestamp:{start:null,end:null},
    order:null,
    metadata:{
        color:null,
    }

};


class SrtParser  { 

    lines

    constructor() {
        this.SrtPattern = new RegExp(/\n\s*\n/,'iu');    
        this.SrtStartCharacter = "\u200e";
    }
    
    SrtSubtitle2String(SrtSubtitle){
        let lines = [ ];
        let hasColor = undefined;
        if(SrtSubtitle.hasOwnProperty('metadata') && SrtSubtitle.metadata.hasOwnProperty("color")){
            hasColor = SrtSubtitle.metadata.color;
        }
        
        lines[0] = '\u200e'+SrtSubtitle.order;
        lines[1] = SrtSubtitle.timestamp.start+' --> '+SrtSubtitle.timestamp.end;

        let text = SrtSubtitle.text;
        if(hasColor){
            // pode não funcionar em todos os players. VLC funciona.
            let regex = new RegExp(/(<font (.*?)>|<\/font>)/,'g');
            text = text.replaceAll(regex,''); //remove tags de fonte caso tenha.
            text = `<font color="${SrtSubtitle.metadata.color}" >${text}</font>`;
        }

        lines[2] = text;
        return lines.join('\n');
    }

    splitFileContent(content) { 
        return content.split(this.SrtPattern);
    }

    parse ({content}) { 
        const rawSubtitles = this.splitFileContent(content);
        const subtitles = rawSubtitles.map( (row) => { 
            let srt =  Object.assign({},SrtSubtitle);
            if(row === undefined || !row || !row.length){
                return srt;
            }
            
            let lines = row.split("\n");
            srt.order = Number.parseInt(lines.shift().replace(/\u200e/ui,'').trim() );
            let timestamps = lines.shift().split( '-->' ).map( t => t.trim() );
            srt.timestamp.start = timestamps[0];
            srt.timestamp.end = timestamps[1];
            srt.text = lines.join('\n')+"\n".replace(/\u200e/ui,'').trim();
            
            let text = srt.text;
        
            if(text.match(/<font/)){
                let regex = RegExp(/(<font (.*?)>|<\/font>)/,'g');
                let match = text.match(regex);
                let color = match[0];
                color = color.match(/#\w{6}\b/)[0];
                srt.metadata.color = color;
            }
            
            return JSON.parse(JSON.stringify(srt));
        },this);
        return subtitles;
    }

    subtitleObj2string(subtitles){
        let lines = [];
        for (const index in  subtitles) {
                let line = this.SrtSubtitle2String(subtitles[index]);
                lines.push( line );
        }
        return lines
    }

    build(subtitles) { 
        this.subtitleObj2string(subtitles);
        return lines.join("\n\n");
    }

};