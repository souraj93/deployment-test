import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import YouTube from 'react-youtube';
import { Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Meta from '../components/Meta'
import {
  listProductDetails,
} from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';

const ProductScreen = ({ history, match }) => {
  const [currentImage, updateCurrentImage] = useState('');
  const [videoDisplayed, toggleVideoDisplayed] = useState(false);

  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const opts = {
    height: '390',
    width: '100%',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  useEffect(() => {
    if (product && (!product._id || product._id !== match.params.id)) {
      dispatch(listProductDetails(match.params.id))
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
    }
  }, [dispatch, match, product])

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${1}`)
  }

  const changeCurrentImage = (index) => {
    updateCurrentImage(product.images[index].url);
    toggleVideoDisplayed(false);
  };

  const playVideo = () => {
    toggleVideoDisplayed(true);
  };

  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={6}>
              <Row>
              {product.images && product.images.length ?
                <>
                <Col xs={3}>
                  <ul className="pl-0">
                    {product.images.map((imgUrl, ind) => {
                      return <li key={ind} className="img-list-item" onClick={() => changeCurrentImage(ind)}><Image src={imgUrl.url} alt={product.name} /></li>
                    })}
                    {product.videoUrl ?
                    <li className="img-list-item pos-relative" onClick={playVideo}><Image src={product.images[0].url} alt={product.name} />
                    <div className="play-video-icon-wrapper">
                      <i className="fas fa-play"></i>
                    </div>
                    </li> : null}
                  </ul>
                </Col>
                <Col xs={9} className="text-center">
                  {!videoDisplayed ?
                  <Image src={currentImage || product.images[0].url} alt={product.name} fluid />
                  : <YouTube videoId={product.videoUrl} opts={opts} />}
                </Col>
                </>
                : null}
              </Row>
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>Price: Rs.{product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>Rs. {product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {/* <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                      </Col>
                    </Row>
                  </ListGroup.Item> */}

                  {/* {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as='select'
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )} */}

                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className='btn-block'
                      type='button'
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default ProductScreen
