import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { CircularProgress } from '@mui/material';
import DiscountIcon from '@mui/icons-material/Discount';
import InventoryIcon from '@mui/icons-material/Inventory';
import GradeIcon from '@mui/icons-material/Grade';
import { Action, CartSchema, ProductSchema, FavoriteSchema } from '../../types';
import { Button } from '../../stories/Button/Button';
import { Creators as ProductCreators } from '../../store/Product';
import { Creators as CartCreators } from '../../store/Cart';
import { Creators as FavoriteCreators } from '../../store/Favorites';

const { getProductByID } = ProductCreators;
const { setCartState } = CartCreators;

const Product = styled.div`
  height: 100%;
  width: 100%;
  padding: 0 40px;
  color: #fff;

  .product__container {
    width: 100%;
    padding-top: 100px;
    border-radius: 12px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 20px;
  }

  .product__main-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .product__main-title {
    font-size: 36px;
    display: flex;
    gap: 20px;
    align-items: center;
    flex-wrap: wrap;
  }
  .product__main-text {
    color: #b7b4b2d2;
    font-size: 18px;
  }
  .product__main-pill {
    background-color: #2f2d2b;
    width: fit-content;
    padding: 8px 16px;
    border-radius: 12px;
    font-size: 12px;
  }

  .product__thumbnail-wrapper {
    height: 100%;
    width: 100%;
    position: relative;
    padding-top: 20px;
    img {
      width: 100%;
      border-radius: 8px;
      object-fit: cover;
    }
  }
  .product__thumbnail-selected-image {
    height: 500px;
  }
  .product__thumbnail__images {
    display: flex;
    gap: 20px;
    padding-top: 20px;
    img {
      height: 220px;
      box-shadow:
        rgba(144, 171, 218, 0.25) 0px 4px 8px -2px,
        rgba(195, 209, 233, 0.08) 0px 0px 0px 1px;

      transition: 0.2s transform cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    img:hover {
      transform: scale(1.05);
      cursor: pointer;
    }
  }

  .product__detail {
    display: flex;
    gap: 20px;
    padding-top: 5px;
  }
  .product__detail-text {
    font-size: 20px;
    display: flex;
    gap: 8px;
    font-weight: 300;
    align-items: center;
    justify-content: center;
  }
  .product__detail-price {
    font-weight: 800;
    font-size: 24px;
  }

  .product__controls {
    display: flex;
    gap: 10px;
    padding-bottom: 20px;
    padding-top: 20px;
  }

  .product__actions {
    width: 300px;
    height: fit-content;
    padding: 20px;
    background-color: #2f2d2b;
    border-radius: 8px;
  }
  .product__actions button {
    width: 100%;
  }

  .product__cart-header {
    width: 100%;
    padding-bottom: 10px;
    border-bottom: 2px solid #fff;
    font-size: 20px;
  }
  .product__main-wrapper {
    max-width: 1200px;
    height: 100%;
  }

  .product__favorite {
    position: absolute;
    top: 30px;
    right: 10px;
    z-index: 5;
    fill: #ff5e66;
    transition: transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);

    &:hover {
      transform: scale(1.15);
      cursor: pointer;
    }

    &:active {
      transform: scale(1.35);
    }
  }
  @media screen and (max-width: 1024px) {
    .product__container {
      width: 100%;
      padding: 100px 0;
      padding-left: 0;
      padding-right: 0;
      display: flex;
      flex-direction: column;
    }
    .product__actions {
      width: 100%;
    }
    .product__thumbnail-selected-image {
      height: 300px;
    }
    .product__thumbnail__images {
      img {
        height: 100px;
      }
    }
    .product__main-title {
      font-size: 28px;
      gap: 8px;
    }
    .product__controls button {
      width: fit-content;
    }
    .product__cart-buttons {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 12px;
    }
  }
  @media screen and (max-width: 800px) {
    & {
      padding: 0 20px;
    }
  }
  @media screen and (max-width: 400px) {
    .product__controls,
    .product__controls button {
      width: 100%;
    }
    .product__cart-buttons {
      flex-direction: column;
      gap: 0;
    }
  }
`;

