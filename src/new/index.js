import React, { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";
import { API_URL } from "../config/constants";
import { Link } from "react-router-dom";

function NewProductsPage() {
  const [products, setProducts] = useState([]);

  // 상품 데이터를 가져오기 (API 호출)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // API 호출
        const response = await axios.get(`${API_URL}/products`);
        const fetchedProducts = response.data.products;

        // 최신순 정렬
        const sortedProducts = fetchedProducts.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setProducts(sortedProducts);
      } catch (error) {
        console.error("상품 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="new-products-page">
      <header className="new-products-header">
        <h1>신상품 목록</h1>
      </header>
      <section className="new-products-list">
        {products.map((product) => (
          <Link to={`/products/${product.id}`} key={product.id} className="product-card">
            {/* 상품 이미지 */}
            <img src={`${API_URL}/${product.imageUrl}`} alt={product.name} className="product-image" />

            {/* 상품 정보 */}
            <div className="product-details">
              <h2 className="product-name">{product.name}</h2>
              <div id="price">{product.price.toLocaleString()}원</div>
              <div id="profile-box">
                 <img src="/images/icons/avatar.png" alt="프로필 아이콘" />
                 <span>{product.seller}</span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}

export default NewProductsPage;
