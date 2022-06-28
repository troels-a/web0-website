import { useWeb3React } from '@web3-react/core';
import web0ABI from 'base/abi/web0.json';
import web0pluginsABI from 'base/abi/web0plugins.json';
import useContract from 'base/hooks/useContract.js';
import useError from 'base/hooks/useError.js';
import useWeb0 from 'base/hooks/useWeb0.js';
import Button from 'components/Button/Button.js';
import ConnectButton from 'components/ConnectButton/ConnectButton.js';
import Modal, { ModalActions, ModalInner } from 'components/Modal/Modal.js';
import Head from 'next/head';
import { useRouter } from 'next/router'
import fetch from "node-fetch";
import { useEffect, useRef, useState } from "react"
import styled from 'styled-components';
import {Logo} from './index.js';


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

const AdminButton = styled.div`
    position: fixed;
    width: 80px;
    height: 60px;
    top: 0;
    background-color: grey;
    right: 0;
    z-index: 100;
    transition: transform 200ms;
    transform: translate(60%, -60%) rotate(45deg);
    cursor: pointer;
    &:hover {
        transform: translate(40%, -40%) rotate(45deg);
    }
`


export default function Page(){

    
    const [url, setUrl] = useState(false);
    const [title, setTitle] = useState(false);
    const [plugins, setPlugins] = useState(false);
    const {query} = useRouter();
    const {page_id} = query;
    const {account} = useWeb3React();
    const error = useError();

    const web0 = useContract({endpoint: '/api/web0', address: process.env.NEXT_PUBLIC_WEB0_ADDRESS, abi: web0ABI});
    const web0plugins = useContract({endpoint: '/api/web0plugins', abi: web0pluginsABI});


    const [admin, setAdmin] = useState(false);

    useEffect(() => {

        if(web0.contract){
            web0.read('plugins', {page_id_: page_id}).then((data) => {
                if(data.result)
                    web0plugins.setOptions({address: data.result});
                if(data.error)
                    error.send(data.error)
            });
        }

    }, [web0.contract]);

    useEffect(() => {
        if(web0plugins.contract){
            setPlugins('loading');
            web0plugins.read('list', {page_id_: page_id}).then(data => {
                if(data.result)
                    setPlugins(data.result);
                if(data.error)
                    error.send(data.error)
            });
        }
    }, [web0plugins.contract])

    
    const addRef = useRef();

    async function fetchPage(page_id){
        let res = await web0.read('html', {page_id_: page_id, encode_: true});
        setUrl(res.result);
        res = await web0.read('getPageTitle', {page_id_: page_id});
        setTitle(res.result);
    }

    async function handlePreview(address, params){
        const preview = await web0plugins.read('preview', {page_id_: page_id, preview_: [address, params]});
        setUrl(preview);
    }

    async function handleAdd(){

    }

    useEffect(() => {
        if(page_id)
            fetchPage(page_id);
    }, [page_id])

    return <Wrapper>
        {title && <Head>
            <title>{title}</title>
        </Head>}
        {url && <AdminButton onClick={() => setAdmin(true)}/>}
        <Modal show={admin}>
            <ModalInner>
            <h1>Admin</h1>
            {account && <div>
                <h3>Plugins</h3>
                {plugins == 'loading' && <div>Loading plugins</div>}
                {(plugins != 'loading' && plugins.length > 0) && plugins.map(plugin => {
                    <div>{plugin.name}</div>
                })}
                {(plugins != 'loading' && plugins.length == 0) && <div>No plugins</div>}
            </div>}
            <ModalActions actions={[
                {label: 'close', callback: () => setAdmin(false)}
            ]}/>
            </ModalInner>
        </Modal>

        {url ? <Frame src={url} width="100%" height="100%"/> : <Logo animate={true}/>}
    </Wrapper>;

}