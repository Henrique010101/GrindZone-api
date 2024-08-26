import multer from 'multer';
import path from 'path';

// Configuração de armazenamento para Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Diretório onde os arquivos serão armazenados
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Obtém a extensão do arquivo
        cb(null, Date.now() + ext); // Nome do arquivo com timestamp para evitar conflitos
    }
});

// Filtra apenas imagens
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Arquivo não é uma imagem'), false);
    }
};

// Cria o middleware de upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

export default upload;
