/*************************************************************************
 * 
 * Qmonus SDK ApiFront
 * API proxy configuration tool for webpack
 * 
 * version 1.0
 * 
 * Copyright(C) 2015-2021 NTT Communications, Inc. All rights reserved
 * author Yosuke Mizuno
 * 
 *************************************************************************/

/*
##########################
## vue.config.js example
##########################
*/
const axios = require('axios');
const https = require('https');
const bodyParser= require('body-parser')

const agent = new https.Agent({
    rejectUnauthorized: false
});

const term = ( code , str )=>`\x1b[${code}m` + str  + '\x1b[0m'

const logger = {
    error: (msg) => console.error( `\n ${ term(41," FAIL ") } ${msg}` ),
    done: (msg) => console.log( `\n ${ term(32," SUCCESS ") } ${msg}` ),
    info: (msg) => console.info( `${ term(96," INFO ") } ${msg}` )
}


/**
 * @param {*} target    QmonusSDK-Portal endpoint
 * @param {*} username  Qmonus account username
 * @param {*} password  Qmonus account password
 * @param {*} options   proxy options
 * @returns 
 */
module.exports = ( { target , username , password , options={  headers:{} , inject:null } } )=>{
    let Cookie = null;  // Cached Cookie Value

    target = target.replace(/\/*$/ , "");

    if( !(typeof options.inject ) )
        delete options.inject;

    return  {
        allowedHosts: "all" ,
        async onAfterSetupMiddleware(devServer){
            devServer.app.use(bodyParser.json());
            try {
                let redirectRes = null;
                try {
                    let params = new URLSearchParams();
                    params.append('username', username);
                    params.append('password', password);
                    redirectRes = await axios.post( `${target}/login` , params , {httpsAgent: agent , maxRedirects: 0 })
                }
                catch (err) {
                    redirectRes = err.response;
                }

                if (redirectRes.status != 302)
                    throw new Error(`Login Redirect Fail , ${redirectRes.status} : ${redirectRes.statusText}`)
                Cookie = redirectRes.headers['set-cookie'][0];

                // login check
                await axios.get(`${target}/session`, { httpsAgent: agent, maxRedirects: 0, headers: { 'cookie': Cookie } })
            }
            catch(ex){
                logger.error( `Qmonus Login Failed ${target} : [user:${username} , password:${password}]` )
                console.error(ex.stack)
                throw new Error("Qmonus Login Failed")
            }
            logger.done( `Qmonus Login successfully : Cookie ${Cookie}` )

            // get session proxy
            devServer.app.get("/session" , async (req,res)=>{
                axios.get(`${target}/session` , {httpsAgent: agent ,  withCredentials: true ,  headers:{  'cookie':Cookie } })
                .then(ret=>{
                    
                    logger.info( `${target}/session : ${ret.data.account_id}(${ret.data.role_name})`  )
                    res.json(ret.data)
                })
                .catch(ex=>{
                    logger.error( `${target}/session : ${ex.message}`  )
                    res.status(ex.response.status).json(ex.response.data)
                })
                
            })

            // api proxy
            devServer.app.all( "/apis/*" , (req,res)=>{
                let axiosParams = {
                    method : req.method ,
                    url : `${target}${req.path}` ,
                    headers: { 
                        ...req.headers , 
                        ...{ 'cookie':Cookie } , 
                        ...(options.headers || {})
                    },
                    params : req.query ,
                    data : req.body
                };

                if( options.inject )
                    axiosParams = { ...axiosParams , ...options.inject(axiosParams) };

                logger.info( `${ axiosParams.method } ${axiosParams.url} `)
                console.debug(` headers : ` , axiosParams.headers )
                console.debug(` params  : ` , axiosParams.params )
                
                if( axiosParams.method == "GET")
                    delete axiosParams.data;
                else
                    console.debug(` data    : ` , axiosParams.data )

                return axios({
                    ...axiosParams ,
                    httpsAgent: agent , 
                    maxRedirects:0 , 
                    withCredentials: true 
                })
                .then(ret=>{
                    logger.info( `${ axiosParams.method } ${axiosParams.url} >> ${ret.status} : [server:${ret.headers["server"]} , content:${ret.headers["content-type"]}]`  )
                    res.status(ret.status)
                    Object.keys(ret.headers).forEach(function(k) {
                        switch (k.toLowerCase()) {
                            case "set-cookie":
                            case "cookie":
                            case "content-length":
                                break;
                            default:
                                res.set(k, ret.headers[k])
                        }
                    })
                    res.json(ret.data)
                })
                .catch(ex=>{
                    logger.error( `${ axiosParams.method } ${axiosParams.url} >> ${ex.response.status} : [${ex.message}]`  )
                    res.status(ex.response.status).json(ex.response.data)
                })
            })
        }
    }
}