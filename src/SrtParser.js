const SrtSubtitle = {
    text:'',
    timestamp:{start:null,end:null},
    order:null,

};


export default class SrtParser  { 

    lines

    constructor() {
        this.SrtPattern = new RegExp(/\n\s*\n/,'iu');    
        this.SrtStartCharacter = "\u200e";
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
            console.log(index)
                let line = this.SrtSubtitle2String(subtitles[index]);
                lines.push( line );
        }
        return lines.join('\n\n');
    }

    getTimestampObj({timestamp}){ 
        const start = timestamp.start,
        end = timestamp.end;
    }

    timestampParse(timestamp){ 
        
        let parts = timestamp.split(':');
        let last = parts.pop();
        last = last.split(',');
        parts.push( ...last);
        let t = {hour :  parts[0],minute : parts[1],second:  parts[2],ms : parts[3] };
        console.log(t);
    }

    editTimestamp( { queue,target } ){
        const subtitleOrderBefore = target.order - 1,
            subtitleOrderAfter = traget.order + 1;
        let before = queue.find( (item) => { item.order === subtitleOrderBefore  } );    
        let after = queue.find( (item) => item.order === subtitleOrderAfter );


        if(before){
            //modify the endpoint of the subtitle half of the time that was added or subtracted of the target subtitle
        }

        if(after){ 
            //modify the startpoint of the subtitle half of the time that was added or subtracted of the target subtitle
        }
          
    }

};