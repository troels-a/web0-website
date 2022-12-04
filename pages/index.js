import { useWeb3React } from '@web3-react/core';
import useContract from 'base/hooks/useContract';
import useError from 'base/hooks/useError';
import useWeb0 from 'base/hooks/useWeb0';
import ConnectButton from 'components/ConnectButton';
import Section from 'components/Section';
import { ethers } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import Grid from 'styled-components-grid';
import web0serverABI from 'base/abi/web0server.json';
import Link from 'next/link';
import BrowserFrame from 'components/BrowserFrame';

const nullAddress = '0x0000000000000000000000000000000000000000';

const pulse = keyframes`
    0% {
        filter: blur(10px);
    }
    50% {
        filter: blur(5px);
    }
    100% {
        filter: blur(10px);
    }
`


const Body = styled.div`
    max-width: 1000px;
    margin: 20px auto;
    display: flex;
    flex-direction: column;
    text-align: center;
    place-items: center;
    place-content: center;
    min-height: calc(100% - 40px);

`

export const Wrapper = styled.div`

`

export const Logo = styled(p => <img {...p} src="/logo.gif"/>)`

    place-self: center;
    margin: 0 auto;
    
`

const Input = styled.input`
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    margin-bottom: 20px;
    ${p => p.clickable && css`
        cursor: pointer!important;
    `}
`

const Remove = styled.span`
    position: relative;
    &:before {
        content: '×';
        cursor: pointer;
        font-size: 1.5em;
        display: block;
        position: absolute;
        transform: translate(0%, -10%);
    }
`

const Items = styled.div`
    display: flex;
    flex-direction: column;
    > div {
        padding: 20px;
        margin-bottom: 20px;
        background-color: rgba(0,0,0,0.1);
    }
`

const Form = styled.form`
    margin: 0 auto;
    min-width: 300px;
`



export default function Index(){

    const inputRef = useRef();
    const {active} = useWeb3React();
    const web0 = useWeb0();
    const web0server = useContract({
        address: process.env.NEXT_PUBLIC_WEB0SERVER_ADDRESS,
        abi: web0serverABI,
        endpoint: '/api/web0server'
    })
    
    const error = useError();

    const [pages, setPages] = useState([]);

    async function handleCreate(){
        if(active){
            try {
                await web0server.write('issuePages', {titles_: pages, template_: nullAddress}, {value: 0});
            }
            catch(err){
                console.log(err)
            }
        }
        else{
            alert('Please connect');
        }
    }

    function addPage(e){


        const title = inputRef.current.value.trim();
        if(title == ''){
            return;
        }

        inputRef.current.value = '';
        setPages(pages => {
            const newpages = [...pages];
            newpages.unshift(title);
            return newpages;
        });
    }

    function removePage(index){

        setPages(pages => {
            let newpages = [...pages];
            newpages.splice(index, 1);
            return newpages;
        })
        
    }


    return <Wrapper>

        <BrowserFrame>
            <Body>

        

            <Grid.Unit>
            <Logo/>
                <h1>200 OK</h1>
                <h2><ConnectButton/></h2>
                <p>
                    Extendable 100% onchain html pages.<br/>
                </p>
                <br/>
            </Grid.Unit>

            {active && 
            <Grid.Unit as={Form} size={{sm: 10/12, md: 2/6}}>
                <Input type="text" style={{width: 'calc(80% - 10px)', marginRight: '20px'}}ref={inputRef} onKeyDown={(e) => {if(e.key === 'Enter'){addPage()}}}/>
                <Input type="button" style={{width: 'calc(20% - 10px)'}} value="+" onClick={addPage} clickable/>
                <Items>
                {pages.map((title, index) => <div key={index}>
                    <Remove onClick={(event) => removePage(index)}/><span>{title}</span>
                    </div>
                )}
                </Items>
                <Input clickable type="button" onClick={handleCreate} disabled={pages.length == 0} value={pages.length == 0 ? 'Input page title' : (pages.length > 1 ? `Create ${pages.length} pages` : 'Create page')}/>
                <small>
                </small>
            </Grid.Unit>
            }

            <Grid.Unit>
                <small>
                    Built by <a href="https://twitter.com/troels_a" target="_blank">troels_a</a> · <a href={`https://etherscan.io/address/${process.env.NEXT_PUBLIC_WEB0_ADDRESS}`}>Contract</a>
                </small>
            </Grid.Unit>

        </Body>
        </BrowserFrame>

    </Wrapper>;

}