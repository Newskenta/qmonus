module.exports = async ( { params , root , page , actions ,expect} )=>{
    await actions.logger("Tutorial Link Test Start.")

    // Click text=Tutorial page
    await page.locator(`text=${params.link.text}`).click();
    await expect(page).toHaveURL(params.link.url);

    await root.waitForTimeout(500)
    await actions.screenshot( "page goto Success." );
}