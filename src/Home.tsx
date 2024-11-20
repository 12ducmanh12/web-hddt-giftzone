import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { baseUrl } from "./constant/constant";
import { useParams } from "react-router-dom";
import CryptoJS from "crypto-js";

const aesKey = "aC9fHp@kLnQp3sVz2u5x8z$B&E)H@Mca";
const aesIV = "3D6F9J1M4P7T0V2X";
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
  const encrypt = (text: string) => {
    const key = CryptoJS.enc.Utf8.parse(aesKey);
    const iv = CryptoJS.enc.Utf8.parse(aesIV);
    const encrypted = CryptoJS.AES.encrypt(text, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Convert to URL-Safe Base64
    let base64 = encrypted.toString();
    let urlSafeBase64 = base64
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    return urlSafeBase64;
  };
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
    if (!billId) return;

    const encryptedBillId = encrypt(billId);
    const giftUrl = `https://zalo.me/s/1983189999337011308/receipt?env=TESTING&version=48&Billid=${encodeURIComponent(
      encryptedBillId
    )}`;
    window.open(giftUrl, "_blank");
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
