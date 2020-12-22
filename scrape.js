require('dotenv').config();
const mongoose = require('mongoose');
const berryben = require("./scraper/berrybenScrape");
const brodo = require("./scraper/brodoScrape");
const nahp = require("./scraper/nahScrape");

function scraping(){
brodo.scrape();
nahp.scrape();
berryben.scrape();}

setInterval(() => {
  scraping();
}, 1000*60*30);