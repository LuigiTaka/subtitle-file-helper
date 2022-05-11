class Legenda{ 

    constructor(texto,tempoInicial,tempoFinal, order = null){         
        this.texto = texto;
        this.order = order;
        this.tempo = { 
            comeco: tempoInicial,
            fim: tempoFinal
        };

        this.metadata = { };
    }

}


export default Legenda;