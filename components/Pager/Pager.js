import { useEffect } from "react";
import styled from "styled-components";

const Pages = styled.div`
    width: 100%;
    height: 100%;
`;

const Page = styled.div`

    background-color: white;
    width: 100%;
    height: 100%;
`;

export default function Pager({pages, currentPage, ...p}) {


  return (
    <Pages {...p}>
        <Page>
            {pages[currentPage-1]()}
        </Page>
    </Pages>
  );


}