import { NextResponse } from "next/server";
import { RtcTokenBuilder, RtcRole } from "agora-access-token";

export async function POST(request) {
  try {
    const { channelName, role } = await request.json();

    if (!channelName) {
      return NextResponse.json(
        { error: "Channel name is required" },
        { status: 400 }
      );
    }

    // Get these from your environment variables
    const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    if (!appId || !appCertificate) {
      console.error("Missing Agora credentials:", { appId, appCertificate });
      return NextResponse.json(
        { error: "Agora credentials not configured" },
        { status: 500 }
      );
    }

    const uid = 0; // Set to 0 to allow Agora to assign one
    const expirationTimeInSeconds = 3600; // 1 hour
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // Generate the token
    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      role === "publisher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER,
      privilegeExpiredTs
    );

    if (!token) {
      throw new Error("Failed to generate token");
    }

    console.log("Token generated successfully for channel:", channelName);

    return NextResponse.json({
      token,
      appId,
      uid,
      channel: channelName,
      role: role === "publisher" ? "PUBLISHER" : "SUBSCRIBER",
    });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session: " + error.message },
      { status: 500 }
    );
  }
}
