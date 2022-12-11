import useBrowserFrame from 'components/BrowserFrame/useBrowserFrame';
import  Main, {Content} from 'templates/Main';
import { useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

// Create array of 100 slots
const slots = Array.from(Array(100).keys());


const Slots = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 10px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
`

const Slot = styled.div`
    width: 100%;
    height: 50px;
    background-color: #efefef;
    border-radius: 5px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    font-style: italic;
`

export default function Plugins(){

    // Plugins page will show all plugins available for the current page

    const [plugins, setPlugins] = useState([]);
    const browser = useBrowserFrame();
    const router = useRouter();

    async function fetchPlugins(id){

        // fetch plugins for page id
        browser.setLoading(true);
        const res = await fetch(`/api/web0plugins/list?page_id_=${id}`).then(res => res.json());
        setPlugins(res.result);
        browser.setLoading(false);

    }

    useEffect(() => {
        if(router.query.id)
            fetchPlugins(router.query.id);
    }, [router.query.id])

    useEffect(() => {
        console.log(plugins)
    }, [plugins])

    return <Main>
        <Content>
        {plugins?.length > 0 && <Slots>
            {slots.map(i => {

                const plugin = plugins[i];
                
                return  <Slot key={i}>
                {plugin && <div>{plugins[i].name}</div>}
                </Slot>

            })}
        </Slots>}
        {plugins?.length == 0 && <div>No plugins</div>}
        </Content>
    </Main>

}