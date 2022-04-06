
const rp = require('request-promise');
const cheerio = require('cheerio');
const url = 'https://br.investing.com/currencies/usd-brl';

rp(url)
  .then(function(html){
    //success!
    //console.log(html);
    const $ = cheerio.load(html);
    var p = $('.text-2xl').text();
    filtered = p.replace(/[^\d,.]/g, '');
    console.log(filtered);

  })
  .catch(function(err){
    //handle error
  });
