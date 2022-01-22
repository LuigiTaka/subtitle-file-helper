const SrtSubtitle = {
    text:'',
    timestamp:{start:null,end:null},
    order:null,

};


class SrtParser  { 

    lines

    constructor() {
        this.SrtPattern = new RegExp(/\n\s*\n/,'iu');    
    }
    
    SrtSubtitle2String(SrtSubtitle){ 
        console.log(SrtSubtitle)
        let lines = [ ];
        for (const key in SrtSubtitle) {
            let line = SrtSubtitle[key];
            if(key === 'timestamp'){
                line = SrtSubtitle[key].start+' --> '+SrtSubtitle[key].end;
            }

            lines.unshift( line )
        }
        lines[0] = '\u200e'+lines[0];
        return lines.join('\n');
    }

    parse ({content}) { 
        const rawSubtitles = content.split(this.SrtPattern);
        const subtitles = rawSubtitles.map( (row) => { 
            let lines = row.split("\n");
            const srt =  Object.assign({},SrtSubtitle);
            srt.order = Number.parseInt(lines.shift().replace(/\u200e/,'').trim() );
            let timestamps = lines.shift().split( '-->' ).map( t => t.trim() );
            srt.timestamp.start = timestamps[0];
            srt.timestamp.end = timestamps[1];
            srt.text = lines.join('\n')+"\n";
            return srt;
        });
        return subtitles;
    }

    build(subtitles) { 
        let lines = [];
        for (const index in  subtitles) {
            console.log(index)
                let line = this.SrtSubtitle2String(subtitles[index]);
                lines.push( line );
        }
        return lines.join('\n\n');
    }

};