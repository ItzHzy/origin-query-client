import React, { useState } from 'react';
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'

const Container = styled.img`
    height: 250px;
    width: auto;
    margin: 5px;
    border: solid 1px black;
    border-radius: 13px;
    &:hover {
        cursor: pointer;
    }
`

const SearchResult = (props) => {
    const dispatch = useDispatch()

    const addToDeck = (name) => {
        dispatch({
            type: "ADD_TO_DECK",
            card: name
        })
    }

    return (
        <Container src={props.src} name={props.name} onDoubleClick={() => { addToDeck(props.name) }}></Container>
    );
}

export default SearchResult;