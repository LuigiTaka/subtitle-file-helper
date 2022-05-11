import Legenda from 'Legenda.js';

class SrtParser{ 
    //@todo renomear arquivo para SrtParser


    constructor(){ 
        //especificos para esse tipo de legenda, talvez(?)
        this.separadorBlocoDeLegenda = new RegExp(/\n\s*\n/,'iu');    
        this.charInicialBloco =  "\u200e";
        this.charInicialBlocoDeLegendaRegex = new RegExp(this.charInicialBloco);
    }

    getBlocosDeLegenda(content){ 
        return content.split( this.separadorBlocoDeLegenda );
    }

    /**
     * A ideia é que outros Parsers retornem todas as legendas usando o parse, deixando a lógica para
     * extdrair os dados sem relevancia para quem consome.
     * expor isso no constructor direto?
     */
    parse(content) {

        const blocosDeLegenda = this.getBlocosDeLegenda(content);
        let quantidadeBlocos = blocosDeLegenda.length;

        let output = [];


        for(let legendaIndex = 0; legendaIndex < quantidadeBlocos;legendaIndex++){ 

            let bloco = blocosDeLegenda[legendaIndex];

            if(!bloco || bloco === undefined || !bloco.length){ 
                //não tem nada não faz nada
                continue;
            }

            let lines = bloco.split("\n"); //não sei se funciona com todas as quebras de linha :p
            //estrutura do .srt é:
            //ordem da legenda
            //comecço --> fim
            //legenda
            //?legenda...

            //remove o primeiro item da linha remove o caractere "invisivel" \u200e 
            let order = Number(lines.shift().replace(  this.charInicialBlocoDeLegendaRegex,'').trim());
            //remove agora o tempo da legenda e pega as partes pelo separador utilizado 
            let timestamps = linhes.shift().split("-->").map( t => t.trim() );
            let texto = lines.join( "\n" ) + "\n".trim();

            let legenda = this.createLegenda( texto,timestamps[0], timestamps[1], order );
            output.push( legenda );

        }
        return output;
    }

    /**
     * A ideia é criar o objeto de legenda com os dados necessários  e adicionar um método para 
     * gerar a string da legenda.
     */
        createLegenda(texto,tempoInicial,tempoFinal, ordem) { 
        let legenda = new Legenda( texto,tempoInicial,tempoFinal, ordem);
        return { 
            legenda: legenda,
            toString: function( legenda ) { 
                let lines = [];
                //@todo pode ter coisas relacionadas a estilo aqui, como tags de cor e afins
                lines[0] = this.charInicialBloco + legenda.order;
                lines[1] = legenda.tempo.comeco + "-->" + legenda.tempo.fim;
                lines[2] = legenda.texto;
                return lines.join("\n");
            }

        }   
    }


}


export default Parser;