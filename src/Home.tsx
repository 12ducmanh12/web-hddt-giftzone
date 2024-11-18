import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { baseUrl } from "./constant/constant";
import { useParams } from "react-router-dom";
import { JSEncrypt } from "jsencrypt";
import { secretKey } from "./constant/constant";

interface Product {
  ProductId: number;
  sku: string;
  name: string;
  unitPrice: number;
  amount: number;
  discount: number;
  total: number;
}

interface BillData {
  billId: number;
  storeName: string;
  products: Product[];
}

function Home() {
  const { billId } = useParams();
  const [data, setData] = useState<BillData | null>(null);
  console.log(secretKey);
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/detail/${billId}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [billId]);

  const handleCheckGift = () => {
    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(secretKey);
    const encrypted = encryptor.encrypt(billId || "");
    console.log(encrypted);
    if (encrypted) {
      const giftUrl = `https://zalo.me/s/1983189999337011308/receipt?env=TESTING&version=46&Billid=${encodeURIComponent(
        encrypted
      )}`;
      window.open(giftUrl, "_blank");
    } else {
      console.error("Encryption failed.");
    }
  };

  return (
    <div className="order-container">
      <div className="order-info">
        <h2>THÔNG TIN ĐƠN HÀNG</h2>
        <p>
          Mã đơn hàng: <span>{data?.billId}</span>
        </p>
        <p>
          Tên cửa hàng: <span>{data?.storeName}</span>
        </p>
      </div>

      <table className="order-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên sản phẩm</th>
            <th>Sku</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
            <th>Giảm giá</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {data?.products.map((product, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{product.name}</td>
              <td>{product.sku}</td>
              <td>{product.unitPrice.toLocaleString()} đ</td>
              <td>{product.amount}</td>
              <td>{product.discount.toLocaleString()} đ</td>
              <td>{product.total.toLocaleString()} đ</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="modern-btn" onClick={handleCheckGift}>
        <span className="btn-text">Kiểm tra quà tặng</span>
        <span className="gift-icon" role="img" aria-label="Gift">
          🎁
        </span>
      </button>
      <button className="modern-export">
        <span className="btn-text-export">Xuất hóa đơn</span>
      </button>
    </div>
  );
}

export default Home;
