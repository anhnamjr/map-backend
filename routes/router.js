const express = require('express');
const db = require("../db")

const controller = require('../controllers/map.controller')

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { rows } = await db.query(`Select * from "Maps"`)
  } catch (err) {
    console.log(err)
  }
})
router.get('/maps', controller.getMap)
router.post('/maps', controller.postMap)

router.post('/layer', controller.postLayer)

router.get("/data", controller.getData);
router.post("/data", controller.postGeoData)

router.post('/editMap', controller.editMap)

router.post('/editLayer', controller.editLayer)

router.post("/editData", controller.editGeoData)


module.exports = router;