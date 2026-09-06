/**
 * Mocked OTP verification — no SMS provider wired up yet.
 * Any 6-digit code is accepted EXCEPT this hardcoded test code, which is
 * reserved for demoing the OTP Verification — Error State screen.
 */
export const WRONG_OTP_TEST_CODE = '000000';

export function isOtpCorrect(code: string): boolean {
  return code.length === 6 && code !== WRONG_OTP_TEST_CODE;
}
