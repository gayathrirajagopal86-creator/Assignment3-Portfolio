import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { expressjwt } from 'express-jwt'
import config from './../../config/config.js'

const signup = async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: 'user'
    })
    await user.save()
    return res.status(201).json({ message: 'Successfully signed up!' })
  } catch (err) {
    const message = err.code === 11000 ? 'Email already exists' : err.message
    return res.status(400).json({ error: message })
  }
}

const signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email?.toLowerCase() })
    if (!user || !user.authenticate(req.body.password)) {
      return res.status(401).json({ error: "Email and password don't match." })
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      config.jwtSecret,
      { expiresIn: '2h' }
    )

    res.cookie('t', token, { httpOnly: true, sameSite: 'lax' })
    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (err) {
    return res.status(401).json({ error: 'Could not sign in' })
  }
}

const signout = (req, res) => {
  res.clearCookie('t')
  return res.status(200).json({ message: 'signed out' })
}

const requireSignin = expressjwt({
  secret: config.jwtSecret,
  algorithms: ['HS256'],
  requestProperty: 'auth',
  getToken: (req) => {
    if (req.headers.authorization?.startsWith('Bearer ')) {
      return req.headers.authorization.split(' ')[1]
    }
    return req.cookies?.t
  }
})

const isAdmin = (req, res, next) => {
  if (req.auth?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access is required' })
  }
  next()
}

const hasAuthorization = (req, res, next) => {
  const authorized =
    req.profile &&
    req.auth &&
    (req.profile._id.toString() === req.auth._id || req.auth.role === 'admin')

  if (!authorized) {
    return res.status(403).json({ error: 'User is not authorized' })
  }
  next()
}

export default { signup, signin, signout, requireSignin, isAdmin, hasAuthorization }
