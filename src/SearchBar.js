import React from 'react';
import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    height: 30px;
    width: 210px;
    margin-left: 20px;
    border-style: solid;
    border-radius: 5px;
    border-color: black;
`

const Img = styled.img`
    height: 80%;
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 5px;
`

const Input = styled.input`
    height: 100%;
    width: 150px;
    margin-left: 10px;
    background: none;
    outline: none;
    border: none;
    color: #b3b3b3;
    font-weight: bold;
    font-size: large;
`

const SearchBar = () => {
    return ( 
        <Container>
            <Img src={require("./assets/search.svg")}></Img>
            <Input></Input>
        </Container>
     );
}
 
export default SearchBar;