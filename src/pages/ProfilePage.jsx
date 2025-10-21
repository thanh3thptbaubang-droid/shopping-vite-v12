
import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { auth, db, storage } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage'

export default function ProfilePage(){
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [name, setName] = useState('')
  const [file, setFile] = useState(null)

  useEffect(()=>{
    if(!auth) return
    const unsub = onAuthStateChanged(auth, u=>{ setUser(u); if(u) loadProfile(u.uid) })
    return ()=>unsub && unsub()
  },[])

  async function loadProfile(uid){
    if(!db) return
    const d = await getDoc(doc(db,'users',uid))
    if(d.exists()) setProfile(d.data())
  }

  async function handleSave(){
    if(!user) return alert('Login required')
    const uid = user.uid
    const payload = { displayName: name }
    if(file && storage){
      const r = sRef(storage, `avatars/${uid}/${Date.now()}_${file.name}`)
      await uploadBytes(r,file)
      payload.photoURL = await getDownloadURL(r)
    }
    await setDoc(doc(db,'users',uid), payload, { merge:true })
    alert('Đã lưu')
  }

  return (
    <Container sx={{py:4}}>
      <Typography variant="h5">Hồ sơ của tôi</Typography>
      {user ? (
        <Box sx={{display:'grid',gridTemplateColumns:'120px 1fr',gap:2,mt:2,alignItems:'start'}}>
          <Avatar src={profile?.photoURL || user.photoURL} sx={{width:96,height:96}} />
          <Box>
            <Typography>Email: {user.email || user.phoneNumber}</Typography>
            <TextField label="Tên hiển thị" value={name} onChange={e=>setName(e.target.value)} sx={{mt:1}} />
            <Box sx={{mt:2}}>
              <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} />
            </Box>
            <Box sx={{mt:2}}>
              <Button variant="contained" onClick={handleSave}>Lưu thay đổi</Button>
            </Box>
          </Box>
        </Box>
      ) : <Typography>Bạn cần đăng nhập</Typography>}
    </Container>
  )
}
