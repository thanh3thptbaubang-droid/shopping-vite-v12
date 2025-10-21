
import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import { auth, db } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { DataGrid } from '@mui/x-data-grid'
import { addTransaction, ensureWallet } from '../utils/wallet'

export default function WalletPage(){
  const [user, setUser] = useState(null)
  const [wallet, setWallet] = useState({ balance:0, transactions:[] })
  const [loading, setLoading] = useState(true)
  const [amount, setAmount] = useState(0)

  useEffect(()=>{
    if(!auth) return
    const unsub = onAuthStateChanged(auth, async (u)=>{
      setUser(u)
      if(u) await loadWallet(u.uid)
      else setWallet({ balance:0, transactions:[] })
      setLoading(false)
    })
    return ()=>unsub && unsub()
  },[])

  async function loadWallet(uid){
    const ref = doc(db,'wallets',uid)
    const snap = await getDoc(ref)
    if(snap.exists()) setWallet(snap.data())
    else { await ensureWallet(uid); setWallet({ balance:0, transactions:[] }) }
  }

  async function handleWithdraw(){
    if(!user) return alert('Bạn cần đăng nhập')
    const a = Number(amount)
    if(a <= 0) return alert('Số tiền không hợp lệ')
    if(a > wallet.balance) return alert('Số dư không đủ')
    // automatic: create negative transaction and reduce balance
    const tx = await addTransaction(user.uid, { type:'withdraw', amount: -a, description: 'Rút tiền tự động' })
    alert('Yêu cầu rút tiền đã xử lý tự động: ' + tx.id)
    await loadWallet(user.uid)
  }

  const rows = (wallet.transactions || []).slice().reverse().map((t,idx)=>({ id:t.id, date:t.date, type:t.type, amount:t.amount, description:t.description }))

  return (
    <Container sx={{py:4}}>
      <Typography variant="h5" gutterBottom>Ví Shopping</Typography>
      <Box sx={{display:'flex',gap:2,mb:2}}>
        <Card sx={{p:2,minWidth:220}}>
          <CardContent>
            <Typography variant="subtitle2">Số dư hiện tại</Typography>
            <Typography variant="h5">{wallet.balance?.toLocaleString?.() ?? wallet.balance} ₫</Typography>
          </CardContent>
        </Card>
        <Card sx={{p:2}}>
          <CardContent>
            <Typography variant="subtitle2">Rút tiền tự động</Typography>
            <Box sx={{display:'flex',gap:1,mt:1,alignItems:'center'}}>
              <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} style={{padding:8,borderRadius:6,border:'1px solid #ddd'}} />
              <Button variant="contained" onClick={handleWithdraw}>Rút</Button>
            </Box>
            <Typography variant="caption" display="block" sx={{mt:1}}>Rút tiền sẽ được xử lý tự động và cập nhật ngay.</Typography>
          </CardContent>
        </Card>
      </Box>

      <div style={{ height: 420, width: '100%' }}>
        <DataGrid rows={rows} columns={[{field:'date',headerName:'Ngày',width:200},{field:'type',headerName:'Loại',width:140},{field:'description',headerName:'Mô tả',flex:1},{field:'amount',headerName:'Số tiền',width:140}]} pageSize={10} rowsPerPageOptions={[10]} />
      </div>
    </Container>
  )
}
