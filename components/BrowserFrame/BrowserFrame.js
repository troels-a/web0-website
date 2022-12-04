import { useRouter } from 'next/router';
import {useState} from 'react';
import styled, {css} from 'styled-components';

const TopBar = styled.div`
    
    border: 0px solid #ccc;
    border-bottom-width: 1px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    height: 30px;
    background-color: #eee;
    padding: 0 10px;
    box-sizing: border-box;
    z-index: 1;
    transition: all 0.2s ease-in-out;

    &:after {
        content: '';
        display: table;
        clear: both;
    }

`;


const BrowserButton = styled.div`
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 50%;
    cursor: pointer;
    margin-left: 5px;
`


const CloseButton = styled(BrowserButton)`
  float: right;
`;

const FullscreenButton = styled(BrowserButton)`
  float: right;
  background-color: #0f0;
`;

const IFrame = styled.iframe`
  width: 100%;
  height: calc(100% - 30px);
  border: none;
  overflow: scroll;
`;

const Content = styled.div`
    width: 100%;
    height: calc(100% - 30px);
    box-sizing: border-box;
    background-color: #fff;
    overflow: scroll;
`

const UrlBar = styled(({address, ...p}) => {
    const router = useRouter();
    const [inputValue, setInputValue] = useState(address);
  
    const handleSubmit = (event) => {
      event.preventDefault();
      router.push({
        pathname: '/[id]',
        query: { id: inputValue },
      });
    };
  
    return (
      <form {...p} onSubmit={handleSubmit}>
          <input type="number" value={inputValue} onChange={event => setInputValue(event.target.value)}/>
          {inputValue ? <button type="submit">></button> : null}
      </form>
    );
})`
    
    width: 100%;
    height: 100%;
    font-size: 0.75em;
    color: #333;
    line-height: 2.5em;
    font-family: 'Courier New', mono-space;
    text-align: left;

    input {
        border: none;
        background-color: transparent;
        padding: 0px;
        box-sizing: border-box;
        outline: none;
        display: inline-block;
        width: auto;
        height: 100%;
        padding: 0;
        line-height: 1em;
        margin: 0;
        padding-left: 60px;
        font: inherit;
        display: inline-block;
    }

    button {
        border: 0;
        font: inherit;
        background-color: transparent;
        cursor: pointer;
        padding: 0;
    }

    &:before {
        content: 'web0://';
        display: inline-block;
        color: inherit;
        position: absolute;
        top: 0px;
    }
`


const BrowserFrameWrapper = styled.div`

    position: relative;
    margin: 0 auto;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
    border: 1px solid rgba(0,0,0,0.1);
    transition: all 0.2s ease-in-out;


    ${p => p.expand ? 
    css`
        width: 100vw;
        height: 100vh;
        
        > ${TopBar} {
            border-color: transparent;
            background-color: transparent;
            pointer-events: hover;
            opacity: 0;
            &:hover {
                opacity: 1;
            }

        }
        
    `:
    css`
        width: 90vw;
        height: 90vh;  
        margin-top: 5vh;
    `}


`;


const BrowserFrame = ({ url, children, address}) => {

    const [fullscreen, setFullscreen] = useState(false);

  return (
    <BrowserFrameWrapper expand={fullscreen}>

      <TopBar>
        <UrlBar type="text" address={address}/>
        <FullscreenButton onClick={() => setFullscreen(!fullscreen)} />
      </TopBar>
      <Content>
          {url ? <IFrame src={url} /> : children}
      </Content>

    </BrowserFrameWrapper>
  );
};

export default BrowserFrame;
