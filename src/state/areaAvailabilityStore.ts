/**
 * Dev-only toggle simulating whether OpenQue has launched in the patient's
 * area (Section 6.2 "Home Feed — Service Not Available in Area"). There is no
 * real geo/launch-area backend yet, so this is a plain in-memory flag flipped
 * from a dev control on the Home Feed — intentionally session-scoped, not
 * persisted, since it's a demo toggle rather than real account state.
 */
let isAreaAvailable = true;

export function getIsAreaAvailable(): boolean {
  return isAreaAvailable;
}

export function setIsAreaAvailable(value: boolean): void {
  isAreaAvailable = value;
}
