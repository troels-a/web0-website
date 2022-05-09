import styled from 'styled-components'

function Section({children, ...p}){
    return  <div {...p}>
        {children}
    </div>    
}

export default styled(Section)`

    ${p => p.fullHeight && `height: 100vh;`}

    width: 100vw;
    display: flex;
    place-items: center;
    justify-content: center;

`