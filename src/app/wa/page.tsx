"use client";

import { useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import Image from "next/image";

const QUICK_MESSAGES = [
    "",
    "Hi, thank you for your enquiry! 🏡 Please share your preferred dates and number of guests so we can check availability.",
    "Hi! Thanks for reaching out. Could you please share your check-in and check-out dates?",
    "Hello! We received your enquiry. Our villas are available — please confirm your dates and we'll send you the details.",
];

export default function WAPage() {
    const [phone, setPhone] = useState("");
    const [selectedMsg, setSelectedMsg] = useState(0);
    const [customMsg, setCustomMsg] = useState("");

    const cleanPhone = (num: string) => {
        let digits = num.replace(/[^\d]/g, "");
        if (digits.length === 10) digits = `91${digits}`;
        return digits;
    };

    const handleOpen = () => {
        const number = cleanPhone(phone);
        if (!number) return;
        const message = customMsg.trim() || QUICK_MESSAGES[selectedMsg];
        const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    const isValid = phone.replace(/\D/g, "").length >= 10;

    return (
        <main className="min-h-screen bg-gray-50 pb-24 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-2 sticky top-0 z-10 shadow-sm">
                <Image
                    src="/icons/icon-192x192.png"
                    alt="RentalInvoice"
                    width={28}
                    height={28}
                    className="rounded-lg"
                />
                <h1 className="text-lg font-bold text-gray-900">Quick WhatsApp</h1>
            </header>

            <div className="max-w-sm mx-auto w-full px-4 py-8 space-y-5">
                {/* Phone Input */}
                <div className="bg-white rounded-2xl shadow p-5 space-y-3">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Phone size={15} className="text-[#2D3A8C]" />
                        Customer Phone Number
                    </label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter 10-digit number"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-lg font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2D3A8C]/30 focus:border-[#2D3A8C] transition placeholder:text-gray-300 tracking-wider"
                        maxLength={15}
                    />
                </div>

                {/* Message Selection */}
                <div className="bg-white rounded-2xl shadow p-5 space-y-3">
                    <label className="text-sm font-semibold text-gray-700">
                        Quick Message
                    </label>
                    <div className="space-y-2">
                        {QUICK_MESSAGES.map((msg, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => { setSelectedMsg(i); setCustomMsg(""); }}
                                className={`w-full text-left text-xs p-3 rounded-xl border-2 transition ${selectedMsg === i && !customMsg
                                        ? "border-[#2D3A8C] bg-[#eef0fb] text-[#2D3A8C]"
                                        : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200"
                                    }`}
                            >
                                {i === 0 ? (
                                    <span className="font-medium text-gray-400 italic">No message — open chat only</span>
                                ) : msg}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs text-gray-500 font-medium">
                            Or type a custom message
                        </label>
                        <textarea
                            value={customMsg}
                            onChange={(e) => setCustomMsg(e.target.value)}
                            placeholder="Type your own message..."
                            rows={3}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2D3A8C]/30 focus:border-[#2D3A8C] transition placeholder:text-gray-300 resize-none"
                        />
                    </div>
                </div>

                {/* Open WhatsApp Button */}
                <button
                    onClick={handleOpen}
                    disabled={!isValid}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition shadow-md text-base"
                >
                    <MessageCircle size={20} />
                    Open WhatsApp Chat
                </button>

                {!isValid && phone.length > 0 && (
                    <p className="text-xs text-red-400 text-center">
                        Please enter a valid 10-digit number
                    </p>
                )}
            </div>
        </main>
    );
}