const puppeteer = require('puppeteer');

const { DISH_TYPES } = require("../utilities/constants");

const isValidHttpUrl = (string) => {
    const pattern = new RegExp('^(https?:\\/\\/)?'+
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
        '((\\d{1,3}\\.){3}\\d{1,3}))'+
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
        '(\\?[;&a-z\\d%_.~+=-]*)?'+
        '(\\#[-a-z\\d_]*)?$','i');
    return !!pattern.test(string);
}

const getDomain = (url) => {
    if(url.includes('swiggy')){
        return 'swiggy'
    } else if (url.includes('zomato')) {
        return 'zomato'
    }
    return ''
}

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0;
            let distance = 100;
            let timer = setInterval(() => {
                let scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

const scrapRestaurant = async (url) => {

    console.log('Scraping Url: ' + url);

    if(url === '') {
        return {
            error: 'Please Enter Proper Link'
        }
    }

    if(!isValidHttpUrl(url)) {
        return {
            error: 'Please Enter Valid Url'
        }
    }

    try {

        const browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium-browser',
            ignoreDefaultArgs: ['--disable-extensions'],
            headless: true,
            args: ['--no-sandbox','--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        console.log('Site:', getDomain(url))

        if(getDomain(url) === 'swiggy') {

            await page.goto(url, { waitUntil: 'load' });
            await autoScroll(page);

            const data = await page.evaluate((DISH_TYPES) => {

                const title = document.querySelector('._3aqeL').innerText;
                const categories = document.querySelector('._3Plw0').innerText.split(', ');
                const rating = document.querySelector('div._2iUp9:nth-child(1) > div:nth-child(1) > span:nth-child(1)').innerText;
                const location = document.querySelector('.Gf2NS').innerText;
                const city = document.querySelector('._2p-Tc > span:nth-child(3) > a:nth-child(1) > span:nth-child(1)').innerText;
                const image = document.querySelector('#root > div._3arMG > div.nDVxx > div.uSag_ > div._1637z > div._8MlDE > div > div._3mJdF > div > img').src;

                const item_nodes = document.querySelectorAll('._2wg_t');
                const items = Array.from(item_nodes).map((item) =>  {
                    const name = item.querySelector('.styles_itemName__2Aoj9').innerText;
                    const type = item.querySelector('.styles_iconVeg__shLxJ') ? DISH_TYPES.VEG : DISH_TYPES.NON_VEG;
                    const price = item.querySelector('.rupee').innerText;
                    const img_container = item.querySelector('.styles_itemImage__POX0b');
                    const image_url = img_container ? img_container.firstChild.src : ""
                    return {
                        name,
                        type,
                        price,
                        image_url
                    }
                });

                return {title, categories, rating, location, city, image, items}

            }, DISH_TYPES);

            await browser.close();

            return {
                name: data.title,
                location: data.location,
                rating: data.rating,
                categories: data.categories,
                items: data.items,
                city: data.city,
                image: data.image
            }

        }
        else if(getDomain(url) === 'zomato') {

            await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
            await page.goto(url, { waitUntil: 'load' });
            await autoScroll(page);

            const data = await page.evaluate((DISH_TYPES) => {

                const title = document.querySelector('h1.sc-7kepeu-0:nth-child(1)').innerText;
                const rating = document.querySelector('.lhdg1m-2').innerText;
                const categories_node = document.querySelector('h1.sc-7kepeu-0:nth-child(1)').parentElement.parentElement.children[1].children[0].textContent;
                const categories = categories_node.includes('-') ?
                    categories_node.split(' - ')[1].split(', ') :
                    categories_node.split(', ');
                const city = document.querySelector('a.ks3f96-0:nth-child(3) > span:nth-child(1)').innerText.replace(/[^a-zA-Z ]/g, "");
                const location = document.querySelector('h1.sc-7kepeu-0:nth-child(1)').parentElement.parentElement.children[1].children[1].textContent;
                const image = document.querySelector('.s1isp7-5').src;

                const item_class_nodes = document.querySelectorAll('.SnWUh');
                const items = Array.from(item_class_nodes).map((item_node) => {
                    return Array.from(item_node.nextSibling.childNodes).map((item) => {
                        if (item.tagName !== 'P') {
                            const name = item.querySelector('.sc-1s0saks-15').innerText;
                            const type = item.querySelector('.sc-1tx3445-0').getAttribute("type") === 'veg' ? DISH_TYPES.VEG : DISH_TYPES.NON_VEG;
                            const price = item.querySelector('.cCiQWA').innerText.replace('₹', '');
                            const img_container = item.querySelector('.s1isp7-5');
                            const image_url = img_container ? img_container.src : ""
                            return {
                                name,
                                type,
                                price,
                                image_url
                            }
                        }
                    });

                }).flat().filter((item) => item !== undefined );

                return { title, rating, categories, location, city, image, items }

            }, DISH_TYPES);

            return {
                name: data.title,
                location: data.location,
                rating: data.rating,
                categories: data.categories,
                items: data.items,
                city: data.city,
                image: data.image
            }
        } else {

            throw new Error('Not Valid Domain');

        }
    } catch (e) {

        console.log(e);
        return {
            error: 'Please Check link and Try Again'
        }
    }
}

module.exports = scrapRestaurant