const { likeProduct } = FavoriteCreators;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { allFavorites }: FavoriteSchema = useSelector(({ favorites }) => favorites);
  const { loading, product }: ProductSchema = useSelector(({ products }) => products);
  const { localProducts }: CartSchema = useSelector(({ cart }) => cart);

  const [selectedImage, setSelectedImage] = useState(product?.thumbnail);
  const [counter, setCounter] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProductByID({ id }));
  }, []);

  useEffect(() => {
    setSelectedImage(product?.thumbnail);
    if (localProducts && localProducts?.length > 0) {
      try {
        const arr = localProducts?.filter((product) => Number(id) === product?.id);
        const quantity = arr.length;
        if (quantity) setCounter(arr[0].quantity);
      } catch (e) {
        setCounter(0);
      }
    }
  }, [product]);

  const handleQuantityChange = (quantity: number = 1, action: Action) => {
    if (product !== null) {
      const { id, thumbnail, price, title } = product;
      dispatch(setCartState({ data: { id, thumbnail, price, title, quantity }, action }));
      navigate('/checkout');
    }
  };

  const changeImage = (image: string) => setSelectedImage(image);
  const isFavorite = Boolean(allFavorites.find((element) => element?.id === product?.id));

  return (
    <Product>
      <div className="product__container">
        {!loading && product ? (
          <>
            <div className="product__main-wrapper">
              <div className="product__main-info">
                <h1 className="product__main-title">
                  <span>{product?.title}</span> <p className="product__main-pill">{product?.category}</p>
                </h1>
                <p className="product__detail-price">
                  <span>${product?.price}</span>
                </p>
                <p className="product__main-text">{product?.description}</p>
                <p className="product__main-text">{product?.brand}</p>
                <div className="product__detail">
                  <p className="product__detail-text">
                    <GradeIcon />
                    <span>{product?.rating}</span>
                  </p>
                  <p className="product__detail-text">
                    <DiscountIcon />
                    <span>{product.discountPercentage}%</span>
                  </p>
                  <p className="product__detail-text">
                    <InventoryIcon />
                    <span>{product?.stock}</span>
                  </p>
                </div>
              </div>
              <div className="product__thumbnail-wrapper">
                <svg
                  className={`product__favorite ${isFavorite && 'product__favorite--liked'}`}
                  onClick={() => dispatch(likeProduct(product))}
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="#ffffff"
                  viewBox="0 0 256 256"
                >
                  {isFavorite ? (
                    <path d="M240,94c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,220.66,16,164,16,94A62.07,62.07,0,0,1,78,32c20.65,0,38.73,8.88,50,23.89C139.27,40.88,157.35,32,178,32A62.07,62.07,0,0,1,240,94Z"></path>
                  ) : (
                    <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z"></path>
                  )}
                </svg>
                <img className="product__thumbnail-selected-image" src={selectedImage} alt={product?.title} />
                <div className="product__thumbnail__images">
                  {product?.images.map((image) => <img src={image} onClick={() => changeImage(image)} />)}
                </div>
              </div>
            </div>
            <div className="product__actions">
              <p className="product__cart-header">Cart options</p>
              <div className="product__cart-buttons">
                <div className="product__controls">
                  <Button
                    onClick={() => setCounter((prevState) => prevState + 1)}
                    label="+1"
                    primary={false}
                    outlined={true}
                  />
                  <Button
                    onClick={() => setCounter((prevState) => prevState - 1)}
                    disabled={counter <= 0}
                    label="-1"
                    primary={false}
                    outlined={true}
                  />
                </div>
                <Button
                  label={`Add to cart (${counter})`}
                  primary
                  disabled={counter <= 0}
                  onClick={() => handleQuantityChange(counter, 'replace')}
                />
              </div>
            </div>
          </>
        ) : (
          <CircularProgress
            sx={{ color: '#ff590b', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
          />
        )}
      </div>
    </Product>
  );
};

export default ProductDetail;
