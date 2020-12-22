const express = require('express');
const utama = require('./routes/utama');
const app = express();
const axios = require('axios');
var data = require("./models/diskon.js");
require('dotenv').config();
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(express.json());
app.get('/',async(req,res)=>{
  res.send("aplikasi jalan")
})

app.get('/api',async(req,res)=>{
  console.log("ada request nih");
  const datai = await data.find({});

  try {
    res.send(datai);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/api', async(req,res)=>{
  console.log("ada request nih");
  const datai = new data(req.body);
  try {
    datai.save();
    console.log("sukses");
  } catch(err){
    console.log('error');
    res.json(err);
  }
});
app.put('/api/:id', async(req,res)=>{
  try {
    const newdata = await data.findByIdAndUpdate(req.params.id, req.body);
    await newdata.save();
    await console.log('sukses');
  } catch(err){
    console.log("gagal");
    axios({
      method:'POST',
      url: `${port}/api`,
      data: req.body
    });
  }
});


app.set('view engine','ejs');
//app.use('/',utama);


app.listen(port);