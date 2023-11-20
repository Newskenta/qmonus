module.exports = async ( { params , root , page , actions ,expect} )=>{
    await actions.logger("API Request Test Start.")

    // 一度書いて削除
    await page.locator('input[type="text"]').fill('/test');
    await page.locator('input[type="text"]').fill('');

    let message = await page.locator('text=必ず入力してください')
    await expect(message).toHaveText("必ず入力してください")

    await root.waitForTimeout(200)
    await actions.screenshot( "required" );

    // 30文字超過
    await page.locator('input[type="text"]').fill(params.api.limit_length);

    message = await page.locator('text=30文字以内で入力してください')
    await expect(message).toHaveText("30文字以内で入力してください")

    await root.waitForTimeout(200)
    await actions.screenshot( "limit_length" );

    // 正しいpath
    await page.locator('input[type="text"]').fill(params.api.success_path);
    await page.locator('button:has-text("GET HealthCheck")').click();

    // 200確認
    let code = await page.locator('text=200')
    await expect(code).toHaveText("200")

    await root.waitForTimeout(200)
    await actions.screenshot( "API Success" );

    // 404 path
    await page.locator('input[type="text"]').fill(params.api.fail_path);
    await page.locator('button:has-text("GET HealthCheck")').click();

    // 404確認
    code = await page.locator('text=404')
    await expect(code).toHaveText("404")

    await root.waitForTimeout(200)
    await actions.screenshot( "API Failed" );
}