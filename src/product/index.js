import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./index.css";
import { API_URL } from "../config/constants";
import dayjs from "dayjs";
import { Button, message, Spin, Rate } from "antd";

function ProductPage({ userNickname }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getProduct();
    getReviews();
  }, [id]);

  const getProduct = async () => {
    try {
      const result = await axios.get(`${API_URL}/products/${id}`);
      setProduct(result.data.product);
    } catch (error) {
      console.error("상품 정보 로드 실패:", error);
      message.error("상품 정보를 불러오는데 실패했습니다.");
    }
  };

  const getReviews = async () => {
    try {
      const result = await axios.get(`${API_URL}/products/${id}/reviews`);
      const serverReviews = result.data.reviews || [];
      
      // 로컬 스토리지의 리뷰도 가져와서 합치기
      const userData = JSON.parse(localStorage.getItem(userNickname)) || {};
      const userReviews = userData.reviews || [];
      const productUserReviews = userReviews.filter(review => review.productId === id);
      
      const allReviews = [...serverReviews, ...productUserReviews];
      
      // 중복 제거 및 날짜순 정렬
      const uniqueReviews = allReviews.filter((review, index, self) =>
        index === self.findIndex((t) => t.id === review.id)
      ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setReviews(uniqueReviews);
    } catch (error) {
      console.error("리뷰 로드 실패:", error);
      message.error("리뷰를 불러오는데 실패했습니다.");
    }
  };

  if (!product) {
    return <Spin size="large" />;
  }

  return (
    <div className="product-page">
      <div className="product-info">
        <h2>{product.name}</h2>
        <p>{product.price}원</p>
        <p>{product.description}</p>
      </div>

      <div className="reviews-section">
        <h3>상품 후기</h3>
        {reviews.length > 0 ? (
          <div className="reviews-list">
            {reviews.map((review, index) => (
              <div key={index} className="review-item">
                <Rate disabled defaultValue={review.rating} />
                <p className="review-comment">{review.comment}</p>
                <p className="review-date">
                  {dayjs(review.createdAt).format("YYYY년 MM월 DD일")}
                </p>
                <p className="review-user">작성자: {review.userId}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>아직 작성된 후기가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default ProductPage;
