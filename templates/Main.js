import useBrowserFrame from "components/BrowserFrame/useBrowserFrame";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
  font-size: 2em;
`;

export const Content = styled.div`
    margin: 20px;
    box-sizing: border-box;
`

export default function Main({children, ...props}){

    // Main template will output browser frame and children, an handle errors
    const browser = useBrowserFrame();

    return <>
    {browser.loading
    ? 
    <Wrapper>Loading...</Wrapper>
    : 
    <>
        {browser.status === 200 && children}
        {browser.status !== 200 && <Wrapper>{browser.status}</Wrapper>}
    </>
    }
    </>;

}