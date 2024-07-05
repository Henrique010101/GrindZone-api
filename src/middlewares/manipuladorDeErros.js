import mongoose from "mongoose";
import ErrorBase from "../erros/ErrorBase.js";
import RequisicaoIncorreta from "../erros/RequisicaoIncorreta.js";
import ErroValidacao from "../erros/ErrorValidacao.js";

function manipuladorDeErros(erro, req, res, next) {
    if (erro instanceof mongoose.Error.CastError) {
        new RequisicaoIncorreta().enviarReposta(res);
    } else if (erro instanceof mongoose.Error.ValidationError) {
        new ErroValidacao(erro).enviarReposta(res);
    } else {
        new ErrorBase().enviarReposta(res);
    }
}

export default manipuladorDeErros;