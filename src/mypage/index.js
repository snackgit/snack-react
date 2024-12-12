import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message, Modal, Form, Input, Rate, Button } from "antd";
import "./MyPage.css";
import dayjs from "dayjs";
import { API_URL } from "../config/constants";
import axios from "axios";

function MainPage({ userNickname, isLoggedIn }) {
  const [cartItems, setCartItems] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [selectedItemForReview, setSelectedItemForReview] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      message.warning("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    loadUserData();
  }, [userNickname, isLoggedIn, navigate]);

  const loadUserData = () => {
    const userData = JSON.parse(localStorage.getItem(userNickname)) || {};
    setCartItems(userData.cartItems || []);
    setPurchasedItems(userData.purchasedItems || []);
  };

  const handleReviewClick = (item) => {
    setSelectedItemForReview(item);
    setIsReviewModalVisible(true);
  };

  const handleReviewSubmit = async (values) => {
    try {
      const reviewData = {
        ...values,
        userId: userNickname,
        productId: selectedItemForReview.id,
        createdAt: new Date().toISOString()
      };

      const response = await axios.post(
        `${API_URL}/products/${selectedItemForReview.id}/reviews`,
        reviewData
      );

      // 로컬 스토리지 업데이트
      const userData = JSON.parse(localStorage.getItem(userNickname)) || {};
      const userReviews = userData.reviews || [];
      const newReview = {
        id: response.data.id || Date.now(),
        ...reviewData
      };
      
      userData.reviews = [...userReviews, newReview];
      localStorage.setItem(userNickname, JSON.stringify(userData));

      message.success("후기가 등록되었습니다.");
      setIsReviewModalVisible(false);
      form.resetFields();
      loadUserData();
    } catch (error) {
      console.error("리뷰 등록 실패:", error);
      message.error("후기 등록에 실패했습니다.");
    }
  };

  return (
    <div className="main-page">
      <section className="purchased-section">
        <h3>구매한 제품</h3>
        <div className="purchased-grid">
          {purchasedItems.map((item, index) => (
            <div key={index} className="purchased-item-card">
              <div className="purchased-item-details">
                <h4>{item.name}</h4>
                <p>{item.price}원</p>
                <p>구매일: {dayjs(item.purchaseDate).format('YYYY년 MM월 DD일')}</p>
                <button 
                  className="review-button"
                  onClick={() => handleReviewClick(item)}
                >
                  후기 작성
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Modal
        title="후기 작성"
        visible={isReviewModalVisible}
        onCancel={() => setIsReviewModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleReviewSubmit}>
          <Form.Item
            name="rating"
            label="평점"
            rules={[{ required: true, message: '평점을 선택해주세요' }]}
          >
            <Rate />
          </Form.Item>
          <Form.Item
            name="comment"
            label="후기"
            rules={[{ required: true, message: '후기를 작성해주세요' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              후기 등록
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default MainPage;
