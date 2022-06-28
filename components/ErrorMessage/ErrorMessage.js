import useError from "base/hooks/useError";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Modal, { ModalInner, ModalActions, Prompt} from "components/Modal";
import Button from 'components/Button';


function ErrorMessage({children, ...p}){
    
    const err = useError();

    return <Prompt show={err.message} actions={err.actions ? err.actions : [{label: 'Close', callback: err.reset}]} {...p}>
        {err.message}
    </Prompt>
}


export default ErrorMessage;