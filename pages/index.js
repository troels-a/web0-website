import { useWeb3React } from '@web3-react/core';
import useError from 'base/hooks/useError';
import useWeb0 from 'base/hooks/useWeb0';
import ConnectButton from 'components/ConnectButton';
import Section from 'components/Section';
import { ethers } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import Grid from 'styled-components-grid';

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

export const Wrapper = styled.div`

    width: 100vw;
    display: flex;
    place-items: center;
    justify-content: center;
    flex-direction: column;

`

export const Logo = styled(p => <div {...p}>web0</div>)`
    font-family: Times New Roman, sans-serif;
    font-size: 10em;
    filter: blur(10px);
    letter-spacing: 0.05em;
    margin: 0 auto;
    ${p => p.animate && css`
        animation: ${pulse} 2s infinite;
    `}
`

const Input = styled.input`
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    margin-bottom: 20px;
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


export default function Index(){

    const inputRef = useRef();
    const {active} = useWeb3React();
    const web0 = useWeb0();
    const error = useError();

    const [pages, setPages] = useState([]);

    async function handleCreate(){
        if(active){

            try {
                await web0.write('createPages', {titles_: pages}, {value: ethers.utils.parseEther('0.001').mul(pages.length)});
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


        const title = inputRef.current.value;
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

        <Section halfHeight itemsCenter>
            <Logo/>
        </Section>

        <Section halfHeight textCenter contentCenter>

            <Grid.Unit>
                <h2>Build your dream onchain</h2>
                <p>
                    Extendable 100% onchain html pages.<br/>
                    <a href="#">Read this before continuing.</a>
                </p>
                <br/>
            </Grid.Unit>

            <Grid.Unit size={{sm: 10/12, md: 1/4}}>
                <Input type="text" ref={inputRef} onKeyDown={(e) => {if(e.key === 'Enter'){addPage()}}}/>
                {/* <span type="button" value="Add page" onClick={() => addPage()}>+</span> */}
                <Items>
                {pages.map((title, index) => <div key={index}>
                    <Remove onClick={(event) => removePage(index)}/><span>{title}</span>
                    </div>
                )}
                </Items>
                <Input type="button" onClick={handleCreate} value={pages.length > 1 ? 'Create pages' : 'Create page'}/>
                <small>
                (0.001 ETH per page + gas). Built by troels_a.
                </small>
            </Grid.Unit>

        </Section>


    </Wrapper>;

}