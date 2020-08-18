import React, { useState } from 'react';
import styled from 'styled-components'
import { Store, searchResults } from '../../../store'

const Container = styled.form`
    display: flex;
    height: 30px;
    width: 20%;
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
    width: 100%;
    margin-left: 10px;
    background: none;
    outline: none;
    border: none;
    color: #b3b3b3;
    font-size: large;
`

const SearchBar = (props) => {

    const findResults = (event) => {
        event.preventDefault()

        fetch("https://api.scryfall.com/cards/search?" + new URLSearchParams({
            q: 'Island'
        }))
            .then(response => response.json())
            .then(response => {
                const ans = response.data.map((card) => { return card.image_uris.png })
                console.log(ans)
            });
        // Store.dispath(searchResults())
        // console.log(event.target.value)
    }

    return (
        <Container>
            <Img src={require("../../../images/search.svg")}></Img>
            <Input type="text" onChange={findResults} placeholder="Search"></Input>
        </Container >
    );
}

export default SearchBar;