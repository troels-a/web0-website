import web0ABI from '../../../base/abi/web0.json';
import { ethers } from "ethers";
import ABIAPI from 'abiapi';
import {bigNumbersToNumber} from 'abiapi/parsers';
import { getProvider } from "../../../base/provider";

export default async (req, res) => {


    const abi = new ABIAPI(web0ABI);
    abi.supportedMethods = abi.getReadMethods();
    abi.cacheTTL = 10;
    abi.addGlobalParser(bigNumbersToNumber)

    const provider = getProvider();
    const contract = new ethers.Contract(process.env.WEB0_ADDRESS, web0ABI, provider);
    const data = {
        status: 200,
        result: null
    };



    abi.addParamParser('html', async (params) => {

        let count = await contract.getPageCount();
        count = count.toNumber();
        if(params.page_id_ > count-1){
            data.status = 404;
            data.error = 'Page not found';
        }

        return params;

    });



    const {method, ...query} = req.query;

    if(abi.supportsMethod(method)){
        
        try {
            let params = await abi.parseParams(method, query);
            params = abi.methodParamsFromQuery(method, params);
            data.result = await contract[method](...params);
            data.result = await abi.parse(method, data.result);
        }
        catch(e){
            data.error = e.toString();
        }

    }
    else{
        data.error = 'Unsupported method';
        data.status = 500;
    }


    if(data.status == 200)
        res.setHeader(`Cache-Control`, `s-maxage=${abi.getMethodCacheTTL(method)}, stale-while-revalidate`)

    res.status(data.status).json(data);


}