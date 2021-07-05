const puppeteer = require("puppeteer");
const moment = require("moment");

const app = (async () => {
    
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 150
    });

    const page = await browser.newPage();
    await page.goto('http://localhost:1299/',{
        timeout: 120000,
        waitUntil: 'load'
    })

    //SELECIONA E INFORMA O AMBIENTE NO SERVIDOR
    await page.waitForSelector("[id='inputEnv']");
    await page.focus("[class='button button-ok']");
    await page.click("[id='inputEnv']", {clickCount: 3});
    await page.type("[id='inputEnv']", 'DEPURANDOADVPL'); // ambiente 
    await page.click("[class='button button-ok']");

    //EFETUAR O LOGIN
    await page.waitForXPath("//div[@id='COMP3014']/input", {timeout: 600000,visible: true});
    await page.type("#COMP3014 > input", 'admin'); // usuario
    await page.focus("#COMP3016 > input");
    await page.type("#COMP3016 > input", 'admin'); // senha
    await page.click("#COMP3018 > button");

    //SELECTIONA A FILIAL E MODULO 
    await page.waitForXPath("//div[@id='COMP3026']/input"), {timeout: 600000};
    await page.focus("#COMP3026 > input");
    await page.type("#COMP3026 > input", '010101'); // filial
    await page.focus("#COMP3029 > input");
    await page.type("#COMP3029 > input", "16"); // modulo
    await page.focus("#COMP3036 > button");
    await page.click("#COMP3036 > button");

    // ABRE A ROTINA PONM070
    await page.waitForXPath("//div[@id='COMP3088']/input", {timeout: 600000});
    await page.focus("#COMP3088 > input");
    await page.type("#COMP3088 > input",'PONM070'); // rotina
    await page.click("#COMP3088 > img");
    await page.waitForXPath("//div[@id='COMP3058']/div[@id='COMP3059']/div[@class='workspacefolder-container']/iframe", {timeout: 600000});

    // ABRE A OPÇÃO PARAMETRO E PREENCHE DE FORMA GERENERICA 
    const frameHandle = await page.$("iframe[class='session']");
    const frame = await frameHandle.contentFrame();
    await frame.waitForXPath("//div[@id='COMP4505']/button", {timeout: 600000});
    await frame.focus("#COMP4505 > button");
    await frame.click("#COMP4505 > button");
    await frame.waitForXPath("//div[@id='COMP6056']/button", {timeout: 600000});
    await frame.focus("#COMP6012 > input");
    await frame.type("#COMP6012 > input"," ");
    await frame.focus("#COMP6014 > input");
    await frame.type("#COMP6014 > input","ZZZZZZ");
    await frame.focus("#COMP6016 > input");
    await frame.type("#COMP6016 > input"," ");
    await frame.focus("#COMP6018 > input");
    await frame.type("#COMP6018 > input",'ZZZZZZZZZ');
    await frame.focus("#COMP6024 > input");
    await frame.type("#COMP6024 > input", ' ');
    await frame.focus("#COMP6026 > input");
    await frame.type("#COMP6026 > input",'ZZZZZZ');
    
    const inpSituation = await frame.$x("//div[@id='COMP6036']/input");
    await inpSituation[0].focus();
    await inpSituation[0].type('A*FT');
    await inpSituation[0].press('Tab');
    
    let frameSecond = await page.$("iframe[class='session']");
    let framePage = await frameSecond.contentFrame();
    await framePage.waitForXPath("//div[@id='COMP7515']/button", {timeout: 60000});
    await framePage.click("#COMP7515 > button");
    
    const inpCategory = await frame.$x("//div[@id='COMP6038']/input");
    await inpCategory[0].focus();
    await page.waitForTimeout(6000);
    await inpCategory[0].type('EM');
    await inpCategory[0].press('Tab');
    
    frameSecond = await page.$("iframe[class='session']");
    framePage = await frameSecond.contentFrame();
    await framePage.waitForXPath("//div[@id='COMP7515']/button", {
        timeout: 60000
    });
    await framePage.click("#COMP7515 > button");
    await frame.focus("#COMP6042 > input");
    await frame.type("#COMP6042 > input",moment().clone().startOf('month').format('DD/MM/YYYY'));
    await frame.focus("#COMP6044 > input");
    await frame.type("#COMP6044 > input",moment().clone().format('DD/MM/YYYY'));
    await frame.focus("#COMP6056 > button");
    await frame.click("#COMP6056 > button");
    await frame.focus("#COMP4506 > button");
    await frame.click("#COMP4506 > button");
    
    frameSecond = await page.$("iframe[class='session']");
    framePage = await frameSecond.contentFrame();
    await framePage.waitForXPath("//div[@id='COMP6012']/button", {
        timeout: 60000
    });
    await frame.focus("#COMP6012 > button");
    await frame.click("#COMP6012 > button");
    await page.waitForTimeout(3000);

    // APERTA FECHAR NA MSG DE ALERTA CASO O PERIODO JÁ TENHA SIDO CALCULADO 
    frameSecond = await page.$("iframe[class='session']");
    framePage = await frameSecond.contentFrame();
    const msgPerido = await framePage.$x("//div[@id='COMP4512']/button");
    if (Object.keys(msgPerido).length > 0) {
        await frame.focus("#COMP4512 > button");
        await frame.click("#COMP4512 > button");
    }

    // CLICA EM OK CASO O PERIODO ANTERIOR ESTEJA ABERTO 
    let loop = true
    while (loop) {
        page.on('framedetached', (frame) => {
            loop = false;
        });
        frameSecond = await page.$("iframe[class='session']");
        framePage = await frameSecond.contentFrame();
        const periodoAberto = await framePage.$x("//div[@id='COMP6013']/button");
        if (Object.keys(periodoAberto).length > 0) {
            await frame.focus("#COMP6013 > button");
            await frame.click("#COMP6013 > button");
        }
        await page.waitForTimeout(6000);
    };
    
    // FECHA O BROWSER
    await browser.close()

});

app();