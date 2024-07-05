class ErrorBase extends Error {
    constructor (mensagem = "Erro interno do servidor", status = 500) {
        super();
        this.message = mensagem;
        this.status = status;
    }

    enviarReposta(res) {
        res.status(this.staus).send({
            mensagem: this.message,
            status: this.status
        })
    }
}

export default ErrorBase;
