import React, { useContext } from 'react';
import styled from 'styled-components';
import PageContext from '../../context/PageContext'

const Container = styled.button`
    display: flex;
    background: none;
    outline: none;
    border: none;
    width: 70px;
    height: 70px;
    border-radius: 10px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 5px;
    
    &:hover {
        cursor: pointer;
    }

    &:active>img {
        position: relative;
        filter: invert(100%) sepia(7%) saturate(0%) hue-rotate(134deg) brightness(107%) contrast(100%);
        top: 2px;
    }

    &>img {
        -webkit-user-drag: none;
        margin: auto;
        filter: invert(89%) sepia(66%) saturate(4790%) hue-rotate(273deg) brightness(86%) contrast(99%);
    }
`
const Tab = (props) => {
    const { changePage } = useContext(PageContext)
    
    return ( 
        <Container onClick={() => {changePage(props.page)}}>
            <img src={props.src} width={'40px'} height={'40px'} alt={""}/>
        </Container> 
     );
}

 
export default Tab;