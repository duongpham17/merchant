import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import authentication from '@redux/actions/authentication';

import useForm from '@hooks/useForm';
import Input from '@components/inputs/Input';
import Form from '@components/form/Form';
import Codes from '@components/inputs/Codes';
import Flex from '@components/flex/Style1';
import Button from '@components/buttons/Button';

import validation from './validation';

const Authentication = () => {

    const navigate = useNavigate();
    
    const dispatch = useAppDispatch();

    const authState = useAppSelector(state => state.authentication);

    const initalState = { email: "", code: ""};

    const {values, onChange, onSubmit, errors, loading, onSetValue} = useForm(initalState, callback, validation);

    async function callback(){
      if(!values.email) return;
      if(authState.status.login === "success" && values.code) await dispatch(authentication.confirm_with_code(values.email, values.code));
      if(authState.status.login !== "success") await dispatch(authentication.login(values.email));
    };

    useEffect(() => {
        if(authState.isLoggedIn) navigate('/');
    }, [authState.isLoggedIn, navigate]);

    return (
        <Flex center style={{margin: "8rem"}}>
            {
                authState.status.login === "success" 
                ?
                <Form onSubmit={onSubmit} width={280} buttonClr={values.code ? "main" : "none"} button={false}>
                    <p>Check your email for the code</p>
                    <Codes amount={6} callback={(code: string) => onSetValue({code}) } />
                    {authState.errors && <small>{authState.errors.code}</small>}
                    <Button type="submit" label1={<span>&#x2192;</span>} loading={loading} color="main" />
                </Form>
                :
                <Form onSubmit={onSubmit} button={false} >
                    <Input label1="Email Address" label2={errors.email} error={errors.email} placeholder="..." name="email" value={values.email} onChange={onChange} />
                    {authState.errors && <small>{authState.errors.login}</small>}
                    <Button type="submit" label1={<span>&#x2192;</span>} loading={loading} color="main" />
                </Form>
            }
        </Flex>
    )
}

export default Authentication