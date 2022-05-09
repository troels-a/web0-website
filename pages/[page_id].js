import { useRouter } from 'next/router'
import fetch from "node-fetch";
import { useEffect, useState } from "react"
import styled from 'styled-components';
import {Wrapper, Logo} from './index.js';


const Frame = styled.iframe`
    width: 100vw;
    height: 100vh;
    border: 0;
`

export default function Page(){

    const [url, setUrl] = useState(false);
    const router = useRouter();

    async function fetchPage(page_id){
        // console.log(page_id)
        const json = await fetch(`/api/web0/html?page_id_=${page_id}&encode_=true`).then(res => res.json());
        setUrl(json.result);
    }

    useEffect(() => {
        if(router.query.page_id)
            fetchPage(router.query.page_id);
    }, [router.query.page_id])

    return <Wrapper>{url ? <Frame src={url} width="100%" height="100%"/> : <Logo animate={true}/>}</Wrapper>;

}