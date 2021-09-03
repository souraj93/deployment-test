import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 rounded'>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.images[0].url} variant='top' />
      </Link>

      <Card.Body className="pb-0 pl-0 pr-0">
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div' className="mb-0">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='h3' className="pt-2 pb-2">Rs. {product.price}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product
