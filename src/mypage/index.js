import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message, Modal, Form, Input, Rate, Button } from "antd";
import "./MyPage.css";
import dayjs from "dayjs";
import { API_URL } from "../config/constants";
import axios from "axios";

function MyPage({ userNickname, isLoggedIn }) {
  const [cartItems, setCartItems] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [address, setAddress] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [savedAddress, setSavedAddress] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
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

    const userData = JSON.parse(localStorage.getItem(userNickname)) || {};
    const {
      address: storedAddress,
      zipcode: storedZipcode,
      cartItems: storedCartItems,
      purchasedItems: storedPurchasedItems
    } = userData;

    if (storedAddress && storedZipcode) {
      setSavedAddress({ address: storedAddress, zipcode: storedZipcode });
    }
    setCartItems(storedCartItems || []);
    setPurchasedItems(storedPurchasedItems || []);
  }, [userNickname, isLoggedIn, navigate]);

  const handleSaveAddress = () => {
    if (address && zipcode) {
      setSavedAddress({ address, zipcode });
      const updatedUserData = {
        ...JSON.parse(localStorage.getItem(userNickname)),
        address,
        zipcode,
      };
      localStorage.setItem(userNickname, JSON.stringify(updatedUserData));
      message.success("배송지가 저장되었습니다!");
      setIsEditingAddress(false);
    } else {
      message.error("주소와 우편번호를 입력해주세요.");
    }
  };

  const handleItemClick = (itemId) => {
    navigate(`/products/${itemId}`);
  };

  const handleRemoveItem = (itemId) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
    const userData = JSON.parse(localStorage.getItem(userNickname)) || {};
    const updatedUserData = {
      ...userData,
      cartItems: updatedCartItems,
    };
    localStorage.setItem(userNickname, JSON.stringify(updatedUserData));
    setCartItems(updatedCartItems);
    message.success("상품이 장바구니에서 삭제되었습니다.");
  };

  const handleReviewClick = (item) => {
    setSelectedItemForReview(item);
    setIsReviewModalVisible(true);
  };

  const handleReviewSubmit = async (values) => {
    try {
      const response = await axios.post(`${API_URL}/products/${selectedItemForReview.id}/reviews`, {
        ...values,
        userId: userNickname,
      });
      message.success("후기가 등록되었습니다.");
      setIsReviewModalVisible(false);
      form.resetFields();
      
      const userData = JSON.parse(localStorage.getItem(userNickname)) || {};
      const userReviews = userData.reviews || [];
      const newReview = {
        ...response.data.review,
        productId: selectedItemForReview.id
      };
      userData.reviews = [...userReviews, newReview];
      localStorage.setItem(userNickname, JSON.stringify(userData));
    } catch (error) {
      message.error("후기 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="my-page">
      <header className="my-page-header">
        <h1>마이페이지</h1>
      </header>

      <section className="profile-section">
        <div className="profile-info">
          <img src="/images/icons/avatar.png" alt="프로필 아이콘" className="profile-avatar" />
          <div>
            <h2>{userNickname}</h2>
          </div>
        </div>
      </section>

      <section className="address-section">
        <h3 style={{ fontWeight: 'bold', fontSize: '18px' }}>배송지 정보</h3>
        {savedAddress ? (
          <>
            <p>주소: {savedAddress.address}</p>
            <p>우편번호: {savedAddress.zipcode}</p>
          </>
        ) : (
          <p>등록된 배송지가 없습니다.</p>
        )}
        {!isEditingAddress && (
          <button onClick={() => setIsEditingAddress(true)}>배송지 입력</button>
        )}
        {isEditingAddress && (
          <div className="address-form">
            <input
              type="text"
              placeholder="주소를 입력하세요"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              type="text"
              placeholder="우편번호를 입력하세요"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
            />
            <button onClick={handleSaveAddress}>저장</button>
            <button onClick={() => setIsEditingAddress(false)}>취소</button>
          </div>
        )}
      </section>

      <section className="cart-section">
        <h3>장바구니</h3>
        {cartItems.length > 0 ? (
          <div className="cart-grid">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="cart-item-card"
                onClick={() => handleItemClick(item.id)}
              >
                <div id="image-box">
                  <img src={`${API_URL}/${item.imageUrl}`} alt="상품 이미지" />
                </div>
                <div className="cart-item-details">
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-price">{item.price}원</p>
                  <p className="cart-item-seller">
                    <img src="/images/icons/avatar.png" alt="판매자 아이콘" className="seller-icon" />
                    {item.seller}
                  </p>
                  <p className="cart-item-createdAt">{dayjs(item.createdAt).fromNow()}</p>
                  <button
                  className="remove-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveItem(item.id);
                  }}
                >
                  취소
                </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>장바구니가 비어 있습니다.</p>
        )}
      </section>

      <section className="purchased-section">
        <h3>구매한 제품</h3>
        {purchasedItems.length > 0 ? (
          <div className="purchased-grid">
            {purchasedItems.map((item, index) => (
              <div
                key={index}
                className="purchased-item-card"
              >
                <div id="image-box" onClick={() => handleItemClick(item.id)}>
                  <img src={`${API_URL}/${item.imageUrl}`} alt="상품 이미지" />
                </div>
                <div className="purchased-item-details">
                  <p className="purchased-item-name">{item.name}</p>
                  <p className="purchased-item-price">{item.price}원</p>
                  <p className="purchased-item-seller">
                    <img src="/images/icons/avatar.png" alt="판매자 아이콘" className="seller-icon" />
                    {item.seller}
                  </p>
                  <p className="purchased-item-date">
                    구매일: {dayjs(item.purchaseDate).format('YYYY년 MM월 DD일')}
                  </p>
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
        ) : (
          <p>구매한 제품이 없습니다.</p>
        )}
      </section>

      <Modal
        title="후기 작성"
        visible={isReviewModalVisible}
        onCancel={() => setIsReviewModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleReviewSubmit}>
          <Form.Item name="rating" label="평점" rules={[{ required: true, message: '평점을 선택해주세요' }]}>
            <Rate />
          </Form.Item>
          <Form.Item name="comment" label="후기" rules={[{ required: true, message: '후기를 작성해주세요' }]}>
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

export default MyPage;