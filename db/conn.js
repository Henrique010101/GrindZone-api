import mongoose from "mongoose";

async function main () {

    try {
        await mongoose.connect(`${process.env.DB_CONNECTION_STRING}`);

        console.log("Conexão com o Banco feita com sucesso!")

    } catch (error) {
        console.error(`Conexão com Banco falhou erro: ${error}`)
    }
}

export default main;