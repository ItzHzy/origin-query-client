import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components'
import SearchResult from './SearchResult'


const Container = styled.div`
    display: flex;
    margin-left: 10px;
    margin-right: 10px;
    height: 98%;
    width: 90%;
    border-style: solid;
    border-radius: 7px;
    overflow-y: scroll;
    ::-webkit-scrollbar {
        width: 10px;
    }
    ::-webkit-scrollbar-thumb {
        background: black;
        border-radius: 10px;
    }
`
const SubContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    height: fit-content;
    justify-content: space-evenly;
`

const SearchResults = (props) => {
    const results = useSelector((state) => state.searchResults)

    return (
        <Container>
            <SubContainer>
                {
                    results.map((result) => {
                        return <SearchResult src={result.image} key={result.name} name={result.name} />
                    })
                }
            </SubContainer>
        </Container>
    );
}


export default SearchResults;