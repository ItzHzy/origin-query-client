import React from 'react';
import styled from 'styled-components';
import { injectReducer } from 'redux-injector';
import PrimaryButton from '../General/PrimaryButton'

const Container = styled.div`
    height: auto;
    width: 100%;
    display: flex;
    flex-direction: column;

    &>:first-child{
        margin-top: 10px;
    }

    &>:last-child{
        margin-left: 400px;
    }
`
const TextBox = styled.input`
    width: 500px;
    margin-left: 10px;
    margin-top: 5px;
    background: none;
    outline: none;
    color: #b3b3b3;
    font-size: x-large;
    border: solid 2px black;
    border-radius: 5px;
    text-indent: 10px;
`

const Form = styled.form`
    display:flex;
    flex-direction: column;
    margin-bottom: 10px;
`

const ServerSettings = () => {
    return (
        <Container>
            <Form>
                <TextBox placeholder="Server Address" />
                <TextBox placeholder="Username" />
                <TextBox type="password" placeholder="Password" />
            </Form>
            <PrimaryButton label="Login"></PrimaryButton>
        </Container>
    );
}

export default ServerSettings;