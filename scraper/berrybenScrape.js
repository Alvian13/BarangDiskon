require('dotenv').config();
const puppeteer = require('puppeteer');
const request = require('request');
const axios = require('axios');//masalahnya disini
const { response } = require('express');
const urlReq = process.env.REQ_URL;
console.log('hallo');
function scrape(){
  console.log("fungsi jalan kok!");
 (async () => {
  const collection =["blalaaa","clothing","shoes","bags","accessories"];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  async function getdata(jenis){
    console.log("fungsi jalan");
    try{
    await page.waitForSelector('#li-catalog');
    // other actions...
    console.log(page.url());
    const sections = await page.$$("#li-catalog");
    console.log(sections.length);
    for(const section of sections){
      const brand = await section.$eval('#li-catalog > a > div.catalog-detail > div.detail-left > h1',(k)=>{
          return k.innerText;
      });
      let _id = brand.split(" ").join("");
      asalsitus = "berrybenka";
      try{
      var Harga = await section.$eval("#li-catalog > a > div.catalog-detail > div.detail-right > p",(k)=>{
        return k.innerText;
      });
      Harga =  Harga.split("IDR").join("");
      Harga = parseInt(Harga)*1000;
      }catch(err){
         Harga = await section.$eval("#li-catalog > a > div.catalog-detail > div.detail-right > p",(k)=>{
          return k.innerText;
        });
        Harga =  Harga.split("IDR").join("");
        Harga = parseInt(Harga)*1000;
      }
      const link = await section.$eval('#li-catalog > a',(k)=>{
        return k.getAttribute('href');
      });
      try{
        var diskon = await section.$eval('#li-catalog > a > div.catalog-detail > div.detail-right > p.discount',(k)=>{
          return k.innerText});
          diskon = diskon.split("IDR").join("");
          diskon = parseInt(diskon)*1000;
          var pdiskon = (1-(diskon/Harga))*100;
          pdiskon = parseInt(pdiskon);
          
        }catch(err){
         diskon = "";
        var pdiskon = (1-(Harga/Harga))*100;
        pdiskon = parseInt(pdiskon);
        }
        let isilink = `https://berrybenka.com/${jenis}/women/`+link;
        const image = await section.$eval('#li-catalog > a > div.catalog-image > img',(k)=>{
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
    console.log("page ini sudah tidakada",page.url());
  }
  }
  for(const koleksi of collection){
    await page.goto(`https://berrybenka.com/${koleksi}/women`,{waitUntil:"networkidle2",timeout : 50000});
    if(await page.$("#ul-pagination > li:nth-last-child(1) > a")){
      while(await page.$("#ul-pagination > li:nth-last-child(1) > a")){
        await getdata(koleksi);
        try{
      await page.click("#ul-pagination > li:nth-last-child(1) > a");}catch(err){
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