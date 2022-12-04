import BrowserFrame from "components/BrowserFrame";
import { providers } from "ethers";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import { useState, useEffect } from "react";

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


const Page = p => {

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const router = useRouter();

  async function fetchData(id) {
    setLoading(true);
    const res = await fetch(
      `${getBaseUrl()}/api/web0/html?page_id_=${id}&encode_=true`
    ).then((res) => res.json())

    const html = await res.result;
    setLoading(false);
    setData({ id, html });
  }

  useEffect(() => {
    if(router.query.id)
        fetchData(router.query.id);
  }, [router.query.id]);

  return (
    <div {...p}>
        <BrowserFrame loading={loading} url={data && data.html} address={router?.query?.id}>
            <div>Loading...</div>
        </BrowserFrame>
    </div>
  );
};

export default Page;
