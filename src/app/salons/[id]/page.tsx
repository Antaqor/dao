"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import {
    PhoneIcon,
    ShareIcon,
    XMarkIcon,
} from "@heroicons/react/24/solid";

import MonthCalendar, { MonthData, DayStatus } from "@/app/components/MonthCalendar";
import { useAuth } from "@/app/context/AuthContext";

/** Data models (same as your original code) */
interface HoursOfOperation {
    [day: string]: string;
}
interface Salon {
    _id: string;
    name: string;
    location: string;
    about?: string;
    logo?: string;
    coverImage?: string;
    hoursOfOperation?: HoursOfOperation;
    lat?: number | null;
    lng?: number | null;
}
interface Service {
    _id: string;
    name: string;
    price: number;
    durationMinutes: number;
}

/** Utility: format "HH:mm" => "H:MM AM/PM" */
function format24to12(time24: string) {
    const [h, m] = time24.split(":");
    let hour = parseInt(h, 10);
    const minute = parseInt(m, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${String(minute).padStart(2, "0")} ${ampm}`;
}

/** Popup props */
interface BookingPopupProps {
    service: Service;
    onClose: () => void;
}

/** Захиалгын Popup компонент */
function BookingPopup({ service, onClose }: BookingPopupProps) {
    const { user } = useAuth(); // context-оос хэрэглэгчийн мэдээлэл (user?.accessToken)
    const [monthData, setMonthData] = useState<MonthData | null>(null);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [times, setTimes] = useState<string[]>([]);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const [loadingTimes, setLoadingTimes] = useState(false);
    const [message, setMessage] = useState("");
    const [done, setDone] = useState(false);

    // Төлбөр / QPay-тэй холбоотой төлөвүүд
    const [invoiceId, setInvoiceId] = useState("");
    const [qrUrl, setQrUrl] = useState("");
    const [paymentDone, setPaymentDone] = useState(false);
    const [checkingPayment, setCheckingPayment] = useState(false);

    // 1) Туршилтын хуанли (1-р сарын өгөгдөл) ачаалах
    useEffect(() => {
        const januaryDays: DayStatus[] = [
            { day: 6, status: "goingFast" },
            { day: 10, status: "fullyBooked" },
        ];
        setMonthData({ year: 2025, month: 0, days: januaryDays });
    }, []);

    // 2) Өдөр сонгоход тухайн өдрийн боломжит цагуудыг авах
    useEffect(() => {
        if (!selectedDay) {
            setTimes([]);
            return;
        }
        setLoadingTimes(true);
        setMessage("");

        const dateStr = `2025-01-${String(selectedDay).padStart(2, "0")}`;
        axios
            .get<{ times: string[] }[]>(
                `http://68.183.191.149/api/services/${service._id}/availability`,
                { params: { date: dateStr } }
            )
            .then((res) => {
                const allTimes = res.data.flatMap((b) => b.times || []);
                setTimes([...new Set(allTimes)].sort());
            })
            .catch(() => {
                setMessage("Цаг ачаалж чадсангүй.");
            })
            .finally(() => setLoadingTimes(false));
    }, [selectedDay, service._id]);

    /**
     * 3) Цаг захиалах -> QPay нэхэмжлэл үүсгэх -> push мэдэгдэл төлөвлөх
     */
    async function handleBookTime() {
        if (!user) {
            setMessage("Нэвтэрч орно уу (Token алга).");
            return;
        }
        if (!user.accessToken) {
            setMessage("Token алга байна. Дахин нэвтэрнэ үү.");
            return;
        }
        if (!selectedDay || !selectedTime) {
            setMessage("Өдөр болон цаг сонгоно уу.");
            return;
        }

        try {
            const dateStr = `2025-01-${String(selectedDay).padStart(2, "0")}`;
            // a) Цаг захиалга үүсгэх
            const apptRes = await axios.post(
                "http://68.183.191.149/api/appointments",
                {
                    serviceId: service._id,
                    date: dateStr,
                    startTime: selectedTime,
                    status: "pendingPayment",
                },
                { headers: { Authorization: `Bearer ${user.accessToken}` } }
            );

            if (apptRes.status === 201) {
                setMessage("Цаг амжилттай захиалагдлаа! Төлбөрийн нэхэмжлэл үүсгэж байна...");

                // b) QPay-н нэхэмжлэл үүсгэх
                const invoiceRes = await axios.post<{
                    success?: boolean;
                    invoiceData?: { invoice_id?: string };
                    qrDataUrl?: string;
                }>("http://68.183.191.149/api/payments/create-invoice", {
                    invoiceCode: "FORU_INVOICE",
                    amount: service.price,
                });

                if (invoiceRes.data?.success) {
                    const inv = invoiceRes.data.invoiceData;
                    setInvoiceId(inv?.invoice_id || "");
                    setQrUrl(invoiceRes.data.qrDataUrl || "");
                    setMessage("Төлбөрийн нэхэмжлэл үүссэн. Та QR-ээр эсвэл Social Pay-ээр төлнө үү.");
                } else {
                    setMessage("QPay нэхэмжлэл үүсгэхэд алдаа гарлаа.");
                }

                // c) Push мэдэгдэл (30 минутын өмнө) төлөвлөх
                const year = 2025;
                const month = 0; // 1-р сар
                const dayNum = selectedDay;
                const [hh, mm] = selectedTime.split(":").map(Number);
                const appointmentDate = new Date(year, month, dayNum, hh, mm);

                await handleScheduleReminder(appointmentDate);

                setDone(true);
            } else {
                setMessage("Захиалга үүсгэхэд алдаа гарлаа.");
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                setMessage("Token буруу буюу хугацаа дууссан. Дахин нэвтэрнэ үү.");
            } else {
                setMessage("Серверийн алдаа эсвэл нэвтрэлт шаардлагатай.");
            }
        }
    }

    /** c) Сервер талд push мэдэгдэл төлөвлөх хүсэлт илгээх (30 мин өмнө) */
    async function handleScheduleReminder(appointmentDate: Date) {
        try {
            await axios.post("http://68.183.191.149/api/notifications/schedule", {
                appointmentDate, // ISO форматаар эсвэл шаардлагатай мэдээллээ дамжуулна
            });
            console.log("Push мэдэгдлийг амжилттай төлөвлөлөө!");
        } catch (err) {
            console.error("Push мэдэгдэл төлөвлөх үед алдаа гарлаа:", err);
        }
    }

    /**
     * 4) Төлбөрийн төлөв шалгах
     */
    async function handleCheckPayment() {
        if (!invoiceId) {
            setMessage("Invoice ID алга байна. Төлбөр шалгах боломжгүй.");
            return;
        }
        setMessage("");
        setCheckingPayment(true);

        try {
            const checkRes = await axios.post<{
                checkResult?: { rows?: Array<{ payment_status?: string }> };
            }>("http://68.183.191.149/api/payments/check-invoice", { invoiceId });

            const payRow = checkRes.data.checkResult?.rows?.[0];
            const payStatus = payRow?.payment_status || "UNPAID";

            if (payStatus === "PAID") {
                setPaymentDone(true);
                setMessage("Төлбөр амжилттай хийгдсэн!");
            } else {
                setMessage("Төлбөр хараахан төлөгдөөгүй байна.");
            }
        } catch {
            setMessage("Төлбөр шалгахад алдаа гарлаа.");
        } finally {
            setCheckingPayment(false);
        }
    }

    // Popup UI-г буцааж рэндэрлэх
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
        >
            <div className="bg-white w-full max-w-md rounded-lg relative p-6 shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="Захиалгын цонхыг хаах"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                {/* Хэрэв done = false => цаг захиалах явц */}
                {/* Хэрэв done = true => Төлбөрийн дэлгэц */}
                {!done ? (
                    <>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                            {service.name}
                            <span className="ml-2 text-base text-primary font-medium">
                                {service.price.toLocaleString()}₮
                            </span>
                        </h2>

                        {monthData && (
                            <MonthCalendar
                                monthData={monthData}
                                selectedDay={selectedDay}
                                onSelectDay={setSelectedDay}
                            />
                        )}
                        {loadingTimes && (
                            <p className="mt-3 text-sm text-gray-500">Цаг ачаалж байна...</p>
                        )}
                        {message && (
                            <p className="mt-3 text-sm text-red-600 font-medium">
                                {message}
                            </p>
                        )}

                        {times.length > 0 && !loadingTimes && (
                            <div className="mt-4 grid grid-cols-3 gap-3">
                                {times.map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setSelectedTime(t)}
                                        className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                                            selectedTime === t
                                                ? "bg-neutral-900 text-white border-neutral-900"
                                                : "border-gray-300 hover:bg-gray-100"
                                        }`}
                                    >
                                        {format24to12(t)}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                                Болих
                            </button>
                            <button
                                onClick={handleBookTime}
                                className="px-4 py-2 text-sm rounded-md bg-neutral-900 text-white hover:bg-neutral-700"
                            >
                                Цаг захиалах
                            </button>
                        </div>
                    </>
                ) : (
                    // Захиалга дууссан тохиолдолд => төлбөр шалгах, эцсийн мэдээлэл
                    <div className="text-center px-4 py-6">
                        {paymentDone ? (
                            <h2 className="text-xl font-bold text-green-600 mb-3">
                                Төлбөр амжилттай!
                            </h2>
                        ) : (
                            <h2 className="text-xl font-bold text-green-600 mb-3">
                                Цаг амжилттай захиалагдлаа!
                            </h2>
                        )}
                        {message && (
                            <p className="text-sm text-gray-700 mb-4">{message}</p>
                        )}
                        {qrUrl && !paymentDone && (
                            <img
                                src={qrUrl}
                                alt="Төлбөрийн QR"
                                className="mx-auto mb-4"
                                style={{ width: 200, height: 200 }}
                            />
                        )}
                        {!paymentDone && invoiceId && (
                            <button
                                onClick={handleCheckPayment}
                                className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-500"
                                disabled={checkingPayment}
                            >
                                {checkingPayment ? "Шалгаж байна..." : "Төлбөр шалгах"}
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="mt-4 px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                            Хаах
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

/** Үндсэн SalonDetailPage компонент */
export default function SalonDetailPage() {
    const params = useParams() as { id?: string };
    const [salon, setSalon] = useState<Salon | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [error, setError] = useState("");
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [showPopup, setShowPopup] = useState(false);

    const phoneNumber = "+97694641031";
    const shareUrl = `http://localhost:3000/salons/${params.id}`;

    // 1) Салоны мэдээлэл болон үйлчилгээг нь татах
    useEffect(() => {
        if (!params.id) return;
        (async () => {
            try {
                const salonRes = await axios.get<Salon>(
                    `http://68.183.191.149/api/salons/${params.id}`
                );
                setSalon(salonRes.data);

                const servicesRes = await axios.get<Service[]>(
                    `http://68.183.191.149/api/services/salon/${params.id}`
                );
                setServices(servicesRes.data);
            } catch (err) {
                console.error("Салон болон үйлчилгээ уншихад алдаа гарлаа:", err);
                setError("Салон болон үйлчилгээ уншихад алдаа гарлаа.");
            }
        })();
    }, [params.id]);

    // 2) Хуваалцах логик
    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: salon?.name || "Салон",
                    text: salon?.about || "",
                    url: shareUrl,
                });
            } else {
                await navigator.clipboard.writeText(shareUrl);
                alert("Холбоосыг хууллаа!");
            }
        } catch (err) {
            console.error("Хуваалцахад алдаа:", err);
        }
    };

    // 3) Захиалгын popup нээх/хаах
    function openPopup(svc: Service) {
        setSelectedService(svc);
        setShowPopup(true);
    }
    function closePopup() {
        setShowPopup(false);
        setSelectedService(null);
    }

    // 4) Алдааны байдал эсвэл ачаалж буй байдал
    if (error) {
        return (
            <div className="flex min-h-screen bg-white">
                <div className="flex-1 mx-auto max-w-5xl p-4">
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }
    if (!salon) {
        return (
            <div className="flex min-h-screen bg-white">
                <div className="flex-1 mx-auto max-w-5xl p-4 text-center text-gray-600">
                    Салон ачаалж байна...
                </div>
            </div>
        );
    }

    // 5) Байршлын Google Map линк
    const googleMapsLink =
        salon.lat != null && salon.lng != null
            ? `https://maps.google.com/?q=${salon.lat},${salon.lng}`
            : `https://maps.google.com/?q=${encodeURIComponent(salon.location)}`;

    // Экран руу рэндэрлэх хэсэг
    return (
        <div className="flex min-h-screen bg-white">
            <main className="flex-1 mx-auto max-w-5xl px-4 sm:px-6 py-6">
                {/* Хавтасны зураг */}
                {salon.coverImage && (
                    <div className="h-60 bg-gray-200 overflow-hidden mb-6 rounded-md">
                        <img
                            src={salon.coverImage}
                            alt="Хавтасны зураг"
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Салоны үндсэн мэдээлэл ба Хуваалцах товч */}
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-4">
                    <div className="flex items-start gap-3">
                        <div className="h-20 w-20 bg-white rounded-full overflow-hidden border border-gray-300">
                            {salon.logo ? (
                                <img
                                    src={salon.logo}
                                    alt={`${salon.name} Logo`}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full bg-gray-100" />
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-900">{salon.name}</h1>
                            <p className="mt-1 text-sm text-gray-500">{salon.location}</p>
                            {salon.about && (
                                <p className="mt-2 text-sm text-gray-600 max-w-prose">
                                    {salon.about}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <a
                            href={`tel:${phoneNumber}`}
                            className="inline-flex items-center bg-neutral-900 text-white px-3 py-1.5 rounded-md hover:bg-neutral-700 transition-colors"
                        >
                            <PhoneIcon className="h-5 w-5 mr-2" />
                            Залгах
                        </a>
                        <button
                            onClick={handleShare}
                            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors focus:outline-none"
                        >
                            <ShareIcon className="h-5 w-5 mr-1" />
                            Хуваалцах
                        </button>
                    </div>
                </div>

                {/* Үйлчилгээний жагсаалт */}
                {services.length === 0 ? (
                    <p className="text-sm text-gray-500">Үйлчилгээ олдсонгүй.</p>
                ) : (
                    <ul className="space-y-3">
                        {services.map((svc) => (
                            <li
                                key={svc._id}
                                className="p-4 border border-gray-200 rounded-lg flex items-center justify-between bg-white"
                            >
                                <div>
                                    <p className="font-medium text-neutral-800">{svc.name}</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {svc.price.toLocaleString()}₮ — {svc.durationMinutes} мин
                                    </p>
                                </div>
                                <button
                                    onClick={() => openPopup(svc)}
                                    className="bg-neutral-900 text-white px-3 py-2 rounded-md hover:bg-neutral-700 transition-colors text-sm focus:outline-none"
                                >
                                    Цаг захиалах
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Газрын зураг руу үсрэх линк */}
                <div className="mt-4">
                    <a
                        href={googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        Газрын зураг дээр харах
                    </a>
                </div>
            </main>

            {/* Захиалга хийх popup */}
            {showPopup && selectedService && (
                <BookingPopup service={selectedService} onClose={closePopup} />
            )}
        </div>
    );
}
