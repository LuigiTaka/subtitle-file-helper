class WebVTT{


    build(subtitles) {
        let lines = this.subtitleObject2string(subtitles);
        return lines.join("\n\n");    
    }

    subtitleObject2string(subtitles) { 
        let lines = [];
        for (const index in  subtitles) {
                let line = this.srt2Vvtt(subtitles[index]);
                lines.push( line );
        }
        return lines
    }


    srt2Vvtt(SrtSubtitle){
        let lines = [ ];
        let hasColor = undefined;
        if(SrtSubtitle.hasOwnProperty('metadata') && SrtSubtitle.metadata.hasOwnProperty("color")){
            hasColor = SrtSubtitle.metadata.color;
        }
        
        lines[0] = SrtSubtitle.order;
        lines[1] = SrtSubtitle.timestamp.start.replace(/,/,'.')+' --> '+SrtSubtitle.timestamp.end.replace(/,/,'.');

        let text = SrtSubtitle.text;
        // if(hasColor){
        //     // pode não funcionar em todos os players. VLC funciona.
        //     let regex = new RegExp(/(<font (.*?)>|<\/font>)/,'g');
        //     text = text.replaceAll(regex,''); //remove tags de fonte caso tenha.
        //     text = `<font color="${SrtSubtitle.metadata.color}" >${text}</font>`;
        // }

        lines[2] = text;
        return lines.join('\n');
    }
}


