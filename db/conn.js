import mongoose from "mongoose";

async function main () {

    try {
        await mongoose.connect("mongodb+srv://henrique2003com:teste123456@grindzone-api.li4ofoh.mongodb.net/Produtos?retryWrites=true&w=majority&appName=GrindZone-api");

        console.log("Conexão com o Banco feita com sucesso!")

    } catch (error) {
        console.error(`Conexão com Banco falhou erro: ${error}`)
    }
}

export default main;