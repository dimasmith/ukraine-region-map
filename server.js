import express from "express";
import bodyParser from "body-parser";
import {MongoClient} from 'mongodb';

const app = express();
app.use(express.static(__dirname));
app.use(bodyParser.json());

MongoClient.connect('mongodb://localhost:27017/giz2', (err, db) => {

  const districtsCollection = db.collection('districts');

  app.post('/api/v1/districts', (req, resp) => {
    const district = req.body;
    district._id = district.key;
    districtsCollection.insertOne(district, (err, result) => {
      if (!err && result.insertedCount === 1) {
        resp.sendStatus(200);
      } else {
        districtsCollection.replaceOne({_id: district._id}, district, (err, result) => {
          if (!err && result.modifiedCount === 1) {
            resp.sendStatus(200);
          } else {
            console.log(err, result);
          }
        })
      }
    });
  });

  app.get('/api/v1/districts', (req, resp) => {
    districtsCollection.find().toArray((err, districts) => {
      resp.status(200).json(districts);
    });
  });


});



app.listen(8000);
