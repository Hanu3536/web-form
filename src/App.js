import React from 'react'
import './App.css'
import Form from './Component/form'
import { Container, Typography } from '@mui/material'
import './Component/formStyles'

const App = () => {
  return (
    <Container className="Web Form">
      
        <Typography variant="h4" component="h1">
          Ministry of Social Development and Poverty Reduction
        </Typography>

      <Form />
    </Container>
  )
}

export default App
