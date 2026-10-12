
import { useEffect, useRef, useState } from "react";

function ZayraBriefing({
  todayEvents,
  tasks,
  goals,
  trackers,
  balance,
  weather,
}) {
  const [aiBriefing, setAiBriefing] = useState("");
  const [aiLoading, setAiLoading] = useState(true);
  const [aiError, setAiError] = useState("");

  const [isLive, setIsLive] = useState(false);
  const [liveConnecting, setLiveConnecting] = useState(false);
  const [liveError, setLiveError] = useState("");

  const peerRef = useRef(null);
  const micStreamRef = useRef(null);
  const audioRef = useRef(null);

  // Keep your existing AI briefing
  useEffect(() => {
    const getAIBriefing = async () => {
      try {
        setAiLoading(true);
        setAiError("");

        const response = await fetch(
          "http://localhost:3001/api/briefing",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              todayEvents,
              tasks,
              goals,
              trackers,
              balance,
              weather,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Unable to get AI briefing.");
        }

        const data = await response.json();
        setAiBriefing(data.briefing);
      } catch (error) {
        console.error("ZAYRA briefing error:", error);

        setAiError(
          "ZAYRA couldn't check in right now. She's probably fixing her eyeliner. ♡"
        );
      } finally {
        setAiLoading(false);
      }
    };

    getAIBriefing();
  }, [
    todayEvents,
    tasks,
    goals,
    trackers,
    balance,
    weather,
  ]);

  // End the current Live conversation
  const stopLive = () => {
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }

    if (micStreamRef.current) {
      micStreamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      micStreamRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.srcObject = null;
    }

    setIsLive(false);
    setLiveConnecting(false);
  };

  // Start a real-time conversation with ZAYRA
  const startLive = async () => {
    setLiveConnecting(true);
    setLiveError("");

    let peer;

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Your browser doesn't support microphone access here."
        );
      }

      // Request microphone permission
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      micStreamRef.current = stream;

      // Create the WebRTC connection
      peer = new RTCPeerConnection();
      peerRef.current = peer;

      // Send Zee's microphone audio to ZAYRA
      stream.getTracks().forEach((track) => {
        peer.addTrack(track, stream);
      });

      // Play ZAYRA's incoming voice
      peer.ontrack = async (event) => {
        if (audioRef.current) {
          audioRef.current.srcObject = event.streams[0];

          try {
            await audioRef.current.play();
          } catch (error) {
            console.error("ZAYRA audio playback error:", error);
          }
        }
      };

      // Create the WebRTC offer
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      // Wait for ICE gathering to finish so the SDP is ready
      if (peer.iceGatheringState !== "complete") {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            cleanupGathering();
            reject(
              new Error("Timed out preparing the voice connection.")
            );
          }, 10000);

          const cleanupGathering = () => {
            clearTimeout(timeout);
            peer.removeEventListener(
              "icegatheringstatechange",
              checkGathering
            );
          };

          const checkGathering = () => {
            if (peer.iceGatheringState === "complete") {
              cleanupGathering();
              resolve();
            }
          };

          peer.addEventListener(
            "icegatheringstatechange",
            checkGathering
          );
        });
      }

      if (!peer.localDescription?.sdp) {
        throw new Error("Couldn't prepare the voice connection.");
      }

      // Your server securely creates the Live session
      const response = await fetch(
        "http://localhost:3001/api/live",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/sdp",
          },
          body: peer.localDescription.sdp,
        }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message || "Unable to start ZAYRA Live."
        );
      }

      const answerSdp = await response.text();

      // Complete the connection
      await peer.setRemoteDescription({
        type: "answer",
        sdp: answerSdp,
      });

      setIsLive(true);
    } catch (error) {
      console.error("ZAYRA Live error:", error);

      setLiveError(
        error.message ||
          "ZAYRA couldn't start a conversation. Try again, babe. ♡"
      );

      stopLive();
    } finally {
      setLiveConnecting(false);
    }
  };

  // Release microphone and connection when leaving the page
  useEffect(() => {
    return () => {
      if (peerRef.current) {
        peerRef.current.close();
      }

      if (micStreamRef.current) {
        micStreamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <section className="zayra-briefing">
      <div className="briefing-header">
        <div>
          <p className="eyebrow">♡ ZAYRA AI</p>

          <h2>Your little life update</h2>

          <p className="briefing-intro">
            Good morning, Zee. Let's see what we're working with today.
          </p>
        </div>

        <button
          className="briefing-speak"
          onClick={isLive ? stopLive : startLive}
          disabled={liveConnecting}
        >
          {liveConnecting
            ? "💋 Getting ZAYRA ready..."
            : isLive
            ? "♡ End our chat"
            : "🎀 Talk to me babe"}
        </button>
      </div>

      {liveConnecting && (
        <p role="status">
          One sec, babe. ZAYRA is getting ready. ♡
        </p>
      )}

      {isLive && (
        <p role="status">
          💋 We're connected! Go ahead and talk to me, Zee.
        </p>
      )}

      {liveError && (
        <p role="alert">
          {liveError}
        </p>
      )}

      {/* Keep your existing AI briefing card */}
      <div className="briefing-card briefing-ai-message">
        <span className="briefing-icon">✨</span>

        <div>
          <p className="card-label">ZAYRA SAYS</p>

          <h3>
            {aiLoading
              ? "Checking in..."
              : aiError
              ? "Oops ♡"
              : "Your daily briefing"}
          </h3>

          <p>
            {aiLoading
              ? "Give me a second. I'm putting the pieces together..."
              : aiError
              ? aiError
              : aiBriefing}
          </p>
        </div>
      </div>

      <audio ref={audioRef} autoPlay />
    </section>
  );
}

export default ZayraBriefing;