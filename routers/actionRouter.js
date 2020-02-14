const express = require('express');
const actions = require('../data/helpers/actionModel');
const projects = require('../data/helpers/projectModel'); // TODO: for middleware

const router = express.Router();

router.get('/', (req, res) => {
  actions.get()
    .then(actions => res.status(200).json(actions))
    .catch(err => console.log(err));
});

router.get('/:id', validateActionId, (req, res) => {
  actions.get(req.params.id)
    .then(action => res.status(200).json(action))
    .catch(err => console.log(err));
});


router.post('/:id', validateProjectId, validateActionData, (req, res) => {
  const actioninfo = req.body;
  actions.insert(actioninfo)
    .then(() => res.status(201))
    .catch(err => console.log(err));
});


router.delete('/:id', validateActionId, (req, res) => {
  actions.remove(req.params.id)
    .then(() => res.status(404))
    .catch(err => console.log(err));
});


router.put('/:id', validateActionId, validateActionData, (req, res) => {
  const actioninfo = req.body;
  actions.update(req.params.id, actioninfo)
    .then(() => res.status(200).json(actioninfo))
    .catch(err => console.log(err));
});



function validateProjectId(req, res, next) {
  projects.get(req.params.id)
    .then(project => {
      if(project) {
        req.project = project;
        next();
      }
      else {
        res.status(400).json({ message: "invalid project id" });
      }
    })
    .catch(err => console.log(err));
}

function validateActionId(req, res, next) {
  actions.get(req.params.id)
    .then(action => {
      if(action) {
        req.action = action;
        next();
      }
      else {
        res.status(400).json({ message: "invalid action id" });
      }
    })
    .catch(err => console.log(err));
}

function validateActionData(req, res, next) {
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "Missing Action data" });
  }
  else if ( !req.body.project_id   ||
            !req.body.description ||
            !req.body.notes ) {
    res.status(400).json({ message: "Missing required field" });
  }
  else if (req.body.description.length > 128) {
    res.status(400).json({ message: "Description field max length = 128" });
  }
  else {
    next();
  }
}

module.exports = router;