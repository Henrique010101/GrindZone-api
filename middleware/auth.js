import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;

    // Se o token não existir, ainda assim prosseguir para a rota
    if (!token) {
        // Ao invés de retornar um erro, vamos passar para o próximo middleware
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // Salva o ID do usuário no request
        next(); // Continua para o próximo middleware ou rota
    } catch (error) {
        console.error('Erro de autenticação:', error);
        // Se o token for inválido, ainda assim vamos permitir que a verificação de sessão funcione
        return next();
    }
};

export default authMiddleware;