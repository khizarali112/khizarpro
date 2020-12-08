const express = require('express')
const ProjectController = require('../controllers/ProjectController')
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()
const rojectController = require ('../controllers/ProjectController')
const Project = require('../models/Project')
const controllers = require('../controllers')

router.get('/', (req, res) => {
    const data = req.context //{page,...,  global,...}

    const projectCtr = new ProjectController()
    projectCtr.get()
        .then( projects => { 
        data ['projects'] = projects
        res.render('landing', data)
        // console.log('Projects: ' + JSON.stringify(projects))
    })
    .catch(err => {
        res.send('oops!' +err.message)
    })


    // const data = req.context //{page,...,  global,...}
})

// router.get('/project/:slug', (req, res) =>{
//     const data = req.context
//     const projectSlug = req.params.slug

//     const projectCtr = new ProjectController()
//     projectCtr.get({slug:projectSlug})
//     .then(projects => {
//         if (projects.length ==0){
//             return
//         }
//         const project = projects[0]
//         data['project'] = project
//         res.render('project', data)
//     })
//     .catch(err => {
//         res.send('OOPS -' +err.message)
//     })
// })


router.get('/project/:slug', (req, res) => {
	const data = req.context

	let ctr = new controllers.project()
	ctr.get({slug:req.params.slug})
	.then(posts => {
		if (posts.length == 0){
			throw new Error('Project '+req.params.slug+' not found.')
			return
		}

		data['project'] = posts[0]
		data.setEntity(data.project)
		res.render('project', data)
	})
	.catch(err => {
		res.json({
			confirmation: 'fail',
			message: err.message
		})
	})
})


router.get('/post/:slug', (req, res) => {
	const data = req.context

	let ctr = new controllers.post()
	ctr.get({slug:req.params.slug})
	.then(posts => {
		if (posts.length == 0){
			throw new Error('Post '+req.params.slug+' not found.')
			return
		}

		data['post'] = posts[0]
		data.setEntity(data.post)
		res.render('post', data)
	})
	.catch(err => {
		res.json({
			confirmation: 'fail',
			message: err.message
		})
	})
})






router.get('/blog', (req, res) => {
	const data = req.context // {cdn:<STRING>, global:<OBJECT>}

	let ctr = new controllers.post()
	ctr.get()
	.then(posts => {
		data['posts'] = posts
    	res.render('blog', data)
	})
	.catch(err => {
		res.json({
			confirmation: 'fail',
			message: err.message
		})
	})
})



module.exports = router