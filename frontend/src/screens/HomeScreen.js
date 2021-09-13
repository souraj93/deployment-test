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
  const [showPrevButtons, togglePrevButton] = useState(false);
  const [showNextButtons, toggleNextButton] = useState(true);

  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products, page, pages } = productList

  const categoryList = useSelector((state) => state.categoryList)
  const { categories } = categoryList

  const [prodCategories, updateProdCategories] = useState([]);

  const handleNextPrevButtons = () => {
    if (document.getElementsByClassName("categories-wrapper")[0]) {
      if (document.getElementsByClassName("categories-wrapper")[0].clientWidth < document.getElementsByClassName("categories-wrapper")[0].scrollWidth) {
        togglePrevButton(true);
        toggleNextButton(true);

        if (document.getElementsByClassName("categories-wrapper")[0].scrollLeft === 0) {
          togglePrevButton(false);
        }
        if (Math.round(document.getElementsByClassName("categories-wrapper")[0].scrollWidth - document.getElementsByClassName("categories-wrapper")[0].clientWidth) === Math.round(document.getElementsByClassName("categories-wrapper")[0].scrollLeft)) {
          toggleNextButton(false);
        }
      } else {
        togglePrevButton(true);
        toggleNextButton(true);
      }
    }
  };

  const sideScroll = (element, direction, speed, distance, step) => {
    let scrollAmount = 0;
    let slideTimer = setInterval(function () {
      if (direction === 'left') {
        element.scrollLeft -= step;
      } else {
        element.scrollLeft += step;
      }
      scrollAmount += step;
      if (scrollAmount >= distance) {
        handleNextPrevButtons();
        window.clearInterval(slideTimer);
      }
    }, speed);
  }

  const nextClick = () => {
    var container = document.getElementsByClassName('categories-wrapper')[0];
    sideScroll(container, 'right', 25, 145, 10);
  };

  const prevClick = () => {
    var container = document.getElementsByClassName('categories-wrapper')[0];
    sideScroll(container, 'left', 25, 145, 10);
  };

  window.onresize = () => {
    handleNextPrevButtons();
  };

  window.onload = () => {
    handleNextPrevButtons();
  };

  const displayNavs = (bool) => {
    if (bool) {
      handleNextPrevButtons();
    }
  };

  useEffect(() => {
    dispatch(listProductsCust(keyword, pageNumber, { categories: selectedCategories }))
  }, [dispatch, keyword, pageNumber, selectedCategories])

  useEffect(() => {
    if (!prodCategories.length) {
      dispatch(listCategories('', 1))
    }
  }, [dispatch, prodCategories])

  useEffect(() => {
    if (window.location.pathname === "/") {
      history.push('/page/1');
    }
  }, [window.location.pathname])

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
      <div className={`row ml-0 mr-0 categories-heading pb-0`} onMouseEnter={() => { displayNavs(true) }}>
        <h4 className={`col-7 pl-0 mb-0 pt-3 home-page-header display-inline-block`}>Categories</h4>
        {prodCategories.length ?
          <div className="col-5 pr-0 text-right category-arrows" onMouseEnter={() => { displayNavs(true) }}>
            <button className="prev-button-wrapper" onClick={() => prevClick("categories-wrapper")} id="slideprev" disabled={!showPrevButtons}>
              <i className="fas fa-arrow-left"></i>
            </button>
            <button className="next-button-wrapper" onClick={() => nextClick("categories-wrapper")} id="slide" disabled={!showNextButtons}>
              <i className="fas fa-arrow-right"></i>
            </button>
          </div> : null}
      </div>
      <div className="whole-categories-wrapper">
        <div className={`categories-wrapper`} style={{ margin: 0 }}>
          {!keyword && prodCategories && prodCategories.length ?
            prodCategories.map((cat, index) => {
              return <span onClick={() => chooseCategory(cat, index)} className={`badge badge-pill home-pill-category ${cat.selected ? 'badge-primary' : 'badge-success'}`} key={cat._id}>{cat.name}</span>
            }) : null
          }
        </div>
      </div>
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
