import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token; // Extrai o token do cookie

    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado. Faça login para continuar.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica e decodifica o token
        req.userId = decoded.userId; // Armazena os dados do usuário na requisição
        next(); // Prossegue para a próxima função
    } catch (error) {
        console.error('Erro de autenticação:', error);
        return res.status(403).json({ msg: 'Token inválido ou expirado.' });
    }
};

export default authMiddleware;