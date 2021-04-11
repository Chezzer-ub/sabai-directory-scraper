var cheerio = require("cheerio");
var axios = require("axios");
var he = require("he");
var fs = require("fs");
var url = process.argv[2];
function parseText(text) {
    //take &amp and things like that out of a text.
    if (text) {
        text = text.trim();
        text = he.decode(text);
        text = he.unescape(text);
        return text;
    } else {
        return null;
    }
}
    
var list = []
axios.get(url+"/sabai/directory?zoom=15&is_mile=0&directory_radius=0&hide_searchbox=0&hide_nav=0&hide_nav_views=0&hide_pager=0&featured_only=0&feature=1&perpage=10000&list_map_show=0&sort=newest&keywords=&address=&directory_radius=0&center=&address_type=&category=0&__ajax=%23sabai-embed-wordpress-shortcode-1%20.sabai-directory-listings-container&_=1617946463982").then((data) => {
    var $ = cheerio.load(data.data);
    $(".sabai-entity").each((i, item) => {
        $ = cheerio.load(item);
        let data = {
            name: parseText($(".sabai-directory-title a").text()),
            category: parseText($(".sabai-entity-bundle-type-directory-category").text()),
            image: parseText($(".sabai-directory-photos img").attr("src")),
            location: parseText($(".sabai-directory-location").text()),
            tel: parseText($(".sabai-directory-contact-tel a").text()),
            mobile: parseText($(".sabai-directory-contact-mobile a").text()),
            email: parseText($(".sabai-directory-contact-email").text()),
            website: parseText($(".sabai-directory-contact-website").text())
        }
        list.push(data);
    })
    fs.writeFileSync("directory.json", JSON.stringify(list));
})