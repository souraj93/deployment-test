import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import Meta from '../components/Meta'
import { listProductsCust } from '../actions/productActions'
import { listCategories } from '../actions/categoryActions'

const HomeScreen = ({ match, history }) => {
  const keyword = match.params.keyword
  const [selectedCategories, updateSelected] = useState([]);

  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products, page, pages } = productList

  const categoryList = useSelector((state) => state.categoryList)
  const { categories } = categoryList

  const [prodCategories, updateProdCategories] = useState([]);

  useEffect(() => {
    dispatch(listProductsCust(keyword, pageNumber, {categories : selectedCategories}))
  }, [dispatch, keyword, pageNumber, selectedCategories])

  useEffect(() => {
    if (!prodCategories.length) {
      console.log("inside called")
      dispatch(listCategories('', 1))
    }
  }, [dispatch, prodCategories])

  const chooseCategory = (category, ind) => {
    const localProdCat = [...prodCategories];
    const localSelected = [...selectedCategories];
    localProdCat.forEach(each => {
      if (each._id === category._id) {
        each.selected = !each.selected;
        if (each.selected) {
          localSelected.push(each._id);
        } else {
          localSelected.splice(localSelected.indexOf(each._id), 1);
        }
      }
    });
    history.push('/page/1');
    updateSelected([...localSelected]);
    updateProdCategories([...localProdCat]);
  }

  useEffect(() => {
    if (categories && categories.length && !prodCategories.length) {
      const localProdCat = [...categories];
      localProdCat.forEach(each => {
        each.selected = false;
      });
      updateProdCategories([...localProdCat]);
    }
  }, [categories, prodCategories]);

  const openHome = (path) => {
    history.replace(path);
  }

  return (
    <>
      <Meta />
      {!keyword ? null : (
        <Link to='/page/1' className='btn btn-light'>
          Go Back
        </Link>
      )}
      {!keyword && prodCategories && prodCategories.length ?
        prodCategories.map((cat, index) => {
          return <span onClick={() => chooseCategory(cat, index)} className={`badge badge-pill home-pill-category ${cat.selected ? 'badge-primary' : 'badge-success'}`} key={cat._id}>{cat.name}</span>
        }) : null
      }
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ''}
            openHome={openHome}
          />
        </>
      )}
    </>
  )
}

export default HomeScreen
