import React,{ useCallback,useRef } from 'react';
import { View,Alert,Image,KeyboardAvoidingView,Platform,TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import * as Yup from 'yup'

import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'
import validationErrors from '../../utils/validationErrors';

import { useAuth } from '../../context/AuthContext'

import LogoImg from '../../assets/logo.png'
import Input from '../../components/Input'
import Button from '../../components/Button'


import { Container,Title,ForgotPassword,ForgotPasswordText,CreateAccountButton,CreateAccountButtonText } from './styles';

interface SignInFormData{
  email:string
  password:string
}

const Signin: React.FC = () => {

  const navigation = useNavigation()
  const formRef = useRef<FormHandles>(null)
  const passwordInputRef = useRef<TextInput>(null)
  
  const { signin } = useAuth()


  const handleSignin = useCallback( async(data:SignInFormData)=>{
    try{

      formRef.current?.setErrors({})

      const schema = Yup.object().shape({
        email:Yup.string().required('O e-mail é obrigatorio').email('Digite um e-mail Valido'),
        password:Yup.string().required('A senha é obrigatoria')
      })

      await schema.validate(data,{
        abortEarly:false
      })

      await signin({
        email:data.email,
        password:data.password
      })

    }catch(e){

      if(e instanceof Yup.ValidationError){
        const errors = validationErrors(e)
        formRef.current?.setErrors(errors)
            
        return
      }
      Alert.alert(
        'Erro na Autenticação',
        'Ocorreu um erro ao fazer login cheque as credenciais'
      )      
    }  
  },[signin])


  return(
    <>
    <KeyboardAvoidingView enabled style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined }>
      <Container>

        <Image source={LogoImg}/>
          
        <View>
          <Title>Faça seu Login</Title>
        </View>

        <Form ref={formRef} onSubmit={handleSignin}>

          <Input 
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={()=>{ passwordInputRef.current?.focus()}}

            name="email" 
            icon="mail" 
            placeholder="E-mail"
          />
          <Input
            ref={passwordInputRef}
            secureTextEntry
            returnKeyType="send"
            onSubmitEditing={()=>{ formRef.current?.submitForm() }}
            name="password" 
            icon="lock" 
            placeholder="Senha"
          />
        
        </Form>

        <Button onPress={()=>{ formRef.current?.submitForm() }}>Entrar</Button>

        <ForgotPassword onPress={()=>{}}>
          <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
        </ForgotPassword>

      </Container>
    </KeyboardAvoidingView>


      <CreateAccountButton onPress={()=>navigation.navigate('Signup')}>
        <Icon name="log-in" size={20} color="#ff9000"/>
        <CreateAccountButtonText>Criar minha conta</CreateAccountButtonText>
      </CreateAccountButton>
    </>
  );
}

export default Signin;