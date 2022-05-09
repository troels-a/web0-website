import { ethers } from "ethers";
import abi from 'base/abi/web0.json';
import { useEffect, useState } from "react";
import fetch from 'node-fetch';
import { useWeb3React } from "@web3-react/core";
import { values } from "lodash";


function objectToArray(input){

    const arr = [];

    for (const key in input) {

        if (Object.hasOwnProperty.call(input, key)) {
            if(typeof input[key] == 'object' && Object.prototype.toString.call(input) === '[object Object]')
                arr.push(objectToArray(input[key]));
            else
                arr.push(input[key]);
        }
    }

    return arr;

}


export default function useWeb0(init = false){

    const [contract, setContract] = useState();
    const {library, account} = useWeb3React();
    
    useEffect(() => {

        if(account && library){
            const _contract = new ethers.Contract(process.env.NEXT_PUBLIC_WEB0_ADDRESS, abi, library.getSigner());
            setContract(_contract);
        }

    }, [account, library])


    async function read(method, args = false){
        let req = `/api/web0/${method}`;
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
    }


    useEffect(() => {

        return () => {

        }
        
    }, []);

    return {read, write};

}