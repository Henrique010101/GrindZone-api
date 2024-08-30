import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import loginMiddleware from '../middleware/login.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password, confirmpassword } = req.body

    const sanitizedEmail = email.trim().toLowerCase();

    // Validations
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

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    // return res.status(422).json({ msg: 'Por favor, insira um email válido!' });
    // }

    // const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;  
    // if (!passwordRegex.test(password)) {
    //     return res.status(422).json({ msg: 'A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula e um número!' });
    // }

    // Check user exist
    const userExists = await User.findOne({ email: sanitizedEmail })

    if (userExists) {
        return res.status(422).json({ msg: 'O email já existe!' })
    }

    // Create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // Create user
    const user = new User({
        name,
        email: sanitizedEmail,
        password: passwordHash
    })

    try {
        await user.save();
    
        // Create JWT token
        const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '4h' });
    
        // Set cookie
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Apenas em produção
          maxAge: 4 * 60 * 60 * 1000, // 4h
          sameSite: 'lax', // verificar quando for colocar em produção
        });
    
        res.status(201).json({
          msg: 'Usuário criado com sucesso!',
          token, // Opcional: pode incluir o token na resposta se necessário
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!'
        });
      }
})

router.post('/login', async (req, res) => {

    const { email, password } = req.body
    const user = await User.findOne({ email: email })

    if (!user || !(await bcrypt.compare(password, user.password)))
        return res.status(200).send({ message: "Invalid login" });

    // Check if password match
    const checkPassord = await bcrypt.compare(password, user.password)

    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "4h" });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Apenas em produção
    maxAge: 4 * 60 * 60 * 1000, // 4h
    sameSite: "lax", // verificar quando for colocar em produção
  });
  res.send({ user });
})

export default router