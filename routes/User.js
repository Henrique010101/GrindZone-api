import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { JWT_SECRET } from '../app.js'
import loginMiddleware from '../middleware/login.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/check-session', authMiddleware, (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ isAuthenticated: true });
} else {
    return res.status(200).json({ isAuthenticated: false });
}
});

router.get("/logout", authMiddleware, (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: 'None',
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({ message: "Logged out" });
});

router.post('/register', async (req, res) => {
  const { name, email, password, confirmpassword } = req.body

  const sanitizedEmail = email.trim().toLowerCase();

  if (!name) {
    return res.status(422).json({ msg: 'O nome é obrigatório!' })
  }
  if (!sanitizedEmail) {
    return res.status(422).json({ msg: 'O email é obrigatório!' })
  }
  if (!password) {
    return res.status(422).json({ msg: 'A senha é obrigatória!' })
  }
  if (password !== confirmpassword) {
    return res.status(422).json({ msg: 'As senhas não conferem!' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
  return res.status(422).json({ msg: 'Por favor, insira um email válido!' });
  }

  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;  
  if (!passwordRegex.test(password)) {
      return res.status(422).json({ msg: 'A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula e um número!' });
  }

  const userExists = await User.findOne({ email: sanitizedEmail })

  if (userExists) {
    return res.status(422).json({ msg: 'O email já existe!' })
  }

  const salt = await bcrypt.genSalt(12)
  const passwordHash = await bcrypt.hash(password, salt)

  const user = new User({
    name,
    email: sanitizedEmail,
    password: passwordHash
  })

  try {
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '4h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 4 * 60 * 60 * 1000,
      sameSite: 'None',
    });

    res.status(201).json({
      msg: 'Usuário criado com sucesso!',
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!'
    });
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Email:', email);
  console.log('Password:', password);

  if (!email || !password) {
    return res.status(400).send({ message: "Email e senha são obrigatórios." });
  }

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).send({ message: "Usuário não encontrado." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send({ message: "Senha incorreta." });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '4h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 4 * 60 * 60 * 1000,
      sameSite: 'None',
    });

    res.status(200).send(
      {
        message: "Login bem-sucedido.",
        user: {
          email: user.email,
          name: user.name
        }
      }
    );
  } catch (error) {
    console.error('Erro ao processar login:', error);
    res.status(500).send({ message: "Erro interno do servidor." });
  }
});

export default router;