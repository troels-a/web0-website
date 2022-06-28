import useContract from "base/hooks/useContract";
import { useEffect, useRef, useState } from "react";
import web0pluginsABI from 'base/abi/web0plugins.json';
import web0pluginABI from 'base/abi/web0plugin.json';


export default function InstallPlugin({web0, pageID, ...p}){


    const [plugin, setPlugin] = useState(false);
    const web0plugins = useContract({endpoint: '/api/web0plugins', abi: web0pluginsABI});
    const pluginInputRef = useRef();

    async function handleLookup(e){
        e.preventDefault();
        const address = pluginInputRef.current.value;
        const plugin = await fetch(`/api/web0plugin/${address}`).then(res => res.json()).then(res => res.result);
        setPlugin(plugin);
    }

    async function handlePreview(address, params){
        const preview = await web0plugins.read('preview', {page_id_: pageID, preview_: [address, params], encode_: true});
        setPreviewUrl(preview);
    }

    async function handleInstall(){

    }

    // useEffect(() => {

    //     if(web0.contract){
    //         web0.read('plugins', {page_id_: pageID}).then((data) => {
    //             if(data.result)
    //                 web0plugins.setOptions({address: data.result});
    //             if(data.error)
    //                 error.send(data.error)
    //         });
    //     }

    // }, [web0.contract]);

    // useEffect(() => {
    //     if(web0plugins.contract){
    //         setPlugins('loading');
    //         web0plugins.read('list', {page_id_: pageID}).then(data => {
    //             if(data.result)
    //                 setPlugins(data.result);
    //             if(data.error)
    //                 error.send(data.error)
    //         });
    //     }
    // }, [web0plugins.contract])


    return <div>
        <h3>Install plugin</h3>
        <form onSubmit={handleLookup}>
            <input type="text" ref={pluginInputRef}/>
            <input type="submit" label="Lookup"/>
        </form>
        {plugin && <div>
            {plugin.name}
            {plugin.params.map(param => <div>{param.type} - {param.description}</div>)}
        </div>}
    </div>

}