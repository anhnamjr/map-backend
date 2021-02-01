const express = require('express');

const controller = require('../controllers/map.controller')

const router = express.Router();

router.get('/maps', controller.getMap)
router.post('/maps', controller.postMap)

router.post('/layer', controller.postLayer)

router.get("/data", controller.getData);
router.post("/data", controller.postGeoData)

router.post('/editMap', controller.editMap)

router.post('/editLayer', controller.editLayer)

router.post("/editData", controller.editGeoData)


module.exports = router;