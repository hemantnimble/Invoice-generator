import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const type = formData.get("type") as "logo" | "signature";

  if (!file || !type) {
    return NextResponse.json({ error: "Missing file or type" }, { status: 400 });
  }

  const ext = file.name.split(".").pop();
  const path = `${session.user.id}/${type}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabaseAdmin.storage
    .from("user-assets")
    .upload(path, buffer, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: signedData, error: signError } = await supabaseAdmin.storage
    .from("user-assets")
    .createSignedUrl(path, 60 * 60 * 24 * 365);

  if (signError || !signedData) {
    return NextResponse.json({ error: "Failed to create signed URL" }, { status: 500 });
  }

  return NextResponse.json({ url: signedData.signedUrl });
}