require('dotenv').config();
const puppeteer = require('puppeteer');
const request = require('request');
const axios = require('axios');//masalahnya disini
const { response } = require('express');
const urlReq = process.env.REQ_URL;
console.log('hallo');
function scrape(){
(async () => {
  const collection = ["shoes","sneakers","signature","formal","sandals","boots","aksesoris"];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
async function getdata(jenis){
  try{
  await page.waitForSelector('#shopify-section-collection-template > div > div:nth-child(4) > div.product-list.collection-matrix.clearfix.equal-columns--clear.equal-columns--outside-trim > div.one-third.column.medium-down--one-half.small-down--one-half.thumbnail');
  console.log(page.url());
  // other actions...
  const sections = await page.$$("#shopify-section-collection-template > div > div:nth-child(4) > div.product-list.collection-matrix.clearfix.equal-columns--clear.equal-columns--outside-trim > div.one-third.column.medium-down--one-half.small-down--one-half.thumbnail");
  console.log(sections.length);
  for(const section of sections){
    const brand = await section.$eval("#shopify-section-collection-template > div > div:nth-child(4) > div.product-list.collection-matrix.clearfix.equal-columns--clear.equal-columns--outside-trim > div.one-third.column.medium-down--one-half.small-down--one-half.thumbnail > div > a > div > span.title",(k)=>{
        return k.innerText;
    });
    let _id = brand.split(" ").join("");
    asalsitus = "brodo";
    try{
    var Harga = await section.$eval("#shopify-section-collection-template > div > div:nth-child(4) > div.product-list.collection-matrix.clearfix.equal-columns--clear.equal-columns--outside-trim > div.one-third.column.medium-down--one-half.small-down--one-half.thumbnail > div > a > div > span.price.sale > span.was_price > span > span",(k)=>{
      return k.innerText;
    });
    Harga =  Harga.split("RP").join("");
  }catch(err){
      var Harga = await section.$eval("#shopify-section-collection-template > div > div:nth-child(4) > div.product-list.collection-matrix.clearfix.equal-columns--clear.equal-columns--outside-trim > div.one-third.column.medium-down--one-half.small-down--one-half.thumbnail > div > a > div > span.price > span.current_price > span > span",(k)=>{
        return k.innerText;
      });
      Harga =  Harga.split("RP").join("");
    }
    
    const link = await section.$eval('#shopify-section-collection-template > div > div:nth-child(4) > div.product-list.collection-matrix.clearfix.equal-columns--clear.equal-columns--outside-trim > div.one-third.column.medium-down--one-half.small-down--one-half.thumbnail > div > div > a',(k)=>{
      return k.getAttribute('href');
    });
    try{
      var diskon = await section.$eval('#shopify-section-collection-template > div > div:nth-child(4) > div.product-list.collection-matrix.clearfix.equal-columns--clear.equal-columns--outside-trim > div.one-third.column.medium-down--one-half.small-down--one-half.thumbnail > div > a > div > span.price.sale > span.current_price',(k)=>{
        return k.innerText});
        diskon = diskon.split("IDR").join("");
        var pdiskon = (1-(diskon/Harga))*100;
        pdiskon = parseInt(pdiskon);
      }catch(err){
        diskon = "";
        var pdiskon = (1-(Harga/Harga))*100;
        pdiskon = parseInt(pdiskon);
      }
      let isilink = "https://bro.do/collections/"+link;
      const image = await section.$eval('#shopify-section-collection-template > div > div:nth-child(4) > div.product-list.collection-matrix.clearfix.equal-columns--clear.equal-columns--outside-trim > div.one-third.column.medium-down--one-half.small-down--one-half.thumbnail > div > div > a > div > div > img',(k)=>{
        return k.getAttribute("src");
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
    console.log("page ini sudah tidak ada",page.url());
  }
  }

for(const koleksi of collection){
  await page.goto(`https://bro.do/collections/${koleksi}`,{waitUntil:"networkidle2",timeout : 50000});
  if(await page.$("#shopify-section-list-collections-template > div > div.sixteen.columns.list-collection-wrapper > div.sixteen.columns > div > div > span.next > a")){
    while(await page.$("#shopify-section-list-collections-template > div > div.sixteen.columns.list-collection-wrapper > div.sixteen.columns > div > div > span.next > a")){
     await getdata(koleksi);
     try{
      await page.click("#shopify-section-list-collections-template > div > div.sixteen.columns.list-collection-wrapper > div.sixteen.columns > div > div > span.next > a");}catch(err){
        console.log("file sudah habis");
      }
    }
    }else{await getdata(koleksi);}
} 

  await browser.close();
})();
}
module.exports = { scrape };