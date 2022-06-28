import { useWeb3React } from '@web3-react/core';
import web0ABI from 'base/abi/web0.json';
import useContract from 'base/hooks/useContract.js';
import useError from 'base/hooks/useError.js';
import useWeb0 from 'base/hooks/useWeb0.js';
import Button from 'components/Button/Button.js';
import ConnectButton, { ConnectIntent, useConnectIntent } from 'components/ConnectButton/ConnectButton.js';
import Modal, { ModalActions, ModalInner } from 'components/Modal/Modal.js';
import InstallPlugin from 'components/Tools/InstallPlugin.js';
import Head from 'next/head';
import { useRouter } from 'next/router'
import fetch from "node-fetch";
import { useEffect, useRef, useState } from "react"
import styled from 'styled-components';
import {Logo} from './index.js';


const tools = [
    {title: 'Install plugin', component: InstallPlugin}
]


const Frame = styled.iframe`
    width: 100vw;
    height: 100vh;
    border: 0;
`

const Wrapper = styled.div`
    min-width: 100vw;
    min-height: 100vh;
    display: flex;
    place-items: center;
`

const AdminTop = styled.div`
    display: flex;
    position: fixed;
    top: 10px;
    right: 10px;
    padding: 10px;
    > * {
        margin-right: 10px;
    }
`


export default function Page(){

    
    const [url, setUrl] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(false);
    const [title, setTitle] = useState(false);
    const {query} = useRouter();
    const {page_id} = query;
    const {account} = useWeb3React();
    const error = useError();

    const web0 = useContract({endpoint: '/api/web0', address: process.env.NEXT_PUBLIC_WEB0_ADDRESS, abi: web0ABI});


    const [tool, setTool] = useState(false);
    
    async function fetchPage(page_id){
        let res = await web0.read('html', {page_id_: page_id, encode_: true});
        setUrl(res.result);
        res = await web0.read('getPageTitle', {page_id_: page_id});
        setTitle(res.result);
    }

    useEffect(() => {
        if(page_id)
            fetchPage(page_id);
    }, [page_id])

    const {active} = useWeb3React();
    

    return <Wrapper>
        {title && <Head>
            <title>{title}</title>
        </Head>}
        {url && <AdminTop>{active && tools.map(tool => 
            <a href="#" onClick={() => setTool(tool)}>{tool.title}</a>
        )} <ConnectButton/></AdminTop>}
        
        <Modal show={tool && active}>
            <ModalInner>
            <h1>{tool && tool.label}</h1>
            {tool && <tool.component web0={web0} pageID={page_id}/>}
            <ModalActions actions={[
                {label: 'close', callback: () => setTool(false)}
            ]}/>
            </ModalInner>
        </Modal>

        {url ? <Frame src={url} width="100%" height="100%"/> : <Logo animate={true}/>}
    </Wrapper>;

}