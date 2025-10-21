
import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

export default function AuthModal({ open, onClose }){
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e){
    e.preventDefault()
    if(!auth) return alert('Auth not ready')
    try{
      if(mode==='signup'){
        await createUserWithEmailAndPassword(auth, email, password)
        alert('Đăng ký thành công')
        onClose()
      } else {
        await signInWithEmailAndPassword(auth, email, password)
        alert('Đăng nhập thành công')
        onClose()
      }
    }catch(err){ alert(err.message) }
  }

  async function googleSignIn(){
    if(!auth) return alert('Auth not ready')
    try{
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      alert('Google sign-in thành công')
      onClose()
    }catch(err){ alert(err.message) }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{mode==='login' ? 'Đăng nhập' : 'Tạo tài khoản'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} sx={{pt:1}}>
            <TextField label='Email' value={email} onChange={e=>setEmail(e.target.value)} required />
            <TextField label='Mật khẩu' type='password' value={password} onChange={e=>setPassword(e.target.value)} required />
            <Button type='submit' variant='contained'>{mode==='login' ? 'Đăng nhập' : 'Đăng ký'}</Button>
            <Button variant='outlined' onClick={googleSignIn}>Đăng nhập bằng Google</Button>
            <Button onClick={()=>setMode(mode==='login'?'signup':'login')}>{mode==='login' ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}</Button>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  )
}
