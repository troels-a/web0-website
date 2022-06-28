import web0ABI from '../../../base/abi/web0.json';
import web0pluginsABI from '../../../base/abi/web0plugins.json';
import { ethers } from "ethers";
import ABIAPI from 'abiapi';
import {bigNumbersToNumber} from 'abiapi/parsers';
import { getProvider } from "../../../base/provider";

const abi = new ABIAPI(web0pluginsABI);
abi.supportedMethods = abi.getReadMethods();
abi.cacheTTL = 10;

abi.addGlobalParser(bigNumbersToNumber)

export default async (req, res) => {

    const data = {};
    const {method, ...query} = req.query;

    if(abi.supportsMethod(method)){

        const provider = getProvider();

        const web0 = new ethers.Contract(process.env.WEB0_ADDRESS, web0ABI, provider);
        const plugins_address = await web0.plugins();

        const contract = new ethers.Contract(plugins_address, web0pluginsABI, provider);
        
        try {
            data.result = await contract[method](...abi.methodParamsFromQuery(method, query));
            data.result = abi.parse(method, data.result);
        }
        catch(e){
            data.error = e.toString();
        }

    }
    else{
        data.error = 'Unsupported method';
    }

    const status = data.error ? 400 : 200;

    if(status == 200)
        res.setHeader(`Cache-Control`, `s-maxage=${abi.getMethodCacheTTL(method)}, stale-while-revalidate`)

    res.status(status).json(data);


}