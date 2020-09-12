import React, { useState } from 'react';
import styled from 'styled-components'
import { useDispatch } from 'react-redux'

const Container = styled.form`
    display: flex;
    height: 30px;
    width: 20%;
    margin-left: 20px;
    margin-top: auto;
    margin-bottom: auto;
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
    const dispatch = useDispatch()

    const findResults = (event) => {
        if (event.key != 'Enter') {
            return
        }
        event.preventDefault()
        fetch("https://api.scryfall.com/cards/search?" + new URLSearchParams({
            q: event.target.value
        }))
            .then(response => response.json())
            .then(response => {
                dispatch({
                    type: "SEARCH_RESULTS",
                    results: response.data.map((card) => {
                        if (card != undefined) {
                            return { name: card.name, image: card.image_uris.png }
                        }
                    })
                })
            });
    }

    return (
        <Container>
            <Img src={require("../../../assets/images/search.svg")}></Img>
            <Input type="text" onKeyPress={findResults} placeholder="Search"></Input>
        </Container >
    );
}

export default SearchBar;