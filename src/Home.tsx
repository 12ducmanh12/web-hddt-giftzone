import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { useParams } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  unitPrice: number;
  amount: number;
  discount: number;
  total: number;
}

interface BillData {
  billId: number;
  retailerName: string;
  products: Product[];
}
function Home() {
  const { billId } = useParams();
  const [data, setData] = useState<BillData | null>(null);
  useEffect(() => {
    axios
      .get(`http://localhost:5281/api/detail/${billId}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <div className="order-container">
      <div className="order-info">
        <h2>THÔNG TIN ĐƠN HÀNG</h2>
        <p>Mã đơn hàng: <span>{data?.billId}</span></p>
        <p>Tên cửa hàng: <span>{data?.retailerName}</span></p>
      </div>

      <table className="order-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên sản phẩm</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
            <th>Giảm giá</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {data?.products.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td>{product.name}</td>
              <td>{product.unitPrice.toLocaleString()} đ</td>
              <td>{product.amount}</td>
              <td>{product.discount.toLocaleString()} đ</td>
              <td>{product.total.toLocaleString()} đ</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="modern-btn">
        <span className="btn-text">Kiểm tra quà tặng</span>
        <span className="gift-icon" role="img" aria-label="Gift">🎁</span>
      </button>
    </div>
  );
}

export default Home;
