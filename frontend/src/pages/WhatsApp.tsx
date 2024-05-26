import React , { useState } from 'react'
import { Button } from "@mui/material";
import toast from "react-hot-toast";
import { getQRCode } from '../helpers/api-communicator';
import QRCode from 'qrcode.react';

const WhatsApp = () => {

  const [qrText, setQRText] = useState('');
  const [showQR, setShowQR] = useState(false);

  const fetchQRCode = async () => {
    toast.loading("Creating QR Code", { id: "qrcode" });
    const data = await getQRCode();
    console.log(`reciving : ${data.qrCode}`);
    setQRText(data.qrCode);
    setShowQR(true);
    toast.success("QR Code Created", { id: "qrcode" });
  };

  return (
    <div style={{ textAlign: 'center', paddingTop: '20vh' }}>
      <Button variant="contained" color="primary" onClick={fetchQRCode}>
        Fetch and Generate QR Code
      </Button>
      {showQR && (
        <div style={{ marginTop: '2em', backgroundColor: 'white', padding: '1em' }}>
          <QRCode value={qrText} size={256} />
        </div>
      )}
    </div>
  )
}

export default WhatsApp
