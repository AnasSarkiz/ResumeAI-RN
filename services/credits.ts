import { doc, getDoc, runTransaction, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import * as IAP from 'react-native-iap';

export type CreditBundleId = 'bundle_10' | 'bundle_30' | 'bundle_80';

export const CREDIT_BUNDLES: Record<
  CreditBundleId,
  { credits: number; price: number; label: string; iapProductId?: string }
> = {
  bundle_10: { credits: 10, price: 2.99, label: '10 Career Credits', iapProductId: 'cc_10' },
  bundle_30: { credits: 30, price: 6.99, label: '30 Career Credits', iapProductId: 'cc_30' },
  bundle_80: {
    credits: 80,
    price: 14.99,
    label: '80 Career Credits (Best Value)',
    iapProductId: 'cc_80',
  },
};

export const CREDIT_COSTS = {
  AI_GENERATE: 3,
  TEMPLATE_PREMIUM_UNLOCK: 5,
  AI_REWRITE: 1,
};

export const getCreditBalance = async (userId: string): Promise<number> => {
  const ref = doc(db, 'users', userId);
  const snap = await getDoc(ref);
  const data = snap.data() as any;
  return typeof data?.creditBalance === 'number' ? data.creditBalance : 0;
};

export const ensureUserDoc = async (userId: string) => {
  const ref = doc(db, 'users', userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(
      ref,
      { id: userId, createdAt: serverTimestamp(), lastLogin: serverTimestamp(), creditBalance: 0 },
      { merge: true }
    );
  }
};

export const addCredits = async (
  userId: string,
  amount: number,
  source: { type: 'iap' | 'admin'; referenceId?: string }
) => {
  if (amount <= 0) return;
  await ensureUserDoc(userId);
  await runTransaction(db, async (tx) => {
    const ref = doc(db, 'users', userId);
    const snap = await tx.get(ref);
    const curr = (snap.data() as any)?.creditBalance || 0;
    tx.set(
      ref,
      {
        creditBalance: curr + amount,
        lastCreditUpdate: serverTimestamp(),
      },
      { merge: true }
    );
    // Optionally write a ledger
    const ledgerRef = doc(
      db,
      'users',
      userId,
      'credit_ledger',
      referenceIdOrNow(source.referenceId)
    );
    tx.set(ledgerRef, {
      ts: serverTimestamp(),
      delta: amount,
      reason: 'purchase',
      source: source.type,
      referenceId: source.referenceId || null,
    });
  });
};

export const consumeCredits = async (userId: string, amount: number, reason: string = 'usage') => {
  if (amount <= 0) return;
  await runTransaction(db, async (tx) => {
    const ref = doc(db, 'users', userId);
    const snap = await tx.get(ref);
    const curr = (snap.data() as any)?.creditBalance || 0;
    if (curr < amount) throw new Error('Not enough Career Credits');
    tx.set(
      ref,
      {
        creditBalance: curr - amount,
        lastCreditUpdate: serverTimestamp(),
      },
      { merge: true }
    );
    const ledgerRef = doc(db, 'users', userId, 'credit_ledger', referenceIdOrNow());
    tx.set(ledgerRef, {
      ts: serverTimestamp(),
      delta: -amount,
      reason,
    });
  });
};

const referenceIdOrNow = (id?: string) => id || `ref_${Date.now()}`;

// iOS: react-native-iap consumables
export const purchaseCreditsIOS = async (userId: string, bundle: CreditBundleId = 'bundle_10') => {
  const def = CREDIT_BUNDLES[bundle];
  if (!IAP) throw new Error('In-App Purchases not available');
  try {
    await IAP.initConnection();
    // Ensure product is known to the store (optional but helpful)
    const skus = Object.values(CREDIT_BUNDLES)
      .map((b) => b.iapProductId)
      .filter(Boolean) as string[];
    if (skus.length) {
      try {
        await IAP.getProducts({ skus });
      } catch {}
    }
    const result = (await IAP.requestPurchase({
      sku: def.iapProductId ?? '',
    })) as IAP.ProductPurchase;
    // You must verify receipt server-side; here we optimistically credit and expect server to reconcile
    await addCredits(userId, def.credits, {
      type: 'iap',
      referenceId: result.transactionId || undefined,
    });
  } catch (e: any) {
    throw new Error(e?.message || 'IAP purchase failed');
  }
};

// =============================================
// Receipt verification placeholders (to be wired
// to a backend function or server later)
// =============================================

export interface ReceiptVerificationRequest {
  userId: string;
  platform: 'ios';
  productId: string; // e.g. 'cc_10'
  transactionId?: string;
  receipt?: string; // base64 receipt if available
}

export interface ReceiptVerificationResult {
  valid: boolean;
  creditsGranted?: number;
  message?: string;
}

// Placeholder: implement Cloud Function or server endpoint to verify with Apple
export const verifyIAPPurchase = async (
  _req: ReceiptVerificationRequest
): Promise<ReceiptVerificationResult> => {
  // TODO: POST to your secure backend which talks to App Store Server API
  // and returns whether the receipt/transaction is valid and how many credits
  // should be granted. For now, return not-verified to avoid accidental grants.
  return { valid: false, message: 'Verification not implemented' };
};
