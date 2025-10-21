
import React from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import products from '../utils/products'

export default function Home(){
  return (
    <Container sx={{py:4}}>
      <Typography variant="h5" gutterBottom>Sản phẩm</Typography>
      <Grid container spacing={2}>
        {products.map(p=> (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <Card>
              <CardMedia component="img" height="160" image={p.image} alt={p.title} />
              <CardContent>
                <Typography fontWeight={700}>{p.title}</Typography>
                <Typography variant="body2" color="text.secondary">{p.desc}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Thêm vào giỏ</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
