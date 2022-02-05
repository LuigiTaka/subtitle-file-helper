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
        let hasColor = SrtSubtitle.metadata.color;
    
        lines[0] = '\u200e'+SrtSubtitle.order;
        lines[1] = SrtSubtitle.timestamp.start+' --> '+SrtSubtitle.timestamp.end;

        let text = SrtSubtitle.text;
        if(hasColor){
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
            if(!row || !row.length){
                return Object.assign({},SrtSubtitle);
            }

            let lines = row.split("\n");
            const srt =  Object.assign({},SrtSubtitle);
            srt.order = Number.parseInt(lines.shift().replace(/\u200e/ui,'').trim() );
            let timestamps = lines.shift().split( '-->' ).map( t => t.trim() );
            srt.timestamp.start = timestamps[0];
            srt.timestamp.end = timestamps[1];
            srt.text = lines.join('\n')+"\n".replace(/\u200e/ui,'').trim();
            return srt;
        });
        return subtitles;
    }

    build(subtitles) { 
        let lines = [];
        for (const index in  subtitles) {
                let line = this.SrtSubtitle2String(subtitles[index]);
                lines.push( line );
        }
        return lines.join("\n\n");
    }

};