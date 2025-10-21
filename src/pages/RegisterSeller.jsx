
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import { db, storage, auth } from '../firebase'
import { setDoc, doc } from 'firebase/firestore'
import { ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage'

export default function RegisterSeller(){
  const [shopName, setShopName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [desc, setDesc] = useState('')
  const [idFile, setIdFile] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleAvatarChange(e){
    const f = e.target.files?.[0] || null
    setAvatarFile(f)
    if(f){ const url = URL.createObjectURL(f); setAvatarPreview(url) }
    else setAvatarPreview(null)
  }

  async function handleSubmit(e){
    e.preventDefault()
    if(!auth || !auth.currentUser) { alert('Bạn cần đăng nhập'); return }
    setLoading(true)
    try{
      const uid = auth.currentUser.uid
      let idUrl=null, avatarUrl=null
      if(idFile && storage){
        const r = sRef(storage, `seller_docs/${uid}/${Date.now()}_${idFile.name}`)
        await uploadBytes(r, idFile)
        idUrl = await getDownloadURL(r)
      }
      if(avatarFile && storage){
        const r2 = sRef(storage, `seller_avatars/${uid}/${Date.now()}_${avatarFile.name}`)
        await uploadBytes(r2, avatarFile)
        avatarUrl = await getDownloadURL(r2)
      }
      await setDoc(doc(db,'sellers',uid),{
        uid, email: auth.currentUser.email || null, shopName, phone, address, description: desc, idFileUrl: idUrl, avatarUrl, status:'pending', createdAt: new Date().toISOString()
      })
      alert('Đăng ký đã gửi. Chờ duyệt.')
      window.location.href = '/'
    }catch(err){ alert(err.message) }finally{ setLoading(false) }
  }

  return (
    <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.35}}>
      <Container sx={{py:4}}>
        <Typography variant="h5" gutterBottom>Đăng ký Đại lý</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{display:'grid', gap:2, maxWidth:700}}>
          <TextField label="Tên cửa hàng" value={shopName} onChange={e=>setShopName(e.target.value)} required />
          <TextField label="Số điện thoại" value={phone} onChange={e=>setPhone(e.target.value)} required />
          <TextField label="Địa chỉ" value={address} onChange={e=>setAddress(e.target.value)} required />
          <TextField label="Mô tả" value={desc} onChange={e=>setDesc(e.target.value)} multiline rows={3} />
          <Box>
            <Typography variant="body2">Ảnh CMND / Giấy phép</Typography>
            <input type="file" accept="image/*" onChange={e=>setIdFile(e.target.files?.[0]||null)} />
          </Box>
          <Box sx={{display:'flex',alignItems:'center',gap:2}}>
            <Box>
              <Typography variant="body2">Ảnh đại diện shop</Typography>
              <input type="file" accept="image/*" onChange={handleAvatarChange} />
            </Box>
            <Avatar src={avatarPreview} sx={{width:64,height:64}} />
          </Box>
          <Button variant="contained" type="submit" disabled={loading}>{loading ? 'Đang gửi...' : 'Gửi đăng ký'}</Button>
        </Box>
      </Container>
    </motion.div>
  )
}
