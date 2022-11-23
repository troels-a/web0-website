import web0ABI from '../../../base/abi/web0.json';
import { ethers } from "ethers";
import ABIAPI from 'abiapi';
import {bigNumbersToNumber} from 'abiapi/parsers';
import { getProvider } from "../../../base/provider";

const abi = new ABIAPI(web0ABI);
abi.supportedMethods = abi.getReadMethods();
abi.cacheTTL = 30;

abi.addGlobalParser(bigNumbersToNumber)

export default async (req, res) => {

    let html, error;
    const {page_id, ...query} = req.query;
    const method = 'html';

    const provider = getProvider();
    const contract = new ethers.Contract(process.env.WEB0_ADDRESS, web0ABI, provider);
    
    try {
        html = await contract[method](page_id, false);
    }
    catch(e){
        error = e.toString();
        html = e.toString();
    }

    const status = error ? 400 : 200;

    if(status == 200)
        res.setHeader(`Cache-Control`, `s-maxage=${abi.getMethodCacheTTL(method)}, stale-while-revalidate`)

    res.status(status).send(html);


}