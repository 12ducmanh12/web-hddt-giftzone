// import { useEffect, useState } from "react";
// import "./App.css";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// interface Product {
//   id: number;
//   name: string;
//   unitPrice: number;
//   amount: number;
//   discount: number;
//   total: number;
// }

// interface BillData {
//   billId: number;
//   retailerName: string;
//   products: Product[];
// }
// function Home() {
//   const { billId } = useParams();
//   const [data, setData] = useState<BillData | null>(null);
//   useEffect(() => {
//     axios
//       .get(`http://localhost:5281/api/detail/${billId}`)
//       .then((response) => {
//         setData(response.data);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   }, [billId]);

//   return (
//     <div className="order-container">
//       <div className="order-info">
//         <h2>THÔNG TIN ĐƠN HÀNG</h2>
//         <p>Mã đơn hàng: <span>{data?.billId}</span></p>
//         <p>Tên cửa hàng: <span>{data?.retailerName}</span></p>
//       </div>

//       <table className="order-table">
//         <thead>
//           <tr>
//             <th>STT</th>
//             <th>Tên sản phẩm</th>
//             <th>Đơn giá</th>
//             <th>Số lượng</th>
//             <th>Giảm giá</th>
//             <th>Thành tiền</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data?.products.map((product, index) => (
//             <tr key={product.id}>
//               <td>{index + 1}</td>
//               <td>{product.name}</td>
//               <td>{product.unitPrice.toLocaleString()} đ</td>
//               <td>{product.amount}</td>
//               <td>{product.discount.toLocaleString()} đ</td>
//               <td>{product.total.toLocaleString()} đ</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <button className="modern-btn">
//         <span className="btn-text">Kiểm tra quà tặng</span>
//         <span className="gift-icon" role="img" aria-label="Gift">🎁</span>
//       </button>
//     </div>
//   );
// }

// export default Home;




import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import JSEncrypt from 'jsencrypt';

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
  const publicKey = `-----BEGIN PUBLIC KEY-----
MIGJAoGBANIjaCGikLcafAzkqmlBF75QytBc+Cr938oK03LlEcfcSzFMlAH++yZ9iRpOqVPLzyeB4g9zH/44yO2C6NhPuxz8kl7g0q1piL7mAQLLB+ju02486xMe+/LJ7JOgAsZLUZrABiQM6WVdc7JjVPNzUAEFXIL7/VCez4I3tIkFQzKFAgMBAAE=
-----END PUBLIC KEY-----`; // Thay thế bằng khóa công khai của bạn

  useEffect(() => {
    axios
      .get(`http://localhost:5281/api/detail/${billId}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [billId]);

  const handleCheckGift = () => {
    const timestamp = Date.now();
    // Tạo khóa RSA và mã hóa billId và timestamp
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    const message = `${data?.billId}:${timestamp}`;
    const encrypted = encrypt.encrypt(message);

    // Tạo URL với mã hóa và timestamp
    const giftUrl = `https://zalo.me/s/1983189999337011308/receipt?hc=${encodeURIComponent(encrypted)}&timestamp=${encodeURIComponent(timestamp)}`;

    // Chuyển hướng người dùng
    window.open(giftUrl, '_blank');
  };

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

      <button className="modern-btn" onClick={handleCheckGift}>
        <span className="btn-text">Kiểm tra quà tặng</span>
        <span className="gift-icon" role="img" aria-label="Gift">🎁</span>
      </button>
    </div>
  );
}

export default Home;

