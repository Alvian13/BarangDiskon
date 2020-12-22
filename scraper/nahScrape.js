require('dotenv').config();
const puppeteer = require('puppeteer');
const request = require('request');
const diskon = require('./models/diskon');
const axios = require('axios');//masalahnya disini
const { response } = require('express');
const urlReq = process.env.REQ_URL;
console.log('hallo');
function scrape(){
(async () => {
  const collection = ["coraggio","flexknit-series","nah-monotranslucent-series","sn-series","lazearound","apparel","accessoriess","blabla"];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
    
 async function getdata(jenis){
   try{
    await page.waitForSelector('#shopify-section-collection-template > section > div.CollectionMain > div.CollectionInner > div > div > div >div');
  console.log(page.url());
  // other actions...
  const sections = await page.$$("#shopify-section-collection-template > section > div.CollectionMain > div.CollectionInner > div > div > div >div");
  console.log(sections.length);
   
  for(const section of sections){
    const brand = await section.$eval('#shopify-section-collection-template > section > div.CollectionMain > div.CollectionInner > div > div > div > div > div > div > div > h2 > a',(k)=>{
        return k.innerText;
    });
    console.log(brand)
    let _id = brand.split(" ").join("");
    asalsitus = "nah";
    try{
    var Harga = await section.$eval("#shopify-section-collection-template > section > div.CollectionMain > div.CollectionInner > div > div > div > div > div > div > div.ProductItem__Info.ProductItem__Info--center > div > span.ProductItem__Price.Price.Price--compareAt.Text--subdued > span",(k)=>{
      return k.innerText;
    });
    Harga =  Harga.split("RP").join("").split(".").join("");
    console.log(Harga);
  }catch(err){
      var Harga = await section.$eval("#shopify-section-collection-template > section > div.CollectionMain > div.CollectionInner > div > div > div > div > div > div > div > div > span > span",(k)=>{
        return k.innerText;
      });
      Harga =  Harga.split("RP").join("").split(".").join("");
      console.log(Harga);
    }
    
    const link = await section.$eval('#shopify-section-collection-template > section > div.CollectionMain > div.CollectionInner > div > div > div > div> div > div > div.ProductItem__Info.ProductItem__Info--center > h2 > a',(k)=>{
      return k.getAttribute('href');
    });
    let isilink =`https://nahproject.com/`+link;
    console.log(isilink);
    try{
      var diskon = await section.$eval('#shopify-section-collection-template > section > div.CollectionMain > div.CollectionInner > div > div > div > div > div > div > div.ProductItem__Info.ProductItem__Info--center > div > span.ProductItem__Price.Price.Price--highlight.Text--subdued > span',(k)=>{
        return k.innerText});
        diskon = diskon.split("RP").join("").split(".").join("");
        var pdiskon = (1-(diskon/Harga))*100;
        pdiskon = parseInt(pdiskon);
      }catch(err){
        diskon = "";
        var pdiskon = (1-(Harga/Harga))*100;
        pdiskon = parseInt(pdiskon);
      }

      const image = await section.$eval('#shopify-section-collection-template > section > div.CollectionMain > div.CollectionInner > div > div > div > div> div > div > a > div > img',(k)=>{
        return k.getAttribute("srcset");
    });
   
      
    try{
      const datais = {_id:_id,nama:brand,asalsitus:asalsitus,harga:Harga,diskon:diskon,jenis:jenis,gambar:image,link:isilink,pdiskon:pdiskon};
    //fetch('http://localhost:5000/api',options).then(res => console.log(res));
    axios({
      method:'PUT',
      url: `${urlReq}/${_id}`,
      data: datais
    });
    }catch(err){
      console.log(err);
    }
    
  }
}catch(err){
  console.log("page error");
      }
}
  
  for(const koleksi of collection){
    await page.goto(`https://nahproject.com/collections/${koleksi}`,{waitUntil:"networkidle2",timeout : 50000});
    if(await page.$("#shopify-section-collection-template > section > div.CollectionMain > div.CollectionInner > div > div.Pagination.Text--subdued > div > a:nth-last-child(1)")){
      while(await page.$("#shopify-section-collection-template > section > div.CollectionMain > div.CollectionInner > div > div.Pagination.Text--subdued > div > a:nth-last-child(1)")){
        await getdata(koleksi);
        try{
      await page.click("#shopify-section-collection-template > section > div.CollectionMain > div.CollectionInner > div > div.Pagination.Text--subdued > div > a:nth-last-child(1)");}catch(err){
        console.log("file sudah habis");
      }
    }
      }else{
        await getdata(koleksi);
      }
    }
    
 
  await browser.close();
})();
}
module.exports = { scrape };