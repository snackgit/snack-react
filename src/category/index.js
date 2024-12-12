import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/constants.js";
import ProductCard from "../components/productCard";

function CategoryPage() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/products`)
      .then((result) => {
        const filteredProducts = result.data.products.filter(
          (product) => product.category === categoryId
        );
        setProducts(filteredProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("에러 발생:", error);
        setLoading(false);
      });
  }, [categoryId]);

  const getCategoryInfo = () => {
    const categoryMap = {
      snack: { title: "추억의 불량식품", link: "" },
      japan: { 
        title: "일본간식", 
        link: "https://itwlsmdwjdqhrhdgkrrhk-68290.waveon.me/" 
      },
      china: { 
        title: "중국간식", 
        link: "https://itwlsmdwjdqhrhdgkrrhk-68297.waveon.me/" 
      },
      asia: { 
        title: "동남아간식", 
        link: "https://itwlsmdwjdqhrhdgkrrhk-68300.waveon.me/" 
      },
      europe: { 
        title: "유럽간식", 
        link: "https://itwlsmdwjdqhrhdgkrrhk-68299.waveon.me/" 
      },
      usa: { 
        title: "미국간식", 
        link: "https://itwlsmdwjdqhrhdgkrrhk-68296.waveon.me/" 
      },
      ramen: { title: "라면/컵라면", link: "" },
      drink: { title: "음료/커피", link: "" },
      box: { title: "박스상품", link: "" }
    };
    return categoryMap[categoryId] || { title: "상품 목록", link: "" };
  };

  const categoryInfo = getCategoryInfo();

  return (
    <div>
      <div style={{ 
        padding: "20px", 
        borderBottom: "1px solid #e8e8e8",
        margin: "0 0 20px 0",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
        <h1 style={{ margin: 0 }}>{categoryInfo.title}</h1>
        {categoryInfo.link && (
          <a 
            href={categoryInfo.link} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color: "#007bff",
              fontSize: "14px"
            }}
          >
            간식 문화 퀴즈 풀어보기~  →
          </a>
        )}
      </div>
      <div id="product-list" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "20px",
        padding: "20px"
      }}>
        {loading ? (
          <div>로딩중...</div>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
