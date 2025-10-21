
import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import { db } from '../firebase'
import { collection, getDocs, query } from 'firebase/firestore'

export default function Dashboard(){
  const [counts, setCounts] = useState({ users:0, sellers:0 })

  useEffect(()=>{ loadCounts() },[])

  async function loadCounts(){
    try{
      const u = await getDocs(collection(db,'users'))
      const s = await getDocs(collection(db,'sellers'))
      setCounts({ users: u.size, sellers: s.size })
    }catch(err){ console.error(err) }
  }

  return (
    <Container sx={{py:4}}>
      <Typography variant="h5" gutterBottom>Overview</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Paper sx={{p:2}}><Typography>Tổng người dùng</Typography><Typography variant="h6">{counts.users}</Typography></Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper sx={{p:2}}><Typography>Tổng đại lý</Typography><Typography variant="h6">{counts.sellers}</Typography></Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
