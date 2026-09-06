import { getPushTokenState } from './pushTokenStore';

/**
 * Decided v6 — Section 17.3 item 39: push is checked for a valid token before
 * dispatch; an absent/invalid/`Unregistered` token falls back immediately to
 * WhatsApp Business API (interactive quick-reply: "Claim Slot"/"Decline"),
 * then SMS with an expirable claim-token link as a second fallback. This is a
 * pure simulation (no real push/WhatsApp/SMS providers exist yet) that
 * returns a log of what was attempted, so the fallback chain is visible in
 * the UI rather than only implemented silently.
 */
export type DeliveryChannel = 'Push' | 'WhatsApp' | 'SMS';

export type DeliveryLogEntry = {
  channel: DeliveryChannel;
  message: string;
};

export function makeClaimToken(): string {
  return `${Date.now().toString(36)}${Math.round(Math.random() * 1e6).toString(36)}`;
}

export function dispatchRescheduleNotification(doctorName: string, claimToken: string): DeliveryLogEntry[] {
  const tokenState = getPushTokenState();

  if (tokenState === 'VALID') {
    return [
      {
        channel: 'Push',
        message: `Valid push token found — "${doctorName} is unavailable" notification delivered via push.`,
      },
    ];
  }

  const reason = tokenState === 'MISSING' ? 'absent' : 'Unregistered';
  return [
    { channel: 'Push', message: `Push token ${reason} — skipping push, falling back.` },
    {
      channel: 'WhatsApp',
      message:
        'Sent via WhatsApp Business API — interactive message with quick-reply buttons: "Claim Slot" / "Decline".',
    },
    {
      channel: 'SMS',
      message: `Second fallback — SMS sent with expirable claim link: openque.in/c/${claimToken}`,
    },
  ];
}
