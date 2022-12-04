import BrowserFrame from "components/BrowserFrame";
import { providers } from "ethers";
import fetch from "node-fetch";
import { useState, useEffect } from "react";

const getBaseUrl = () => {
    if(process.env.NEXT_PUBLIC_VERCEL_ENVIRONMENT){
        // Use the process.env variables to construct the base URL
        if(process.env.NEXT_PUBLIC_VERCEL_ENVIRONMENT === 'production'){
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

const Page = ({ id, ...p }) => {

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        `${getBaseUrl()}/api/web0/html?page_id_=${id}&encode_=true`
      ).then((res) => res.json())

      const html = await res.result;
      
      setData({ id, html });
    }
    fetchData();
  }, []);

  return (
    <div {...p}>
        <BrowserFrame url={data && data.html} address={id}>
            <div>Loading...</div>
        </BrowserFrame>
    </div>
  );
};

export async function getStaticProps({ params }) {
  return {
    props: {
        id: params.id,
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export default Page;
