import useContract from "base/hooks/useContract";
import { useEffect, useRef, useState } from "react";
import web0pluginsABI from 'base/abi/web0plugins.json';
import web0pluginABI from 'base/abi/web0plugin.json';
import { useRouter } from "next/router";
import Modal from "components/Modal";
import { withTheme } from "styled-components";
import styled from "styled-components";

const nullAddress = '0x0000000000000000000000000000000000000000';


const PreviewModal = styled(({src, children, ...p}) => <Modal show={src} {...p}>{children}<iframe width="100%" height="100%" src={src} /></Modal>)`
  background-color: white;
  backdrop-filter: none;
  iframe {
    border: 0;
  }
`

export function ParamInput(props) {
  const { param, onChange } = props;
  const [value, setValue] = useState(param.value);
  const [error, setError] = useState(null);

  useEffect(() => {
    setValue(param.value);
  }, [param.value]);

  const handleChange = (e) => {
    setValue(e.target.value);
    if(onChange)
        onChange(e.target.value);
  }

  return (
    <div className="param-input">
      <input placeholder={param.description} type="text" value={value} onChange={handleChange} />
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default function InstallPlugin({web0, pageID, ...p}){

    const router = useRouter();
    const [plugin, setPlugin] = useState(false);
    const [pluginAddress, setPluginAddress] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(false);
    const web0plugins = useContract({endpoint: '/api/web0plugins', abi: web0pluginsABI});
    const pluginInputRef = useRef();

    async function fetchPluginsAddress(){
      web0plugins.setOptions({address: await web0.read('plugins').then(res => res.result)});
    }

    useEffect(() => {
      if(web0.contract){
        fetchPluginsAddress();
      }
    }, [web0.contract]);

    async function handleLookup(e){
        e.preventDefault();
        const address = pluginInputRef.current.value;
        const plugin = await fetch(`/api/web0plugin/${address}`).then(res => res.json()).then(res => res.result);
        setPluginAddress(address)
        setPlugin(plugin);
    }

    async function handlePreview(address, slot, params){
        setPreviewUrl(false);
        const preview = await web0plugins.read('preview', {page_id_: pageID, preview_: JSON.stringify([[address, slot, params]]), encode_: true});
        setPreviewUrl(preview.result);
    }

    async function handleInstall(address, slot, params){
      await web0plugins.write('install', {page_id_: pageID, plugins_: [[address, slot, params]]});
    }


    return <div>
        <h3>Install plugin</h3>
        <form onSubmit={handleLookup}>
            <input type="text" ref={pluginInputRef}/>
            <input type="submit" value="Fetch plugin info"/>
        </form>
        {plugin && <div>
            {plugin.name}
            {plugin.params.map(param => <ParamInput param={param}/>)}
            <button onClick={() => handlePreview(pluginAddress, 10, plugin.params.map(param => ['', 0, nullAddress, false]))}>Generate preview</button>
            <button onClick={() => handleInstall(pluginAddress, 10, plugin.params.map(param => ['', 0, nullAddress, false]))}>Install</button>
            <PreviewModal src={previewUrl}><a href="" onClick={e => {e.preventDefault(); setPreviewUrl(false)}}>Close</a></PreviewModal>
        </div>}
    </div>

}