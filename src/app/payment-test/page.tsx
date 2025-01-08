// app/payment-test/page.tsx
"use client";
import { useState } from "react";
import axios from "axios";

export default function PaymentTestPage() {
    const [invoiceCode, setInvoiceCode] = useState("FORU_INVOICE");
    const [amount, setAmount] = useState<number>(100);
    const [invoiceData, setInvoiceData] = useState<any>(null);
    const [qrUrl, setQrUrl] = useState<string>("");
    const [invoiceId, setInvoiceId] = useState("");
    const [checkResult, setCheckResult] = useState<any>(null);

    async function createInvoice() {
        try {
            const res = await axios.post("http://152.42.243.146/api/payments/create-invoice", {
                invoiceCode,
                amount
            });
            setInvoiceData(res.data.invoiceData);
            setQrUrl(res.data.qrDataUrl || "");
            if (res.data.invoiceData?.invoice_id) {
                setInvoiceId(res.data.invoiceData.invoice_id);
            }
        } catch (err) {
            console.error("Create invoice error:", err);
        }
    }

    async function checkInvoice() {
        try {
            if (!invoiceId) return;
            const res = await axios.post("http://152.42.243.146/api/payments/check-invoice", {
                invoiceId
            });
            setCheckResult(res.data.checkResult);
        } catch (err) {
            console.error("Check invoice error:", err);
        }
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>qPay Payment Test</h1>
            <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 4 }}>Invoice Code:</label>
                <input
                    type="text"
                    value={invoiceCode}
                    onChange={(e) => setInvoiceCode(e.target.value)}
                    style={{ padding: 8, width: 200 }}
                />
            </div>
            <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 4 }}>Amount:</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    style={{ padding: 8, width: 200 }}
                />
            </div>
            <button onClick={createInvoice} style={{ padding: "8px 16px" }}>
                Create Invoice
            </button>
            {invoiceData && (
                <pre style={{ whiteSpace: "pre-wrap", marginTop: 16, background: "#f2f2f2", padding: 8 }}>
          {JSON.stringify(invoiceData, null, 2)}
        </pre>
            )}
            {qrUrl && (
                <div style={{ marginTop: 16 }}>
                    <img src={qrUrl} alt="QR Code" style={{ width: 200, height: 200 }} />
                </div>
            )}
            <hr style={{ margin: "24px 0" }} />
            <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 4 }}>Invoice ID:</label>
                <input
                    type="text"
                    value={invoiceId}
                    onChange={(e) => setInvoiceId(e.target.value)}
                    style={{ padding: 8, width: 200 }}
                />
            </div>
            <button onClick={checkInvoice} style={{ padding: "8px 16px" }}>
                Check Invoice
            </button>
            {checkResult && (
                <pre style={{ whiteSpace: "pre-wrap", marginTop: 16, background: "#f2f2f2", padding: 8 }}>
          {JSON.stringify(checkResult, null, 2)}
        </pre>
            )}
        </div>
    );
}
