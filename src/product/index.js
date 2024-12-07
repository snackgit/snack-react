import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import "./index.css";
import { API_URL } from "../config/constants";
import dayjs from "dayjs";
import { Button, message } from "antd";

function ProductPage() {
  const { id } = useParams();
  const [products, setProduct] = useState(null);

  const getProduct = () => {
    axios
      .get(`${API_URL}/products/${id}`)
      .then((result) => {
        setProduct(result.data.product);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(function () {
    getProduct();
  }, [id]);

  if (products === null) {
    return <h1>상품 정보를 받고 있습니다...</h1>;
  }

  const onClickPurchase = () => {
    axios
      .post(`${API_URL}/purchase/${id}`)
      .then((result) => {
        message.info("구매가 완료되었습니다");
        getProduct();
      })
      .catch((error) => {
        message.error(`에러가 발생했습니다. ${error.message}`);
      });
  };
  return (
    <div>
      <div id="image-box">
      <img src={`${API_URL}/${products.imageUrl}`} />
      </div>
      <div id="profile-box">
      <img src="/images/icons/avatar.png" />
        <span>{products.seller}</span>
      </div>
      <div id="contents-box">
        <div id="name">{products.name}</div>
        <div id="price">{products.price}원</div>
        <div id="createdAt">
          {dayjs(products.createdAt).format("YYYY년 MM월 DD일")}
        </div>
        <Button
          id="purchase-button"
          size="large"
          type="primary"
          danger
          onClick={onClickPurchase}
          disabled={products.soldout === 1}
        >
          재빨리 구매하기
        </Button>
        <pre id="description">{products.description} </pre>
      </div>
    </div>
  ); 
}

export default ProductPage;
