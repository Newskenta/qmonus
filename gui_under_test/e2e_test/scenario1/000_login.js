module.exports = async ( { params , root , page , actions ,expect} )=>{
    await actions.logger("Login Start.")
    
    //ログインページ
    await page.goto( params.url , {waitUntil: "domcontentloaded"} );
    await actions.screenshot( "go to loginpage." );
    //loginpageの判定
    let titleSelector = await root.$("head > title")
    let title = await (await titleSelector.getProperty('textContent')).jsonValue()
    
    //Login with Qmonus account
    if(title == "Login | Qmonus-SDK"){
         await page.locator('img').first().click();
        
         await page.locator('[placeholder="username"]').fill(params.username);
         await page.locator('[placeholder="password"]').fill(params.password);
        
         await page.locator('button:has-text("Login")').click();
    }
    
    await root.waitForTimeout(500)
    await actions.screenshot( "Landing Success." );
}
