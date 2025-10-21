
import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function Footer(){
  return (
    <Box sx={{py:4,textAlign:'center',color:'var(--muted)'}}>
      <Typography variant="body2">© {new Date().getFullYear()} Shopping — Demo</Typography>
    </Box>
  )
}
