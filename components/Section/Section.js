import styled from 'styled-components'
import Grid from 'styled-components-grid';

function Section({children, ...p}){
    return  <Grid {...p}>
        {children}
    </Grid>
}

export default styled(Section)`

    ${p => p.fullHeight && `height: 100vh; min-height: 100vh;`}
    ${p => p.halfHeight && `height: 50vh; min-height: 50vh;`}

    width: 100%;
    ${p => p.itemsCenter && `place-items: center`};
    ${p => p.contentCenter && `justify-content: center`};
    ${p => p.textCenter && `text-align: center`};

`