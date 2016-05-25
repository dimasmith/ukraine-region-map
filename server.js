import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.post('/api/v1/districts', (req, resp) => {
  console.log(req.body);
  resp.sendStatus(200);
});

app.listen(8000);
