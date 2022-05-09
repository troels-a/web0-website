import Section from 'components/Section';
import styled, { keyframes, css } from 'styled-components';
import Grid from 'styled-components-grid';

const pulse = keyframes`
    0% {
        transform: scale(0.9);
    }
    70% {
        transform: scale(1);
    }
    100% {
        transform: scale(0.9);
    }
`

export const Wrapper = styled.div`

    /* height: 100vh;
    width: 100vw;
    display: flex;
    place-items: center;
    justify-content: center; */

`

export const Logo = styled(p => <div {...p}>web0</div>)`
    font-family: Times New Roman, sans-serif;
    font-size: 10em;
    filter: blur(10px);
    letter-spacing: 0.05em;
    ${p => p.animate && css`
        animation: ${pulse} 1s infinite;
    `}
`

export default function Index(){

    return <Wrapper>

        <Section fullHeight>
            <Grid>
                <Grid.Unit>
                    <Logo/>
                </Grid.Unit>
            </Grid>
        </Section>

        <Section fullHeight>
            <Grid>
                <Grid.Unit size={1/2}>
                    <h2>Build your dream onchain</h2>
                </Grid.Unit>
                <Grid.Unit size={1/2}>
                    <h2>Build your dream onchain</h2>
                </Grid.Unit>
            </Grid>
        </Section>

    </Wrapper>;

}