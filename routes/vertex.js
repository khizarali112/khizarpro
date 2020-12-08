// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const express = require('express')
const Vertex = require('vertex360/dist/vertex/Vertex')
const controllers = require('../controllers')
const authRouter = vertex.router()
const blocksRouter = vertex.router()

authRouter.post('/login', (req, res) => {
  const token = req.headers['VERTEX-TOKEN']
  vertex.verifyUser({profile:req.body.id, token:token})
  .then(user => { 
    req.vertexSession.user = user
    res.redirect('/auth/currentuser')
  })
  .catch(err => {
    res.json({
      confiramtion:'fail',
      message: err.message
    })
  })
})

authRouter.get('/currentuser', (req, res ) => {
  if (req.vertexSession == null){
    res.json({
      confiramtion: 'success',
      user: null
    })
    return
  }
  
  if (req.vertexSession == undefined){
    res.json({
      confiramtion: 'success',
      user: null
    })
    return
  }

  res.json({
    confiramtion: 'success',
    user: req.vertexSession.user || null
  })
})

authRouter.get('/logout', (req, res) => {
  if (req.vertexSession == null){
    res.json({
      confiramtion: 'success',
      user: null
    })
    return
  }

  req.vertexSession.reset()
  res.redirect('/auth/currentuser')

})

blocksRouter.get('/', (req, res) => {
  const data = req.config
  res.render('blocks', data)
})

const APIRouter = vertex.APIRouter
const api = new APIRouter({
	site_id: process.env.TURBO_APP_ID,
	api_key: process.env.TURBO_API_KEY,
	env: process.env.TURBO_ENV
})

module.exports = {
  api: api.router(controllers),
  auth: authRouter,
  blocks: blocksRouter
}
