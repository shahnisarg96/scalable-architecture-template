import { Router } from 'express'
import { login, signup } from '../controllers/auth.controller.js'

const router = Router()

// Signup route
router.post('/signup', async (req, res) => {
    const response = await signup(req);
    res.json({ response })
})

// Login route
router.post('/login', async (req, res) => {
    const response = await login(req);
    res.json({ response })
})

export default router
