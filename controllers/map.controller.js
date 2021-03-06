const db = require("../db");

const getMap = async (req, res) => {
	const username = "16ca9ecb-f1e5-4cd2-81d7-23a0ac7f47c0";
  let maps;
  try {
    const {
      rows,
    } = await db.query(
      `SELECT "Maps"."mapID" AS key, "Maps"."mapName" AS title FROM "Maps" JOIN "Users" ON "Maps"."userID" = "Users"."userID" WHERE "Users"."userID" = $1`,
      [username]
    );
    maps = rows;
    // console.log(maps);
    if (maps.length !== 0) {
      for (const map of maps) {
        try {
          const {
            rows,
          } = await db.query(
            `SELECT "layerID" as key, "layerName" AS title FROM "Layers" WHERE "mapID" = $1`,
            [map.key]
          );
          map.children = rows;
        } catch (err) {
          console.log(err);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
  res.status(200).send({ maps });
}

const getData = async (req, res) => {
	if(!req.query.layerId) {
		req.query.layerId = ''
	}
	if (req.query.layerId === '') {
    res.send({type: "FeatureCollection", features: []})
  } else {
    const  mapIdArr = req.query.layerId.split(',').map(mapid => `'${mapid}'`)
    try {
      const mapStr = mapIdArr.join(',');
      let strQuery = `SELECT json_build_object('type', 'FeatureCollection','features', json_agg(ST_AsGeoJSON(geo.*)::json)) AS geom FROM "GeoData" AS geo WHERE "layerID" IN (${mapStr})`
      // console.log(strQuery)
      const { rows } = await db.query(strQuery, [])
      // console.log(rows)
      if(rows[0].geom.features ===  null) rows[0].geom.features = []
      res.send(rows[0].geom)
    } catch (err) {
      throw err
    }
  }
}

const postMap = async (req, res) => {
	// console.log(req.body)
	const {mapName} = req.body
	const iconID = '0da68f26-5e2c-4d44-ab62-dd8431dc3d6d'
	const userID = '16ca9ecb-f1e5-4cd2-81d7-23a0ac7f47c0'
	try {
		const { rows } = await db.query(`SELECT * FROM "Maps" WHERE "userID" = $1 AND "mapName" = $2`, [userID, mapName])
		if(rows.length !== 0) {
			res.send({msg: `Name of map is exist`})
			return;
		} else {
			await	db.query(`INSERT INTO "Maps"("mapName", "userID", "iconID") VALUES ($1, $2, $3)`, [mapName, userID, iconID])
			res.status(201).send()
			return;
		}
	} catch (err) {
		throw err
	}
}

const postLayer = async (req, res) => {
  const { layerName } = req.body
  const mapID = '3943d0b1-ff9b-4b2e-8b0a-d25582a122dd'
  const iconID = '2ea20597-03c5-4307-9d57-a5c1c2caf143'
  try {
		const { rows } = await db.query(`SELECT * FROM "Layers" WHERE "mapID" = $1 AND "layerName" = $2`, [mapID, layerName])
		if(rows.length !== 0) {
			res.send({msg: `Name of layer is exist`})
			return;
		} else {
			await db.query(`INSERT INTO "Layers"("layerName", "mapID", "iconID") VALUES ($1, $2, $3)`, [layerName, mapID, iconID])
			res.status(201).send()
			return;
		}
	} catch (err) {
		throw err
	}
}

const postGeoData = async (req, res) => {
  let { layerID, geoName, geom, description, categoryID, color } = req.body
  // geom = `ST_SetSRID(ST_GeomFromGeoJSON('${geom}'),4326))`
  // console.log(geom)
  try {
    const { rows } = await db.query(`SELECT * FROM "GeoData" WHERE "layerID" = $1 AND "geoName" = $2`, [layerID, geoName])
    if(rows.length !== 0) {
      res.send({msg: `Name of geo data is exist`})
    } else {
      const strQuery = `INSERT INTO "GeoData"("layerID", "geoName", "geom", "description", "categoryID", "color") VALUES ('${layerID}', '${geoName}', ST_SetSRID(ST_GeomFromGeoJSON('${geom}'),4326), '${description}', '${categoryID}', '${color}')`
      console.log(strQuery)
      await db.query(strQuery,[])
      res.status(201).send()
    }
  } catch (err) {
    console.error(err)
  }
}

const editMap = async (req, res) => {
	// console.log(req.body)
	const {mapID,userID,mapName,iconID} = req.body //mapName: new name
	// const iconID = '0da68f26-5e2c-4d44-ab62-dd8431dc3d6d'
	// const userID = '16ca9ecb-f1e5-4cd2-81d7-23a0ac7f47c0'
	try {
		const { rows } = await db.query(`SELECT * FROM "Maps" WHERE "userID" = $1 AND "mapName" = $2`, [userID, mapName])
		if(rows.length !== 0) {
			res.send({msg: `Name of map is exist`})
			return;
		} else {
      await	db.query(
      `UPDATE "Maps" 
      SET "mapName" = $1, 
          "iconID" = $2 
      WHERE "mapID" = $3`,[mapName, iconID,mapID])
			res.status(201).send()
			return;
		}
	} catch (err) {
		throw err
	}
}
const editLayer = async (req, res) => {
	// console.log(req.body)
  const {layerID,mapID,layerName,iconID} = req.body //layerName: new name
	// const iconID = '0da68f26-5e2c-4d44-ab62-dd8431dc3d6d'
	// const mapID = '3943d0b1-ff9b-4b2e-8b0a-d25582a122dd'
	try {
		const { rows } = await db.query(`SELECT * FROM "Layers" WHERE "mapID" = $1 AND "layerName" = $2`, [mapID, layerName])
		if(rows.length !== 0) {
			res.send({msg: `Name of layer is exist`})
			return;
		} else {
      await	db.query(`UPDATE "Layers" SET "layerName" = $1, "iconID" = $2 WHERE "layerID" = $3`, [layerName,iconID,layerID])
			res.status(201).send()
			return;
		}
	} catch (err) {
		throw err
	}
}

const editGeoData = async (req, res) => {
  let { geoID, layerID, geoName, geom, description, categoryID, color } = req.body
  // geom = `ST_SetSRID(ST_GeomFromGeoJSON('${geom}'),4326))`
  // console.log(geom)
  try {
    const { rows } = await db.query(`SELECT * FROM "GeoData" WHERE "layerID" = $1 AND "geoName" = $2`, [layerID, geoName])
    if(rows.length !== 0) {
      res.send({msg: `Name of geo data is exist`})
    } else {
      // const strQuery = `INSERT INTO "GeoData"("layerID", "geoName", "geom", "description", "categoryID", "color") VALUES ('${layerID}', '${geoName}', ST_SetSRID(ST_GeomFromGeoJSON('${geom}'),4326), '${description}', '${categoryID}', '${color}')`
      // const strQuery = `UPDATE "GeoData" SET "layerID" = '${layerID}', "geoName" = '${geoName}', "geom" = ST_SetSRID(ST_GeomFromGeoJSON(${geom}),4326), "description" = '${description}', "categoryID" = '${categoryID}', "color" = '${color}'`
      const strQuery = `UPDATE "GeoData" SET "layerID" = '${layerID}', "geoName" = '${geoName}', "description" = '${description}', "categoryID" = '${categoryID}', "color" = '${color}' WHERE "geoID" = '${geoID}`
      console.log(strQuery)
      await db.query(strQuery,[])
      res.status(201).send()
    }
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
	getMap,
	getData,
	postMap,
  postLayer,
  postGeoData,
  editMap,
  editLayer,
  editGeoData
}