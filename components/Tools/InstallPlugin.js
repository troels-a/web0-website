import useContract from "base/hooks/useContract";
import { useEffect, useRef, useState } from "react";
import web0pluginsABI from 'base/abi/web0plugins.json';
import web0pluginABI from 'base/abi/web0plugin.json';
import { useRouter } from "next/router";
import Modal from "components/Modal";
import { withTheme } from "styled-components";
import styled from "styled-components";
import Pager from "components/Pager/Pager";

const nullAddress = '0x0000000000000000000000000000000000000000';


const PreviewModal = styled(({src, children, ...p}) => <Modal show={src} {...p}>{children}<iframe width="100%" height="100%" src={src} /></Modal>)`
  background-color: white;
  backdrop-filter: none;
  iframe {
    border: 0;
  }
`

const Wrapper = styled.div`
  min-width: 320px;
`

const InputGroup = styled.div`
  width: 100%;
  display: flex;
  ${p => p.horizontal && `flex-direction: column;`}
  margin: 0.5em 0;
  &:first-of-type {
    margin-top: 0;
  }
  &:last-of-type {
    margin-bottom: 0;
  }

  small {
    margin-bottom: 0.5em;
  }

`

const Input = styled.input`
  box-sizing: border-box;
  padding: 1em;
  ${p => p.width && `width: ${p.width}%;`}
`

const Button = styled.button`
  box-sizing: border-box;
  padding: 1em;
  ${p => p.width && `width: ${p.width}%;`}
`


const Label = styled.label`
  padding: 1em;
  ${p => p.width && `width: ${p.width}%;`}
  &:first-child {
    padding-left: 0em;
  }
`

export function ParamInput({ setParams, index, param, onChange, ...props}) {

  const handleChange = (e) => {

    const value = e.target.value;

    setParams((params) => {
      const newParams = [...params];
      newParams[index] = [
        param.type === 'string' ? value : '',
        param.type === 'uint' ? value : 0,
        param.type === 'address' ? value : nullAddress,
        param.type === 'bool' ? value : false,
      ];
      return newParams;
    });
    
    if(onChange)
      onChange(value);
  }

  return <Input {...props} placeholder={param.description} type="text" onChange={handleChange} />
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

    const [params, setParams] = useState([]);
    const [slot, setSlot] = useState(1);
    const [page, setPage] = useState(1);

    useEffect(() => {
      if(plugin){
        setPage(2);
      }
    }, [plugin]);

    return <Wrapper>
        <h3>Install plugin{plugin && `: ${plugin.name}`}</h3>
        <Pager currentPage={page} pages={
          [
            // Page 1
            () => <>
            <form onSubmit={handleLookup}>
              <InputGroup>
                <Input width={70} type="text" ref={pluginInputRef}/>
                <Input type="submit" value="Load plugin"/>
              </InputGroup>
            </form>
            </>,

            // Page 2
            () => <>
              <InputGroup horizontal>
                <small width={10}>Slot</small>
                <Input width={100} type="number" value={slot} onChange={e => setSlot(e.target.value)}/>
              </InputGroup>
              {plugin.params.length > 0 && <>
              <label>Parameters</label>
              {plugin.params.map((param, index) => <InputGroup horizontal>
                <small>{index+1} - {param.description}</small>
                <ParamInput width={100} setParams={setParams} key={index} index={index} param={param}/>
              </InputGroup>)}              
              
              </>
              }
              <InputGroup>
                <Button width={50} onClick={() => handlePreview(pluginAddress, slot, params)}>Preview</Button>
                <Button width={50} onClick={() => handleInstall(pluginAddress, slot, params)}>Install</Button>
              </InputGroup>
              <PreviewModal src={previewUrl}><a href="" onClick={e => {e.preventDefault(); setPreviewUrl(false)}}>Close</a></PreviewModal>
            </>
          ]
        }/>
    </Wrapper>

}