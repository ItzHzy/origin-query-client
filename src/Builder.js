import React, { Component } from 'react';
import styled from 'styled-components';
import SearchBar from './SearchBar';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
`
const FlexRow = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    margin-right: auto;
    margin-left: auto;
    height: 100%;
    width: 100%;
`

const Header = styled.div`
    margin-top: 10px;
    width: 100%;
    height: 40px;
`

const SearchResults = styled.div`
    display: flex;
    flex-direction: row;
    margin-left: 10px;
    margin-right: 10px;
    height: 98%;
    width: 90%;
    border-style: solid;
    border-radius: 7px;
`

const DeckList = styled.div`
    display: flex;
    flex-direction: row;
    margin-right: 10px;
    margin-left: auto;
    height: 98%;
    width: 500px;
    border-style: solid;
    border-radius: 7px;
`

class Builder extends Component {
    render() { 
        return ( 
            <Container>
                <Header>
                    <SearchBar/>
                </Header>
                <FlexRow>
                    <SearchResults></SearchResults>
                    <DeckList></DeckList>
                </FlexRow>
            </Container>
         );
    }
}
 
export default Builder;