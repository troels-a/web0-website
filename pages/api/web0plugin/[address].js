import web0pluginABI from '../../../base/abi/web0plugin.json';
import { ethers } from "ethers";
import ABIAPI from 'abiapi';
import {bigNumbersToNumber} from 'abiapi/parsers';
import { getProvider } from "../../../base/provider";

const method = 'info';

const abi = new ABIAPI(web0pluginABI);
abi.supportedMethods = abi.getReadMethods();
abi.cacheTTL = 10;

abi.addParser(method, value => {
    return {
        name: value[0],
        params: value[1].map(param => {
            return {
                type: param[0],
                description: param[1]
            }
        })
    };
})

export default async (req, res) => {

    const data = {};
    const {address, ...query} = req.query;

    const provider = getProvider();
    const contract = new ethers.Contract(address, web0pluginABI, provider);
    
    try {
        data.result = await contract[method]();
        data.result = await abi.parse(method, data.result);
    }
    catch(e){
        data.error = e.toString();
    }

    const status = data.error ? 400 : 200;

    if(status == 200)
        res.setHeader(`Cache-Control`, `s-maxage=${abi.getMethodCacheTTL(method)}, stale-while-revalidate`)

    res.status(status).json(data);


}