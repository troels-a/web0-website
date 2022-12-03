import { ethers } from "ethers";
import { useEffect, useState } from "react";
import fetch from 'node-fetch';
import { useWeb3React } from "@web3-react/core";
import { isObject, set, values } from "lodash";


function objectToArray(input){

    const arr = [];

    for (const key in input) {

        if (Object.hasOwnProperty.call(input, key)) {
            if(isObject(input[key]))
                arr.push(objectToArray(input[key]));
            else
                arr.push(input[key]);
        }
    }

    return arr;

}


export default function useContract(options){

    const [contract, setContract] = useState();
    const {library, account} = useWeb3React();

    const [endpoint, setEndPoint] = useState();
    const [abi, setAbi] = useState();
    const [address, setAddress] = useState();

    async function setOptions(options){

        if(options.endpoint)
           setEndPoint(options.endpoint);
        if(options.abi)
            setAbi(options.abi);
        if(options.address)
            setAddress(options.address);

    }


    useEffect(() => {
        if(options)
            setOptions(options)
    }, [])
    
    useEffect(() => {
    }, [contract])

    useEffect(() => {

        if(library && abi && address){
            const _contract = new ethers.Contract(address, abi, library.getSigner());
            setContract(_contract);
        }

    }, [account, library, abi, address])


    async function read(method, args = false){
        let req = `${endpoint}/${method}`;
        if(args){
            let query = '?';
            let first = true;
            for (const key in args) {

                if (Object.hasOwnProperty.call(args, key)) {

                    if(first){
                        first = false;
                    }
                    else {
                        query += '&';
                    }

                    query += key+'='+args[key];
                }
            }

            req = req+query;
        }

        return await fetch(req).then(req => req.json());

    }


    async function write(method, args, extra = null){
        if(contract){
            const _args = objectToArray(args);
            return contract[method](..._args, extra)
        }
        else {
            console.log('No contract')
        }
    }


    return {read, write, setOptions, contract};

}