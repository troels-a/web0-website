import BrowserFrame from "components/BrowserFrame";
import useBrowserFrame from "components/BrowserFrame/useBrowserFrame";
import { providers } from "ethers";
import Main from "templates/Main";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import { useState, useEffect } from "react";
import styled from "styled-components";

// Function to check if a string is an url
const isUrl = (str) => {
  try {
      // If the string is not a valid URL, an error will be thrown
      new URL(str);
      return true;
    } catch {
      return false;
    }
  
}

const getBaseUrl = () => {
    if(process.env.NEXT_PUBLIC_VERCEL_ENV){
        // Use the process.env variables to construct the base URL
        if(process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'){
            return `https://web0.page`;
        }
        else {
            return `https://${process.env.VERCEL_URL}`;
        }
    }
    else {
        // Use the request object to construct the base URL
        return `http://localhost:3000`;
    }
};




const IFrame = styled.iframe`
  width: 100%;
  height: calc(100% - 30px);
  border: none;
  overflow: scroll;
`;

const Page = p => {

  const browser = useBrowserFrame();
  const router = useRouter();

  const [data, setData] = useState();

  async function fetchData(id) {

      browser.setLoading(true);

      const res = await fetch(
        `${getBaseUrl()}/api/web0/html?page_id_=${id}&encode_=true`
      ).then((res) => res.json())

      browser.setLoading(false);
      browser.setStatus(res.status);
      setData(res.result)

  }

  useEffect(() => {
    if(router.isReady && router.query.id)
      fetchData(router.query.id);
  }, [router]);

  return <Main>
    {data && <IFrame src={data} />}
  </Main>;
};

export default Page;