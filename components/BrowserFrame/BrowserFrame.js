import { useRouter } from 'next/router';
import {useEffect, useState} from 'react';
import styled, {css} from 'styled-components';
import Link from 'next/link';
import useBrowserFrame from './useBrowserFrame';
import NotFound from 'pages/404';

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

    ${p => p.loading && css`
        animation: gradientBG 500ms ease infinite;
        @keyframes gradientBG {
            0% {
              background-color: ##eee;
            }
            50% {
                background-color: #f5f5f5;
            }
            100% {
                background-color: #eee;
            }
          }        
    `}

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


const FullscreenButton = styled(BrowserButton)`
  float: right;
  background-color: #0f0;
`;

const Content = styled.div`
    width: 100%;
    height: calc(100% - 30px);
    box-sizing: border-box;
    background-color: #fff;
    overflow: scroll;
    transition: all 0.2s ease-in-out;
    // ${p => p.loading && css`
    //     opacity: 0;
    // `}
`

const UrlBar = styled(({location, ...p}) => {

    const router = useRouter();
    const browser = useBrowserFrame();

    const [url, setUrl] = useState('');
  
    const handleSubmit = (event) => {
      event.preventDefault();
      const path = `/${url}`;
      router.push(path);
    };

    // Set location from router path when the router changes
    useEffect(() => {
        if(router.asPath){
            const location = router.asPath.replace('/', '');
            browser.setLocation(location)
            setUrl(location);
        }
    }, [router]);
  
    return <form {...p} onSubmit={handleSubmit}>
          <Link href="/">
            web0
          </Link>
          <span>
          ://
          </span>
          <input style={{width: `${20 + (url.length)*7.2}px`}} value={url} onChange={event => setUrl(event.target.value)}/>
          {/* <button type="submit">go</button> */}
      </form>
      
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
        padding-left: 0;
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
`


const BrowserFrameWrapper = styled.div`

    position: relative;
    margin: 0 auto;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
    border: 1px solid rgba(0,0,0,0.1);
    transition: all 0.2s ease-in-out;

    ${p => p.loading && css`
        opacity: 0.5;
    `}

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



const BrowserFrame = ({children}) => {

    const browser = useBrowserFrame();

    return (
        <BrowserFrameWrapper expand={browser.fullscreen}>

        <TopBar loading={browser.loading}>
            <UrlBar type="text" location={browser.location}/>
            <FullscreenButton onClick={() => browser.setFullscreen(!browser.fullscreen)} />
        </TopBar>

        <Content>
            {children}
        </Content>

        </BrowserFrameWrapper>
    );
};

export default BrowserFrame;
