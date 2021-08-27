import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
// import Rating from './Rating'

const Product = ({ product }) => {
  return (
    <Card className='my-3 rounded custom-card'>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant='top' />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div' className="product-rating-wrapper">
          <i className="fas fa-star"></i>{product.rating}
        </Card.Text>

        <Card.Text as='h3' className="product-price pt-0">Rs. {product.price}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product
