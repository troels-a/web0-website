import BrowserFrame from 'components/BrowserFrame';
import fetch from 'node-fetch';
import { useState, useEffect} from 'react';
import styled from 'styled-components';

const getBaseUrl = () => {
    if(process.env.VERCEL_URL){
      // Use the process.env variables to construct the base URL
      return process.env.VERCEL_URL
    }
    else {
      // Use the request object to construct the base URL
      return `http://localhost:3000`
    }
  }

const Body = styled.div`
    width: 80%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    > div {
        margin-bottom: 20px;
    }
`
  

const Browser = ({ id, html, ...p }) => {
        
    return <div {...p}>
        <BrowserFrame>
            <Body>
            <h1>Welcome to Web0!</h1>
            <p>
                Web0 is a decentralized web hosting platform that allows you to host your own websites on the Ethereum blockchain. By using a decentralized web hosting platform, you can host your website on the blockchain and have it be accessible to anyone in the world. You can also use Web0 to host your own websites and have them be accessible to anyone in the world.
            </p>
            </Body>
        </BrowserFrame>
    </div>
    
};


export default Browser;
