"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { uploadFile } from "@/lib/storage";
import type { Profile } from "@/types/database";
import { Upload, Loader2, Check } from "lucide-react";

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingSig, setUploadingSig] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (status === "authenticated") {
            fetch("/api/profile")
                .then((res) => res.json())
                .then((data) => {
                    setProfile(data);
                    setLoading(false);
                });
        }
    }, [status]);

    const handleSave = async () => {
        if (!profile) return;
        setSaving(true);
        await fetch("/api/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                business_name: profile.business_name,
                business_phone: profile.business_phone,
                business_address: profile.business_address,
            }),
        });
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleFileUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "logo" | "signature"
    ) => {
        const file = e.target.files?.[0];
        if (!file || !session?.user?.id) return;

        type === "logo" ? setUploadingLogo(true) : setUploadingSig(true);

        const url = await uploadFile(file, type);

        if (url) {
            const field = type === "logo" ? "logo_url" : "signature_url";
            setProfile((prev) => (prev ? { ...prev, [field]: url } : prev));
            await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [field]: url }),
            });
        }

        type === "logo" ? setUploadingLogo(false) : setUploadingSig(false);
    };

    if (loading || status === "loading") {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-indigo-500" size={28} />
            </main>
        );
    }

    if (!profile) return null;

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="max-w-xl mx-auto space-y-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Business Settings</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        This appears on every invoice you create
                    </p>
                </div>

                {/* Business Info */}
                <div className="bg-white rounded-2xl shadow p-6 space-y-4">
                    <Field label="Business Name">
                        <input
                            value={profile.business_name}
                            onChange={(e) =>
                                setProfile({ ...profile, business_name: e.target.value })
                            }
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Phone">
                        <input
                            value={profile.business_phone}
                            onChange={(e) =>
                                setProfile({ ...profile, business_phone: e.target.value })
                            }
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Address">
                        <input
                            value={profile.business_address}
                            onChange={(e) =>
                                setProfile({ ...profile, business_address: e.target.value })
                            }
                            className={inputClass}
                        />
                    </Field>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                    >
                        {saving ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : saved ? (
                            <Check size={16} />
                        ) : null}
                        {saved ? "Saved" : saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>

                {/* Logo Upload */}
                <div className="bg-white rounded-2xl shadow p-6 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700">Business Logo</h3>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full border-2 border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 shrink-0">
                            {profile.logo_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={profile.logo_url} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xs text-gray-400">No logo</span>
                            )}
                        </div>
                        <label className="flex items-center gap-2 text-sm font-medium text-indigo-600 cursor-pointer hover:text-indigo-800">
                            {uploadingLogo ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Upload size={16} />
                            )}
                            {uploadingLogo ? "Uploading..." : "Upload Logo"}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, "logo")}
                                disabled={uploadingLogo}
                            />
                        </label>
                    </div>
                </div>

                {/* Signature Upload */}
                <div className="bg-white rounded-2xl shadow p-6 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700">Signature</h3>
                    <div className="flex items-center gap-4">
                        <div className="w-32 h-16 rounded-lg border-2 border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 shrink-0">
                            {profile.signature_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={profile.signature_url} alt="Signature" className="w-full h-full object-contain" />
                            ) : (
                                <span className="text-xs text-gray-400">No signature</span>
                            )}
                        </div>
                        <label className="flex items-center gap-2 text-sm font-medium text-indigo-600 cursor-pointer hover:text-indigo-800">
                            {uploadingSig ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Upload size={16} />
                            )}
                            {uploadingSig ? "Uploading..." : "Upload Signature"}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, "signature")}
                                disabled={uploadingSig}
                            />
                        </label>
                    </div>
                </div>
            </div>
        </main>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">{label}</label>
            {children}
        </div>
    );
}

const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition";