import BrowserFrame from 'components/BrowserFrame';
import fetch from 'node-fetch';
import { useState, useEffect} from 'react';


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
  

const Page = ({ id, html, ...p }) => {

    const [loading, setLoading] = useState(true);
        
    return <div {...p}>
        <BrowserFrame url={html ? html : ''} address={id}/>
    </div>
    
};

export async function getStaticProps({ params }) {
    
    const { id } = params;
    const res = await fetch(`${getBaseUrl()}/api/web0/html?page_id_=${id}&encode_=true`).then(res => res.json());
    const html = await res.result;
    return {
        props: {
            id, html
        },
        revalidate: 10
    };
    
}

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking'
    };
}

export default Page;
