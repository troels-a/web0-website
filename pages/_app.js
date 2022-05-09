import { createGlobalStyle, ThemeProvider } from 'styled-components'
import {breakpoint} from 'styled-components-breakpoint';
import theme from 'base/style/theme';
import Web3, { utils } from "web3";
import { Web3ReactProvider, useWeb3React } from "@web3-react/core";
import { getProvider } from 'base/provider';
import { ErrorProvider } from '@hook/useError';
// import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import {ethers} from 'ethers';
import { EthNetProvider } from '@hook/useEthNet';
import ConnectButton, { ConnectIntent } from 'components/ConnectButton';
import ErrorMessage from 'components/ErrorMessage/ErrorMessage';

function getLibrary(provider){
  return new ethers.providers.Web3Provider(provider);
}


const GlobalStyle = createGlobalStyle`
    
  body {

    font-family: ${theme.fonts[0].family};
    letter-spacing: ${theme.fonts[0].letterSpacing};
    background-color: ${p => p.theme.colors.bg};
    color: ${theme.colors.text};
    margin: 0;
    padding: 0;
    display: flex;
    width: 100%;
    height: 100vh;

    > div {
      width: 100%;
    }

  }

  h1, h2, h3, h4, h5 {
    font-weight: normal;
    font-style: italic;
  }

`


export default function App({ Component, pageProps }) {

  return (
        <ErrorProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            <EthNetProvider chainID={process.env.NEXT_PUBLIC_NETWORK}>
              <ConnectIntent>
              <ThemeProvider theme={theme}>
                {/* <ErrorMessage/> */}
                <GlobalStyle />
                <ErrorMessage/>
                <ConnectButton/>
                <Component {...pageProps} />
              </ThemeProvider>
              </ConnectIntent>
            </EthNetProvider>
        </Web3ReactProvider>
       </ErrorProvider>
  )

}
